import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogActions } from "@angular/material/dialog";
import { Cliente } from '../../../../../../core/models/usuario.model';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../../../../../core/services/cliente.service';

@Component({
  selector: 'app-rejeitar-cliente',
  imports: [MatDialogContent, MatDialogActions, NgxMaskPipe, CommonModule, FormsModule],
  template: `<mat-dialog-content>
    <h1> Rejeitar Cliente </h1>
    <div class="content">
      <div class="dados">
       <p> <b>Nome:</b> {{cliente.nome}}</p>
       <p> <b>CPF:</b> {{cliente.cpf | mask: '000.000.000-00'}}</p>
       <p> <b>Salário:</b> {{cliente.salario | currency:'BRL'}}</p>
      </div> 
  
      <div class="motivo">
        <h2>Motivo da rejeição:</h2>
        <textarea id="motivo" [(ngModel)]="motivo" rows="4" cols="50" placeholder="Digite o motivo da rejeição aqui..."></textarea>
      <p> O cliente receberá um email com o motivo da rejeição.</p>
      </div> 

      <mat-dialog-actions align="center">
        <button class="btn-rejeitar" (click)="rejeitar()">Rejeitar</button>
        <button class="btn-fechar" (click)="fechar()">Fechar</button>
</mat-dialog-actions>
  

    </div>
  </mat-dialog-content>`,
  styles: [`
  h1{
      color: #0F1F3D;
      text-align: center;
      padding: 10px;
  }
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .dados p {
      font-size: 16px;
    }
    .motivo {
       padding: 10px;
       text-align: center;     
        color: #0F1F3D;
    }
    .motivo p {
      font-size: 14px;
      text-align: center;

    
    }
    mat-dialog-actions {
     gap: 40px;
  
    }
    button {
 
      color: white;
      border: none;
      padding: 10px 30px; 
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-rejeitar {
      background-color: #f44336;
    }
    .btn-fechar {
      background-color: #0F1F3D;
    }
    .btn-rejeitar:hover {
      background-color: #d32f2f !important;
    }
    .btn-fechar:hover {
      background-color: #000000 !important;
    }
   
    
    `],
})
export class RejeitarCliente {
  cliente: Cliente;
  motivo = '';


  constructor(
    private dialogRef: MatDialogRef<RejeitarCliente>,
    private clienteService: ClienteService,
    @Inject(MAT_DIALOG_DATA) public data: { cliente: Cliente }
  ) {
    this.cliente = data.cliente;
  }

  rejeitar() {
    if (!this.motivo.trim()) {
      alert('Por favor, insira o motivo da rejeição.');
      return;
    }

    const dataRejeicao = new Date();

    this.clienteService
      .atualizarStatus(this.cliente.id, 'REJEITADO', this.motivo, dataRejeicao)
      .subscribe(() => {
        this.cliente.estado = 'REJEITADO';
        this.cliente.dataRejeicao = dataRejeicao;
        this.cliente.motivoRejeicao = this.motivo;

        console.log(`
    Email enviado para: ${this.cliente.email}

    Ola, ${this.cliente.nome}!

    Sua solicitação foi rejeitada.
    Motivo da rejeição: ${this.motivo}
  `);

        this.dialogRef.close(this.cliente);
      });
  }

  fechar() {
    this.dialogRef.close();
  }
}