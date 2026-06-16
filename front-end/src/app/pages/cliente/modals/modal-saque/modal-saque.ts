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
  selector: 'app-modal-saque',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Efetuar saque</h2>
    <mat-dialog-content>
      <p *ngIf="conta">
        Saldo: <strong>{{ conta.saldo | currency:'BRL' }}</strong>
        &nbsp;|&nbsp;
        Limite: <strong>{{ conta.limite | currency:'BRL' }}</strong>
      </p>
      <mat-form-field appearance="outline" style="width:100%;">
        <mat-label>Valor R$</mat-label>
        <input matInput type="number" [(ngModel)]="valor"/>
      </mat-form-field>
      <p *ngIf="erro" style="color:red;">{{ erro }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="confirmar()" [disabled]="carregando">
        {{ carregando ? 'Aguarde...' : 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ModalSaque implements OnInit {
  valor: number = 0;
  conta: any = null;
  numeroConta: string = '';
  carregando = false;
  erro = '';

  constructor(
    public dialogRef: MatDialogRef<ModalSaque>,
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
    if (this.valor <= 0) {
      this.erro = 'Informe um valor maior que zero.';
      return;
    }
    if (!this.conta || this.valor > (this.conta.saldo + this.conta.limite)) {
      this.erro = 'Saldo insuficiente (incluindo limite).';
      return;
    }
    this.carregando = true;
    this.erro = '';
    this.contaService.sacar(this.numeroConta, this.valor).subscribe({
      next: () => this.dialogRef.close({ sucesso: true }),
      error: () => {
        this.erro = 'Erro ao realizar saque. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}