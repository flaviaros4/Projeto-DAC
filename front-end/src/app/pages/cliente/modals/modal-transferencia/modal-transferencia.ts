import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../core/services/auth.service';
import { ContaService } from '../../../../../core/services/conta.service';

@Component({
  selector: 'app-modal-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Transferência</h2>
    <mat-dialog-content>
      <p *ngIf="conta">
        Saldo disponível: <strong>{{ (conta.saldo + conta.limite) | currency:'BRL' }}</strong>
      </p>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Número da conta destino</mat-label>
        <input matInput [(ngModel)]="contaDestino"/>
      </mat-form-field>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Valor R$</mat-label>
        <input matInput type="number" [(ngModel)]="valor"/>
      </mat-form-field>
      <p *ngIf="erro" style="color:red;">{{ erro }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="carregando">
        {{ carregando ? 'Aguarde...' : 'Transferir' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ModalTransferencia implements OnInit {
  valor: number = 0;
  contaDestino: string = '';
  conta: any = null;
  numeroConta: string = '';
  carregando = false;
  erro = '';

  constructor(
    public dialogRef: MatDialogRef<ModalTransferencia>,
    private authService: AuthService,
    private contaService: ContaService
  ) {}

  ngOnInit(): void {
    
    const cpfSalvo = this.authService.getCpf();
    if (cpfSalvo) {
      
      this.contaService.getContaPorCliente(cpfSalvo).subscribe({
        next: (conta: any) => {
          if (conta) {
            this.conta = conta;
            this.numeroConta = conta.numero || conta.numeroConta || '';
          }
        },
        error: () => this.erro = 'Não foi possível carregar a conta.'
      });
    }
  }

  confirmar(): void {
    if (!this.contaDestino.trim()) {
      this.erro = 'Informe o número da conta destino.';
      return;
    }
    if (this.valor <= 0) {
      this.erro = 'Informe um valor maior que zero.';
      return;
    }
    if (this.contaDestino === this.numeroConta) {
      this.erro = 'Não é possível transferir para a própria conta.';
      return;
    }
    this.carregando = true;
    this.erro = '';
    this.contaService.transferir(this.numeroConta, this.contaDestino, this.valor).subscribe({
      next: () => this.dialogRef.close({ sucesso: true }),
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao realizar transferência. Verifique os dados.';
        this.carregando = false;
      }
    });
  }
}