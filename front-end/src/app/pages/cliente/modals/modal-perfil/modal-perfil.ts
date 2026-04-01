import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClienteService } from '../../../../../core/services/cliente.service';
import { ContaService } from '../../../../../core/services/conta.service';
import { GerenteService } from '../../../../../core/services/gerente.service';

@Component({
  selector: 'app-modal-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Meu Perfil</h2>
    <mat-dialog-content>
      <ng-container *ngIf="!salvoComSucesso">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Nome</mat-label>
          <input matInput [(ngModel)]="form.nome"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>CPF</mat-label>
          <input matInput [value]="form.cpf" disabled/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>E-mail</mat-label>
          <input matInput [(ngModel)]="form.email"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Telefone</mat-label>
          <input matInput [(ngModel)]="form.telefone"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Salário</mat-label>
          <input matInput type="number" [(ngModel)]="form.salario"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Rua</mat-label>
          <input matInput [(ngModel)]="form.endereco.rua"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Número</mat-label>
          <input matInput [(ngModel)]="form.endereco.numero"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Bairro</mat-label>
          <input matInput [(ngModel)]="form.endereco.bairro"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Cidade</mat-label>
          <input matInput [(ngModel)]="form.endereco.cidade"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Estado</mat-label>
          <input matInput [(ngModel)]="form.endereco.estado"/>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>CEP</mat-label>
          <input matInput [(ngModel)]="form.endereco.cep"/>
        </mat-form-field>
        <p *ngIf="erro" style="color:red">{{ erro }}</p>
      </ng-container>

      <ng-container *ngIf="salvoComSucesso && resumo">
        <h3>Dados atualizados com sucesso!</h3>
        <p><strong>Nome:</strong> {{ resumo.nome }}</p>
        <p><strong>E-mail:</strong> {{ resumo.email }}</p>
        <p><strong>Telefone:</strong> {{ resumo.telefone }}</p>
        <p><strong>Salário:</strong> {{ resumo.salario | currency:'BRL' }}</p>
        <p><strong>Saldo:</strong> {{ resumo.saldo | currency:'BRL' }}</p>
        <p><strong>Gerente:</strong> {{ resumo.nomeGerente }}</p>
      </ng-container>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="fechar()">{{ salvoComSucesso ? 'Fechar' : 'Cancelar' }}</button>
      <button *ngIf="!salvoComSucesso" mat-raised-button color="primary" (click)="confirmar()">Salvar</button>
    </mat-dialog-actions>
  `
})
export class ModalPerfil implements OnInit {
  form: any = { endereco: {} };
  erro = '';
  salvoComSucesso = false;
  resumo: any = null;
  clienteId: any;
  private conta: any;

  constructor(
    public dialogRef: MatDialogRef<ModalPerfil>,
    private clienteService: ClienteService,
    private contaService: ContaService,
    private gerenteService: GerenteService
  ) {}

  ngOnInit(): void {
    const logado = localStorage.getItem('auth');
    if (!logado) return;
    const user = JSON.parse(logado);
    this.clienteId = user.usuarioId;

    this.clienteService.buscarPorId(this.clienteId).subscribe({
      next: (cliente) => {
        this.form = { ...cliente, endereco: { ...cliente.endereco } };
      }
    });

    this.contaService.getContaPorCliente(Number(this.clienteId)).subscribe({
      next: (res) => this.conta = res
    });
  }

  calcularNovoLimite(salario: number): number {
    const novoLimite = salario;
    if (this.conta && this.conta.saldo < 0) {
      const saldoNegativo = Math.abs(this.conta.saldo);
      return Math.max(novoLimite, saldoNegativo);
    }
    return novoLimite;
  }

  confirmar(): void {
    if (!this.form.nome || !this.form.email || !this.form.salario) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }
    if (this.form.salario <= 0) {
      this.erro = 'Salário deve ser maior que zero.';
      return;
    }

    const novoLimite = this.calcularNovoLimite(Number(this.form.salario));

    this.clienteService.atualizar(this.clienteId, this.form).subscribe({
      next: () => {
        if (this.conta) {
          this.contaService.atualizarLimite(this.conta.id, novoLimite).subscribe();
        }

        this.gerenteService.buscarPorId(this.conta?.gerenteId?.toString()).subscribe({
          next: (gerente) => {
            this.resumo = {
              nome: this.form.nome,
              email: this.form.email,
              telefone: this.form.telefone,
              salario: this.form.salario,
              saldo: this.conta?.saldo ?? 0,
              nomeGerente: gerente?.nome ?? 'N/A'
            };
            this.salvoComSucesso = true;
          },
          error: () => {
            this.resumo = {
              nome: this.form.nome,
              email: this.form.email,
              telefone: this.form.telefone,
              salario: this.form.salario,
              saldo: this.conta?.saldo ?? 0,
              nomeGerente: 'N/A'
            };
            this.salvoComSucesso = true;
          }
        });
      },
      error: () => this.erro = 'Erro ao salvar perfil.'
    });
  }

  fechar(): void {
    this.dialogRef.close(this.salvoComSucesso);
  }
}