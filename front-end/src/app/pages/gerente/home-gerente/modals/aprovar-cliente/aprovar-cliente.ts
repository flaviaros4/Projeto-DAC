import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from '../../../../../../core/models/usuario.model';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../../../../core/services/cliente.service';

interface AprovarClienteData {
  cliente: Cliente;
}

@Component({
  selector: 'app-aprovar-cliente',
  imports: [MatDialogContent, NgxMaskPipe, CommonModule, MatDialogActions],
  template: `
    <mat-dialog-content>
      <h1>Aprovar Cliente</h1>
      <div class="content">
        <div class="dados">
          <p><b>Nome:</b> {{ cliente.nome }}</p>
          <p><b>CPF:</b> {{ cliente.cpf | mask: '000.000.000-00' }}</p>
          <p><b>Salário:</b> {{ cliente.salario | currency:'BRL' }}</p>
        </div>
        <p><b>Limite calculado:</b> {{ limite | currency:'BRL' }}</p>
        <div class="info">
          <p>A conta será gerada automaticamente após a aprovação.</p>
          <p>Uma senha aleatória será enviada para o e-mail <b>{{ cliente.email }}</b>.</p>
        </div>
        <p *ngIf="erro" style="color:red; text-align:center;">{{ erro }}</p>
        <p *ngIf="sucesso" style="color:green; text-align:center;">Cliente aprovado com sucesso!</p>
        <mat-dialog-actions align="center">
          <button class="btn-aprovar" (click)="aprovar()" [disabled]="carregando || sucesso">
            {{ carregando ? 'Aguarde...' : 'Aprovar' }}
          </button>
          <button class="btn-fechar" (click)="fechar()">Fechar</button>
        </mat-dialog-actions>
      </div>
    </mat-dialog-content>`,
  styles: [`
    h1 { color: #0F1F3D; text-align: center; padding: 10px; }
    .content { display: flex; flex-direction: column; gap: 10px; }
    .dados p { font-size: 16px; }
    .info { background-color: #f0f0f0; padding: 8px; }
    .info p { font-size: 14px; text-align: center; }
    mat-dialog-actions { gap: 40px; }
    button { color: white; border: none; padding: 10px 30px; font-size: 16px; font-weight: bold; cursor: pointer; }
    .btn-aprovar { background-color: #4CAF50; }
    .btn-fechar { background-color: #0F1F3D; }
    .btn-aprovar:hover:not([disabled]) { background-color: #2d6330; }
    .btn-fechar:hover { background-color: #000000; }
    .btn-aprovar[disabled] { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class AprovarCliente implements OnInit {
  cliente: Cliente;
  limite: number;
  carregando = false;
  sucesso = false;
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<AprovarCliente>,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: AprovarClienteData
  ) {
    this.cliente = data.cliente;
    this.limite = data.cliente?.salario >= 2000 ? data.cliente.salario * 0.5 : 0;
  }

  ngOnInit() {}

  aprovar() {
    this.carregando = true;
    this.erro = '';

    this.clienteService.aprovar(this.cliente.cpf).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;
        setTimeout(() => this.dialogRef.close({ aprovado: true }), 1000);
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao aprovar cliente. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }
}