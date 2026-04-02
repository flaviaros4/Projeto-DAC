import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { Cliente, Gerente } from '../../../../../../core/models/usuario.model';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { Conta } from '../../../../../../core/models/conta.model';
import { ContaService } from '../../../../../../core/services/conta.service';
import { GerenteService } from '../../../../../../core/services/gerente.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { ClienteService } from '../../../../../../core/services/cliente.service';
import { AuthService } from '../../../../../../core/services/auth.service';

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
        <button class="btn-aprovar" (click)="aprovar()">Aprovar</button>
        <button class="btn-fechar" (click)="fechar()">Fechar</button>
</mat-dialog-actions>
  

    </div>
  </mat-dialog-content>`,
  styles: [`
  h1{
      color: #0F1F3D;;
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
    button {
 
      color: white;
      border: none;
      padding: 10px 30px; 
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-aprovar {
      background-color: #4CAF50;
    }
    .btn-fechar {
      background-color: #0F1F3D;
    }
    .btn-aprovar:hover {
      background-color: #2d6330 !important;
    }
    .btn-fechar:hover {
      background-color: #000000 !important;
    }
   
    
    `],
})
export class AprovarCliente {
  cliente: Cliente;
  gerente: Gerente;
  limite: number;
  contas: Conta[] = [];


  constructor(
    private dialogRef: MatDialogRef<AprovarCliente>,
    private contaService: ContaService,
    private gerenteService: GerenteService,
    private clienteService: ClienteService,
    private authService: AuthService,
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

  getGerenteComMenosClientes() {
    return forkJoin({
      gerentes: this.gerenteService.listarGerentes(),
      contas: this.contaService.listarContas()
    }).pipe(
      map(({ gerentes, contas }) => {

        let gerenteEscolhido = gerentes[0];

        for (let gerente of gerentes) {
          let quantidade = contas.filter(c => c.gerenteId === gerente.id).length;
          let quantidadeAtual = contas.filter(c => c.gerenteId === gerenteEscolhido.id).length;

          if (quantidade < quantidadeAtual) {
            gerenteEscolhido = gerente;
          }
        }
        return gerenteEscolhido;
      }))
  }

  aprovar() {
    this.getGerenteComMenosClientes().subscribe(gerente => {
      const numeroConta = this.gerarNumeroConta();
      const senha = this.gerarSenha();
      const gerenteId = gerente.id;
      console.log('Gerente selecionado:', gerente.id);

      const novaConta: Conta = {
        clienteId: this.cliente.id,
        numeroConta,
        saldo: 0,
        limite: this.limite,
        gerenteId,
        dataAbertura: new Date()
      };




      this.cliente.estado = 'APROVADO';
      this.cliente.senha = senha;

      this.contaService.criarConta(novaConta).pipe(
        switchMap((contaCriada) => {
          console.log('Conta criada com sucesso:', contaCriada);
          return this.clienteService.atualizarStatus(this.cliente.id, 'APROVADO').pipe(
            switchMap(() => this.authService.criarUsuario({
              nome: this.cliente.nome,
              email: this.cliente.email,
              senha,
              perfil: 'CLIENTE',
              usuarioId: this.cliente.id
            })),
            map((usuarioCriado) => ({ contaCriada, usuarioCriado }))
          );
        })
      ).subscribe({
        next: ({ contaCriada, usuarioCriado }) => {
          console.log('Cliente aprovado com sucesso.');
          console.log('Usuario criado com sucesso:', usuarioCriado);

          console.log(`
    Email enviado para: ${this.cliente.email}

    Ola, ${this.cliente.nome}!

    Sua conta foi aprovada com sucesso.

    Número da conta: ${numeroConta}
    Senha de acesso: ${senha}

    Acesse o sistema para começar a usar sua conta.
  `);

          this.dialogRef.close(contaCriada);
        },
        error: (err) => {
          console.error('Erro ao aprovar cliente:', err);
        }
      });

    });

  }







  fechar(): void {
    this.dialogRef.close();
  }


}
