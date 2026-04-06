import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from '../../../../../core/services/transacao.service';
import { ClienteService } from '../../../../../core/services/cliente.service';
import { forkJoin, map } from 'rxjs';

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
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Operação</th>
                <th>Origem/Destino</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of transacoesVisiveis">
                <td [ngClass]="t.tipo">{{ t.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
                <td [ngClass]="t.tipo">{{ t.tipo }}</td>
                <td [ngClass]="t.tipo">{{ t.nomeCliente || '-' }}</td>
                <td [ngClass]="t.tipo" style="font-weight: bold;">
                  {{ (t.tipo === 'SAQUE' || (t.tipo === 'TRANSFERENCIA' && t.isSaida)) ? '-' : '' }}
                  {{ t.valor | currency:'BRL' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="transacoesVisiveis.length === 0" class="vazio">
            Nenhuma movimentação encontrada.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .extrato-bg { 
      background-color: #f4f4f4; 
      min-height: 100vh; 
      margin-left: 0px;
      padding: 40px;
      box-sizing: border-box;
    }
    .titulo-pagina { font-size: 28px; color: #0F1F3D; margin-bottom: 30px; margin-top: 0; }
    .filtro-card { 
      display: flex; 
      gap: 20px; 
      align-items: flex-end; 
      margin-bottom: 25px; 
      padding: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .campo-data { display: flex; flex-direction: column; gap: 8px; }
    .campo-data label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; }
    .campo-data input { padding: 10px; border-radius: 6px; border: 1px solid #ddd; outline: none; }
    .btn-consultar { background-color: #D4AF37; color: white; border: none; padding: 11px 30px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; }
    .btn-consultar:hover { background-color: #b8962e; }
    .tabela-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; }
    th { background: #fafafa; padding: 15px; text-align: left; color: #0F1F3D; border-bottom: 2px solid #f4f4f4; }
    td { padding: 12px 15px; border-bottom: 1px solid #f4f4f4; font-size: 14px; }
    .DEPOSITO, .entrada { color: blue !important; }
    .SAQUE, .TRANSFERENCIA, .saida { color: red !important; }
    .vazio { padding: 50px; text-align: center; color: #888; background: white; }
  `]
})
export class ModalExtrato implements OnInit {
  dataInicio = '';
  dataFim = '';
  transacoesVisiveis: any[] = [];

  constructor(private transacaoService: TransacaoService, private clienteService: ClienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  consultar() {
    if (!this.dataInicio || !this.dataFim) return;

    const user = JSON.parse(sessionStorage.getItem('auth') || '{}');
    const dInicio = new Date(this.dataInicio + 'T00:00:00');
    const dFim = new Date(this.dataFim + 'T23:59:59');

    this.transacaoService.listarPorCliente(user.usuarioId).subscribe(res => {
      const filtradas = res.filter((t: any) => {
        const dataT = new Date(t.dataHora);
        return dataT >= dInicio && dataT <= dFim;
      }).sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

      if (filtradas.length === 0) {
        this.transacoesVisiveis = [];
        this.cdr.detectChanges();
        return;
      }

      const chamadasNomes = filtradas.map((t: any) => {
        const idBusca = t.tipo === 'TRANSFERENCIA' ? (t.clienteDestino || t.clienteORigem) : t.clienteORigem;
        return this.clienteService.buscarPorId(idBusca).pipe(
          map(c => ({ 
            ...t, 
            nomeCliente: c?.nome || 'N/A',
            isSaida: t.tipo === 'SAQUE' || (t.tipo === 'TRANSFERENCIA' && t.clienteORigem == user.usuarioId)
          }))
        );
      });

      forkJoin(chamadasNomes).subscribe(completo => {
        this.transacoesVisiveis = completo;
        this.cdr.detectChanges();
      });
    });
  }
}