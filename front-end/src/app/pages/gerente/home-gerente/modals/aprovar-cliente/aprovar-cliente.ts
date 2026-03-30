import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { Cliente, Gerente } from '../../../../../../core/models/usuario.model';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { Conta } from '../../../../../../core/models/conta.model';
import { ContaService } from '../../../../../../core/services/conta.service';

interface AprovarClienteData {
  cliente: Cliente;
  gerente: Gerente;
}

@Component({
  selector: 'app-aprovar-cliente',
  imports: [MatDialogContent, NgxMaskPipe, CommonModule, MatDialogActions],
  template: `<mat-dialog-content>
    <h1> Aprovar Cliente </h1>
    <div class="content">
      <div class="dados">
       <p> <b>Nome:</b> {{cliente.nome}}</p>
       <p> <b>CPF:</b> {{cliente.cpf | mask: '000.000.000-00'}}</p>
       <p> <b>Salário:</b> {{cliente.salario | currency:'BRL'}}</p>
      </div> 
      <p> <b> Limite calculado: </b> {{limite | currency:'BRL'}}</p>
      <div class="info">
        <p>A conta será gerada automaticamente após a aprovação.</p>
        <p>Uma senha de 4 dígitos será enviada para o e-mail <b>{{cliente.email}}</b>.</p>
      </div>
      <mat-dialog-actions align="center">
        <button class="btn" (click)="aprovar()">Aprovar</button>
        <button class="btn" (click)="fechar()">Fechar</button>
</mat-dialog-actions>
  

    </div>
  </mat-dialog-content>`,
  styles: [`
  h1{
      color: #C9A227;
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
    .info{
        background-color: #f0f0f0;
    }
    .info p {
      font-size: 14px;
      text-align: center;
    
    }
    mat-dialog-actions {
     gap: 40px;
  
    }
    .btn {
      background-color: #C9A227;
      color: white;
      border: none;
      padding: 10px 30px; 
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn:hover {
      background-color: #A67C1B !important;
    }
    .btn:active {
      background-color: #8B5E0B !important;
    }
    
    `],
})
export class AprovarCliente {
  cliente: Cliente;
  gerente: Gerente;
  limite: number;


  constructor(
    private dialogRef: MatDialogRef<AprovarCliente>,
    private contaService: ContaService,
    @Inject(MAT_DIALOG_DATA) public data: AprovarClienteData
  ) {
    this.cliente = data.cliente;
    this.gerente = data.gerente;
    this.limite = data.cliente?.salario ? data.cliente.salario * 0.5 : 0;

  }

  ngOnInit() {
  console.log(this.gerente);
   console.log(this.cliente);
  
  }

  gerarNumeroConta(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  gerarSenha(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  aprovar() {
    const numeroConta = this.gerarNumeroConta();
    const senha = this.gerarSenha();

    const novaConta = {
      clienteId: this.cliente.id,
      numeroConta: numeroConta,
      saldo: 0,
      limite: this.limite,
      gerenteId: this.gerente.id,
      dataAbertura: new Date()
    };

    this.cliente.estado = 'APROVADO';
    this.cliente.senha = senha;

    this.contaService.criarConta(novaConta);

    console.log(`
    Email enviado para: ${this.cliente.email}

    Olá, ${this.cliente.nome}!

    Sua conta foi aprovada com sucesso

    Número da conta: ${numeroConta}
    Senha de acesso: ${senha}

    Acesse o sistema para começar a usar sua conta.
  `);

    this.dialogRef.close();
  }

  fechar(): void {
    this.dialogRef.close();
  }


}
