import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClienteService } from '../../../../../core/services/cliente.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="perfil-bg">
      <div class="perfil-card">
        <h2 class="perfil-titulo">Meu Perfil</h2>
        
        <div class="form-grid">
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
              <input matInput [(ngModel)]="form.endereco.cep">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Logradouro</mat-label>
              <input matInput [(ngModel)]="form.endereco.logradouro">
            </mat-form-field>

            <div class="row-flex">
              <mat-form-field appearance="outline" style="flex: 1;">
                <mat-label>Nº</mat-label>
                <input matInput [(ngModel)]="form.endereco.numero">
              </mat-form-field>
              <mat-form-field appearance="outline" style="flex: 2;">
                <mat-label>Complemento</mat-label>
                <input matInput [(ngModel)]="form.endereco.complemento">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Bairro</mat-label>
              <input matInput [(ngModel)]="form.endereco.bairro">
            </mat-form-field>

            <div class="row-flex">
              <mat-form-field appearance="outline" style="flex: 3;">
                <mat-label>Cidade</mat-label>
                <input matInput [(ngModel)]="form.endereco.cidade">
              </mat-form-field>
              <mat-form-field appearance="outline" style="flex: 1;">
                <mat-label>UF</mat-label>
                <input matInput [(ngModel)]="form.endereco.estado">
              </mat-form-field>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="btn-salvar" (click)="salvar()">Salvar alterações</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perfil-bg { 
      background-color: #f4f4f4; 
      min-height: 100vh; 
      margin-left: 0px;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
    }
    .perfil-card { 
      background: white; 
      padding: 40px; 
      border-radius: 12px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
      width: 100%;
      max-width: 1000px; 
    }
    .perfil-titulo { font-size: 28px; color: #0F1F3D; margin-top: 0; margin-bottom: 30px; border-bottom: 2px solid #f4f4f4; padding-bottom: 15px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .col h3 { font-size: 16px; color: #D4AF37; margin-bottom: 20px; border-left: 4px solid #D4AF37; padding-left: 10px; }
    .full-width { width: 100%; }
    .row-flex { display: flex; gap: 10px; }
    .disabled-input { background-color: #f9f9f9; cursor: not-allowed; }
    .actions { margin-top: 30px; display: flex; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 20px; }
    .btn-salvar { background-color: #D4AF37; color: white; border: none; padding: 12px 40px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; }
    .btn-salvar:hover { background-color: #b8962e; transform: translateY(-2px); }
  `]
})
export class ModalPerfil implements OnInit {
  form: any = { endereco: {} };

  constructor(private clienteService: ClienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      const user = JSON.parse(auth);
      this.clienteService.buscarPorId(user.usuarioId).subscribe(res => {
        this.form = res;
        this.cdr.detectChanges();
      });
    }
  }

  salvar(): void {
    this.clienteService.atualizar(this.form.id, this.form).subscribe(() => {
      alert('Perfil atualizado com sucesso!');
    });
  }
}