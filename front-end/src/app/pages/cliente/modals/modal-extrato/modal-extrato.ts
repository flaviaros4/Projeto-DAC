import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacaoService } from '../../../../../core/services/transacao.service';
import { ClienteService } from '../../../../../core/services/cliente.service';
import { forkJoin, map, of } from 'rxjs';

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
              <ng-container *ngFor="let linha of linhasTabela">
                <tr *ngIf="linha.isTransacao">
                  <td [ngClass]="linha.dados.classeCor">{{ linha.dados.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td [ngClass]="linha.dados.classeCor">{{ linha.dados.tipo }}</td>
                  <td [ngClass]="linha.dados.classeCor">{{ linha.dados.nomeCliente || '-' }}</td>
                  <td [ngClass]="linha.dados.classeCor" style="font-weight:bold">
                    {{ linha.dados.isSaida ? '-' : '' }} {{ linha.dados.valor | currency:'BRL' }}
                  </td>
                </tr>

                <tr *ngIf="!linha.isTransacao"
                    [class.linha-saldo]="linha.temMovimentacao"
                    [class.linha-saldo-vazio]="!linha.temMovimentacao">
                  <td colspan="3" class="texto-saldo">
                    Saldo consolidado do dia ({{ linha.data | date:'dd/MM/yyyy':'UTC' }})
                  </td>
                  <td class="valor-saldo" [ngClass]="{'positivo': linha.saldo >= 0, 'negativo': linha.saldo < 0}">
                    {{ linha.saldo | currency:'BRL' }}
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
          <div *ngIf="linhasTabela.length === 0 && consultado" class="vazio">
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
    .titulo-pagina { 
      font-size: 28px; 
      color: #0F1F3D; 
      margin-bottom: 30px; 
      margin-top: 0; 
    }
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
    .campo-data {
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    .campo-data label {
      font-size: 12px; 
      color: #666; 
      font-weight: bold; 
      text-transform: uppercase; 
    }
    .campo-data input {
      padding: 10px; 
      border-radius: 6px; 
      border: 1px solid #ddd; 
      outline: none; 
    }
    .btn-consultar { 
      background-color: #D4AF37; 
      color: white; 
      border: none; 
      padding: 11px 30px; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: bold; 
      transition: 0.3s; 
    }
    .btn-consultar:hover { 
      background-color: #b8962e; 
    }
    .tabela-container {
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
    }
    th { 
      background: #fafafa; 
      padding: 15px; 
      text-align: left; 
      color: #0F1F3D; 
      border-bottom: 2px solid #f4f4f4; 
    }
    td { 
      padding: 12px 15px; 
      border-bottom: 1px solid #f4f4f4; 
      font-size: 14px; 
    }
    .entrada { 
      color: blue !important; 
    }
    .saida { 
      color: red !important; 
    }
    .linha-saldo { 
      background-color: #e9ecef; 
    }
    .linha-saldo-vazio { 
      background-color: #f9f9f9; 
    }
    .texto-saldo { 
      text-align: right; 
      font-weight: bold; 
      color: #555; 
      text-transform: uppercase; 
      font-size: 12px; 
    }
    .linha-saldo-vazio .texto-saldo { 
      color: #888; 
      font-weight: normal; 
      font-size: 11px; 
    }
    .valor-saldo { 
      font-weight: bold; 
      font-size: 15px; 
    }
    .linha-saldo-vazio .valor-saldo { 
      font-weight: normal; 
      font-size: 13px; 
      color: #666 !important; 
    }
    .positivo { 
      color: blue; 
    }
    .negativo { 
      color: red; 
    }
    .vazio { 
      padding: 50px; 
      text-align: center; 
      color: #888; 
      background: white; 
    }
  `]
})
export class ModalExtrato implements OnInit {
  dataInicio = '';
  dataFim = '';
  linhasTabela: any[] = [];
  consultado = false;

  constructor(
    private transacaoService: TransacaoService,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const hoje = new Date().toISOString().split('T')[0];
    this.dataInicio = hoje;
    this.dataFim = hoje;
  }

  calcular(t: any, userId: number): number {
    if (t.tipo === 'DEPOSITO') return Number(t.valor);
    if (t.tipo === 'SAQUE') return -Number(t.valor);
    if (t.tipo === 'TRANSFERENCIA') {
      return Number(t.clienteORigem) === userId ? -Number(t.valor) : Number(t.valor);
    }
    return 0;
  }

  extrairDataISO(dataStr: string): string {
    if (!dataStr) return '';
    if (dataStr.match(/^\d{4}-\d{2}-\d{2}/)) return dataStr.substring(0, 10);
    const partes = dataStr.split(/[ \/:-T]/);
    if (partes.length >= 3 && partes[0].length === 2 && partes[2].length === 4) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    }
    return dataStr.substring(0, 10);
  }

  consultar() {
    if (!this.dataInicio || !this.dataFim) return;

    const auth = sessionStorage.getItem('auth') || localStorage.getItem('auth');
    const user = JSON.parse(auth || '{}');
    const userId = Number(user.usuarioId ?? user.id);

    this.transacaoService.listarTodas().subscribe((todasDoServidor: any[]) => {
      const minhasTransacoes = todasDoServidor.filter(t =>
        Number(t.clienteORigem) === userId || 
        Number(t.clienteDestino) === userId ||
        Number(t.clienteId) === userId
      );

      minhasTransacoes.sort((a, b) => {
        const tA = new Date(this.extrairDataISO(a.dataHora)).getTime() || 0;
        const tB = new Date(this.extrairDataISO(b.dataHora)).getTime() || 0;
        return tA - tB || a.id - b.id;
      });

      let saldoAcumulado = 0;
      const transacoesNoPeriodo: any[] = [];

      minhasTransacoes.forEach(t => {
        if (!t.dataHora) return;
        const dataApenas = this.extrairDataISO(t.dataHora);
        if (dataApenas < this.dataInicio) {
          saldoAcumulado += this.calcular(t, userId);
        } else if (dataApenas >= this.dataInicio && dataApenas <= this.dataFim) {
          transacoesNoPeriodo.push(t);
        }
      });

      const chamadasNomes = transacoesNoPeriodo.map(t => {
        const idBusca = t.tipo === 'TRANSFERENCIA'
          ? (Number(t.clienteORigem) === userId ? t.clienteDestino : t.clienteORigem)
          : t.clienteORigem;

        const isSaida = t.tipo === 'SAQUE' ||
          (t.tipo === 'TRANSFERENCIA' && Number(t.clienteORigem) === userId);

        return this.clienteService.buscarPorId(Number(idBusca)).pipe(
          map((c: any) => ({
            ...t,
            nomeCliente: c?.nome || 'Sistema',
            isSaida,
            classeCor: isSaida ? 'saida' : 'entrada'
          }))
        );
      });

      const obsNomes = chamadasNomes.length > 0 ? forkJoin(chamadasNomes) : of([]);

      obsNomes.subscribe((transacoesComNomes: any[]) => {
        const tabelaMontada: any[] = [];
        const porDia = new Map<string, any[]>();
        
        transacoesComNomes.forEach(t => {
          const dia = this.extrairDataISO(t.dataHora);
          if (!porDia.has(dia)) porDia.set(dia, []);
          porDia.get(dia)!.push(t);
        });

        let dataIteracao = new Date(this.dataInicio + 'T12:00:00');
        const dataFimDate = new Date(this.dataFim + 'T12:00:00');

        while (dataIteracao <= dataFimDate) {
          const dataString = dataIteracao.toISOString().substring(0, 10);
          const transacoesDoDia = porDia.get(dataString) || [];

          transacoesDoDia.forEach(t => {
            saldoAcumulado += this.calcular(t, userId);
            tabelaMontada.push({ isTransacao: true, dados: t });
          });

          tabelaMontada.push({
            isTransacao: false,
            data: dataString,
            saldo: saldoAcumulado,
            temMovimentacao: transacoesDoDia.length > 0
          });

          dataIteracao.setDate(dataIteracao.getDate() + 1);
        }

        this.linhasTabela = tabelaMontada.reverse();
        this.consultado = true;
        this.cdr.detectChanges();
      });
    });
  }
}