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
  selector: 'app-modal-deposito',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Efetuar depósito</h2>
    <mat-dialog-content>
      <p *ngIf="saldoAtual !== null">Saldo atual: <strong>{{ saldoAtual | currency:'BRL' }}</strong></p>
      <mat-form-field appearance="outline" style="width:100%; margin-top: 10px;">
        <mat-label>Valor R$</mat-label>
        <input matInput type="number" [(ngModel)]="valor" min="0.01"/>
      </mat-form-field>
      <p *ngIf="erro" style="color:red;">{{ erro }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="carregando">
        {{ carregando ? 'Aguarde...' : 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ModalDeposito implements OnInit {
  valor: number = 0;
  numeroConta: string = '';
  saldoAtual: number | null = null;
  carregando = false;
  erro = '';

  constructor(
    public dialogRef: MatDialogRef<ModalDeposito>,
    private authService: AuthService,
    private contaService: ContaService
  ) {}

  ngOnInit(): void {
    
    const cpfSalvo = this.authService.getCpf();
    if (cpfSalvo) {
      
      
      this.contaService.getContaPorCliente(cpfSalvo).subscribe({
        next: (conta: any) => {
          if (conta) {
            this.numeroConta = conta.numero || conta.numeroConta || '';
            this.saldoAtual = conta.saldo;
          }
        },
        error: () => this.erro = 'Não foi possível carregar a conta.'
      });
    }
  }

  confirmar(): void {
    if (this.valor <= 0) {
      this.erro = 'Informe um valor maior que zero.';
      return;
    }
    if (!this.numeroConta) {
      this.erro = 'Conta não encontrada.';
      return;
    }
    this.carregando = true;
    this.erro = '';
    this.contaService.depositar(this.numeroConta, this.valor).subscribe({
      next: () => this.dialogRef.close({ sucesso: true }),
      error: () => {
        this.erro = 'Erro ao realizar depósito. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}