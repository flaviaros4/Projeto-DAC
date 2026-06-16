import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../core/services/auth.service';
import { ClienteService } from '../../../../../core/services/cliente.service';
import { ContaService } from '../../../../../core/services/conta.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="perfil-bg">
      <div class="perfil-card">
        <h2 class="perfil-titulo">Meu Perfil</h2>

        <div *ngIf="carregandoDados" style="text-align:center; padding:40px;">
          <p>Carregando dados...</p>
        </div>

        <div *ngIf="!carregandoDados" class="form-grid">
          <div class="col">
            <h3>Dados Pessoais</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome Completo</mat-label>
              <input matInput [(ngModel)]="form.nome">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>CPF</mat-label>
              <input matInput [value]="form.cpf" disabled class="disabled-input">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput [(ngModel)]="form.email">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Salário (R$)</mat-label>
              <input matInput type="number" [(ngModel)]="form.salario">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Telefone</mat-label>
              <input matInput [(ngModel)]="form.telefone">
            </mat-form-field>
          </div>

          <div class="col">
            <h3>Endereço</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>CEP</mat-label>
              <input matInput [(ngModel)]="form.cep">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Logradouro</mat-label>
              <input matInput [(ngModel)]="form.logradouro">
            </mat-form-field>

            <div class="row-flex">
              <mat-form-field appearance="outline" style="flex: 1;">
                <mat-label>Nº</mat-label>
                <input matInput [(ngModel)]="form.numero">
              </mat-form-field>
              <mat-form-field appearance="outline" style="flex: 2;">
                <mat-label>Complemento</mat-label>
                <input matInput [(ngModel)]="form.complemento">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cidade</mat-label>
              <input matInput [(ngModel)]="form.cidade">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>UF</mat-label>
              <input matInput [(ngModel)]="form.estado">
            </mat-form-field>
          </div>
        </div>

        <div *ngIf="contaInfo && !carregandoDados" style="margin-top:16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
          <strong>Conta:</strong> {{ contaInfo.numero }} &nbsp;|&nbsp;
          <strong>Saldo:</strong> <span [style.color]="contaInfo.saldo < 0 ? 'red' : 'inherit'">{{ contaInfo.saldo | currency:'BRL' }}</span> &nbsp;|&nbsp;
          <strong>Limite:</strong> {{ contaInfo.limite | currency:'BRL' }}
        </div>

        <p *ngIf="erro" style="color:red; margin-top:16px;">{{ erro }}</p>
        <p *ngIf="sucesso" style="color:green; margin-top:16px;">Perfil atualizado com sucesso!</p>

        <div class="actions" *ngIf="!carregandoDados">
          <button class="btn-salvar" (click)="salvar()" [disabled]="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perfil-bg { background-color: #f4f4f4; min-height: 100vh; padding: 40px; display: flex; justify-content: center; align-items: flex-start; box-sizing: border-box; }
    .perfil-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); width: 100%; max-width: 1000px; }
    .perfil-titulo { font-size: 28px; color: #0F1F3D; margin-top: 0; margin-bottom: 30px; border-bottom: 2px solid #f4f4f4; padding-bottom: 15px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .col h3 { font-size: 16px; color: #D4AF37; margin-bottom: 20px; border-left: 4px solid #D4AF37; padding-left: 10px; }
    .full-width { width: 100%; }
    .row-flex { display: flex; gap: 10px; }
    .disabled-input { background-color: #f9f9f9; cursor: not-allowed; }
    .actions { margin-top: 30px; display: flex; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 20px; }
    .btn-salvar { background-color: #D4AF37; color: white; border: none; padding: 12px 40px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .btn-salvar:hover:not([disabled]) { background-color: #b8962e; }
    .btn-salvar[disabled] { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class ModalPerfil implements OnInit {
  form: any = {};
  contaInfo: any = null;
  cpf = '';
  carregandoDados = true;
  salvando = false;
  erro = '';
  sucesso = false;

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private contaService: ContaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  
    this.cpf = this.authService.getCpf() || '';

    if (!this.cpf) {
      this.carregandoDados = false;
      this.erro = 'Sessão expirada. Faça login novamente.';
      return;
    }

    this.clienteService.buscarPorCpf(this.cpf).subscribe({
      next: (res: any) => {
        this.form = { ...res };
        this.carregandoDados = false;
  
        this.contaService.getContaPorCliente(this.cpf).subscribe({
          next: (conta: any) => {
            this.contaInfo = conta || null;
            this.cdr.detectChanges();
          },
          error: () => {  }
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.carregandoDados = false;
        this.erro = 'Não foi possível carregar os dados do perfil.';
        console.error('Erro ao buscar perfil:', err);
        this.cdr.detectChanges();
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.sucesso = false;
    this.clienteService.atualizar(this.cpf, this.form).subscribe({
      next: () => {
        this.sucesso = true;
        this.salvando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.erro = 'Erro ao salvar perfil.';
        this.salvando = false;
        console.error('Erro ao salvar:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
