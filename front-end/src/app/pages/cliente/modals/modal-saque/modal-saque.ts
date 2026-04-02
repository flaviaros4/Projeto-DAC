import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContaService } from '../../../../../core/services/conta.service';
import { TransacaoService } from '../../../../../core/services/transacao.service';

@Component({
  selector: 'app-modal-saque',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Efetuar Saque</h2>
    <mat-dialog-content>
      <p *ngIf="conta">
        Saldo disponível: <strong>{{ conta.saldo | currency:'BRL' }}</strong>
      </p>
      <mat-form-field appearance="outline" style="width:100%; margin-top:8px">
        <mat-label>Valor</mat-label>
        <input matInput type="number" [(ngModel)]="valor" min="0.01" placeholder="0,00"/>
      </mat-form-field>
      <p *ngIf="erro" style="color:red">{{ erro }}</p>
      <p *ngIf="sucesso" style="color:green">{{ sucesso }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="fechar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!valor || valor <= 0" (click)="confirmar()">Confirmar</button>
    </mat-dialog-actions>
  `
})
export class ModalSaque implements OnInit {
  valor: number = 0;
  erro = '';
  sucesso = '';
  conta: any;

  constructor(
    public dialogRef: MatDialogRef<ModalSaque>,
    private contaService: ContaService,
    private transacaoService: TransacaoService
  ) { }

  ngOnInit(): void {
    const logado =localStorage.getItem('auth');
    if (logado) {
      const user = JSON.parse(logado);
      this.contaService.getContaPorCliente(Number(user.usuarioId)).subscribe({
        next: (res) => this.conta = res
      });
    }
  }

  confirmar(): void {
    if (!this.valor || this.valor <= 0) {
      this.erro = 'Informe um valor válido.';
      return;
    }
    if (!this.conta) {
      this.erro = 'Conta não encontrada.';
      return;
    }

    const saldoDisponivel = this.conta.saldo + this.conta.limite;
    if (this.valor > saldoDisponivel) {
      this.erro = `Saldo insuficiente. Disponível: ${saldoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
      return;
    }

    const novoSaldo = this.conta.saldo - this.valor;

    this.contaService.atualizarSaldo(this.conta.id, novoSaldo).subscribe({
      next: () => {
        this.transacaoService.registrar({
          tipo: 'SAQUE',
          clienteORigem: this.conta.clienteId,
          clienteDestino: null,
          valor: this.valor,
          dataHora: new Date().toISOString()
        }).subscribe();
        this.sucesso = `Saque de ${this.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} realizado!`;
        this.erro = '';
        setTimeout(() => this.dialogRef.close(true), 1500);
      },
      error: () => this.erro = 'Erro ao realizar saque.'
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }
}