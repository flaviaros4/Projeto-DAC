import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { Cliente } from '../../../../../../core/models/usuario.model';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../../../core/services/cliente.service';

@Component({
  selector: 'app-rejeitar-cliente',
  imports: [MatDialogContent, MatDialogActions, NgxMaskPipe, CommonModule, FormsModule],
  template: `
    <mat-dialog-content>
      <h1>Rejeitar Cliente</h1>
      <div class="content">
        <div class="dados">
          <p><b>Nome:</b> {{ cliente.nome }}</p>
          <p><b>CPF:</b> {{ cliente.cpf | mask: '000.000.000-00' }}</p>
          <p><b>Salário:</b> {{ cliente.salario | currency:'BRL' }}</p>
        </div>
        <div class="motivo">
          <h2>Motivo da rejeição:</h2>
          <textarea id="motivo" [(ngModel)]="motivo" rows="4" cols="50" placeholder="Digite o motivo da rejeição aqui..."></textarea>
          <p>O cliente receberá um e-mail com o motivo da rejeição.</p>
        </div>
        <p *ngIf="erro" style="color:red; text-align:center;">{{ erro }}</p>
        <mat-dialog-actions align="center">
          <button class="btn-rejeitar" (click)="rejeitar()" [disabled]="carregando">
            {{ carregando ? 'Aguarde...' : 'Rejeitar' }}
          </button>
          <button class="btn-fechar" (click)="fechar()">Fechar</button>
        </mat-dialog-actions>
      </div>
    </mat-dialog-content>`,
  styles: [`
    h1 { color: #0F1F3D; text-align: center; padding: 10px; }
    .content { display: flex; flex-direction: column; gap: 10px; }
    .dados p { font-size: 16px; }
    .motivo { padding: 10px; text-align: center; color: #0F1F3D; }
    .motivo p { font-size: 14px; text-align: center; }
    mat-dialog-actions { gap: 40px; }
    button { color: white; border: none; padding: 10px 30px; font-size: 16px; font-weight: bold; cursor: pointer; }
    .btn-rejeitar { background-color: #f44336; }
    .btn-fechar { background-color: #0F1F3D; }
    .btn-rejeitar:hover:not([disabled]) { background-color: #d32f2f; }
    .btn-fechar:hover { background-color: #000000; }
    .btn-rejeitar[disabled] { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class RejeitarCliente {
  cliente: Cliente;
  motivo = '';
  carregando = false;
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<RejeitarCliente>,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: { cliente: Cliente }
  ) {
    this.cliente = data.cliente;
  }

  rejeitar() {
    if (!this.motivo.trim()) {
      this.erro = 'Por favor, insira o motivo da rejeição.';
      return;
    }
    this.carregando = true;
    this.erro = '';

    this.clienteService.rejeitar(this.cliente.cpf, this.motivo).subscribe({
      next: () => {
        this.dialogRef.close({ rejeitado: true });
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao rejeitar cliente.';
        this.carregando = false;
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}