import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { Cliente } from '../../../../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { Conta } from '../../../../../core/models/conta.model';
import { NgxMaskPipe } from 'ngx-mask';

interface DetalheClienteDialogData {
  cliente: Cliente;
  conta?: Conta;
}

@Component({
  selector: 'app-detalhe-cliente-dialog',
  template: `
    <div class="container">
    <div class="head">
      <h1> Detalhes do Cliente </h1>
      <button mat-raised-button  (click)="fechar()"> <b>X </b> </button>
    </div>
  
      <mat-dialog-content  >

      <div class="dados-cliente">
       <h2 > Dados Pessoais </h2>
       <div class="campo">  
       <span class="label"><b>Nome: </b></span>
        <span class="valor">{{cliente.nome}}</span>
       </div>
        <div class="campo">
        <span class="label"><b>CPF: </b></span>
        <span class="valor">{{cliente.cpf | mask:'000.000.000-00'}}</span>
       </div>
        <div class="campo">
        <span class="label"><b>Email: </b></span>
        <span class="valor">{{cliente.email}}</span>
        </div>
        <div class="campo">
        <span class="label"><b>Salário: </b></span>
        <span class="valor">{{cliente.salario | currency:'BRL'}}</span>
        </div>
        <div class="campo">
        <span class="label"><b>Telefone: </b></span>
        <span class="valor">{{cliente. telefone | mask:'(00) 00000-0000'}} </span>
        </div>
        <div class="campo">
        <span class="label"><b>Endereço: </b></span>
        <span class="valor">{{cliente.endereco.rua}}, {{cliente.endereco.numero}}, {{cliente.endereco.bairro}}, {{cliente.endereco.cidade}} - {{cliente.endereco.estado}}</span>
        </div>

    
      </div>

      <div class="dados-conta">

<h2>  Conta </h2>
      <div class="campo">
      <span class="label"><b>Número da Conta: </b></span>
      <span class="valor">{{conta?.numeroConta}}</span>

      </div>

      <div class="campo">
      <span class="label"><b>Saldo: </b></span>
      <span class="valor">{{conta?.saldo | currency:'BRL'}}</span>

      </div>

      <div class="campo">
      <span class="label"><b>Limite: </b></span>
      <span class="valor">{{conta?.limite | currency:'BRL'}}</span>

      </div>

      <div class="campo">
      <span class="label"><b>Data de Abertura: </b></span>
      <span class="valor">{{conta?.dataAbertura | date:'dd/MM/yyyy'}}</span>

      </div>



      </div>

      
        
      </mat-dialog-content>
        
 
  `,
  styles: [`
   
    .head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 10px 20px 0 20px;
     
     
    }
     h1 {
        font-size: 1.5rem;
        color: #333;

      }
  

        .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        
      }

   mat-dialog-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20px;
         min-width: 250px;
        
      }

      .dados-cliente, .dados-conta {
        background-color: #f5f5f5;
        border-radius: 8px;
        padding: 20px; 
        width: 100%;
        h2 {
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: bold;
          color: #333;
          text-align: center;
        }
        p {
          margin: 5px 0;
          color: #555;
        }
      }
    }
      .campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.label {
  font-size: 0.8rem;
  color: #888;
  
}

.valor {
  font-weight: 600;
  color: #222;
}
     
    button {
      background-color: #D4AF37 !important;
      border: none;
      color: white;
       
      border-radius: 8px;
      font-size: 1rem;
    padding: 10px 25px;
      width: auto;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #C9A227 !important;
    }
  `],
  imports: [MatDialogContent, CommonModule, MatDialogModule, NgxMaskPipe]
})
export class DetalheClienteDialog {

  cliente: Cliente;
  conta?: Conta;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DetalheClienteDialogData,
    private dialogRef: MatDialogRef<DetalheClienteDialog>
  ) {
    this.cliente = data.cliente;
    this.conta = data.conta;
  }

  fechar(): void {
    this.dialogRef.close();
  }

}