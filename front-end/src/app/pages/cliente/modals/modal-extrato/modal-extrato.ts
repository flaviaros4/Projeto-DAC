import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth.service';
import { ContaService } from '../../../../../core/services/conta.service';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="extrato-bg">
      <div class="extrato-container">
        <h2 class="titulo-pagina">Consultar extrato</h2>

        <div class="filtro-card">
          <div class="campo-data">
            <label>Início</label>
            <input type="date" [(ngModel)]="dataInicio">
          </div>
          <div class="campo-data">
            <label>Fim</label>
            <input type="date" [(ngModel)]="dataFim">
          </div>
          <button class="btn-consultar" (click)="consultar()">Consultar</button>
        </div>

        <div class="tabela-container">
          <table *ngIf="extrato">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Operação</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let mov of extrato.movimentacoes">
                <tr [ngClass]="corMovimentacao(mov)">
                  <td>{{ mov.data | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ mov.tipo }}</td>
                  <td>{{ mov.origem || '-' }}</td>
                  <td>{{ mov.destino || '-' }}</td>
                  <td style="font-weight:bold">{{ mov.valor | currency:'BRL' }}</td>
                </tr>
              </ng-container>
            </tbody>
          </table>
          <div *ngIf="extrato && extrato.movimentacoes?.length === 0" class="vazio">
            Nenhuma movimentação no período.
          </div>
          <div *ngIf="erro" class="vazio" style="color:red;">{{ erro }}</div>
          <div *ngIf="!extrato && !erro && consultado" class="vazio">Consultando...</div>
        </div>

        <div *ngIf="extrato" style="padding: 16px; font-weight: bold;">
          Saldo atual: {{ extrato.saldo | currency:'BRL' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .extrato-bg { background-color: #f4f4f4; min-height: 100vh; padding: 40px; box-sizing: border-box; }
    .titulo-pagina { font-size: 28px; color: #0F1F3D; margin-bottom: 30px; margin-top: 0; }
    .filtro-card { display: flex; gap: 20px; align-items: flex-end; margin-bottom: 25px; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .campo-data { display: flex; flex-direction: column; gap: 8px; }
    .campo-data label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; }
    .campo-data input { padding: 10px; border-radius: 6px; border: 1px solid #ddd; outline: none; }
    .btn-consultar { background-color: #D4AF37; color: white; border: none; padding: 11px 30px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .btn-consultar:hover { background-color: #b8962e; }
    .tabela-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; }
    th { background: #fafafa; padding: 15px; text-align: left; color: #0F1F3D; border-bottom: 2px solid #f4f4f4; }
    td { padding: 12px 15px; border-bottom: 1px solid #f4f4f4; font-size: 14px; }
    .entrada td { color: blue; }
    .saida td { color: red; }
    .vazio { padding: 50px; text-align: center; color: #888; }
  `]
})
export class ModalExtrato implements OnInit {
  dataInicio = '';
  dataFim = '';
  extrato: any = null;
  consultado = false;
  erro = '';
  numeroConta = '';

  constructor(
    private authService: AuthService,
    private contaService: ContaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const hoje = new Date().toISOString().split('T')[0];
    this.dataInicio = hoje;
    this.dataFim = hoje;

    
    const cpfSalvo = this.authService.getCpf();
    if (cpfSalvo) {
      
      this.contaService.getContaPorCliente(cpfSalvo).subscribe({
        next: (conta: any) => {
          if (conta) this.numeroConta = conta.numero || conta.numeroConta || '';
        }
      });
    }
  }

  corMovimentacao(mov: any): string {
    if (!mov || !mov.tipo) return '';
    const tipo = mov.tipo.toLowerCase();
    if (tipo === 'deposito' || tipo === 'depósito') return 'entrada';
    if (tipo === 'saque') return 'saida';

    if (tipo === 'transferencia' || tipo === 'transferência') {
      return mov.origem === this.numeroConta ? 'saida' : 'entrada';
    }
    return '';
  }

  consultar(): void {
    if (!this.dataInicio || !this.dataFim) return;
    if (!this.numeroConta) {
      this.erro = 'Conta não encontrada.';
      return;
    }
    this.consultado = true;
    this.erro = '';
    this.extrato = null;

    this.contaService.extrato(this.numeroConta, this.dataInicio, this.dataFim).subscribe({
      next: (res) => {
        this.extrato = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao buscar extrato. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }
}