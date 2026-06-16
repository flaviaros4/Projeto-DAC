import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ContaService } from '../../../../core/services/conta.service';
import { GerenteService } from '../../../../core/services/gerente.service';
import localePt from '@angular/common/locales/pt';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

registerLocaleData(localePt);

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-clientes.html',
  styleUrl: './relatorio-clientes.css',
})
export class RelatorioClientes implements OnInit {
  clientes: any[] = [];
  isLoading = true;
  erro = '';

  constructor(
    private clienteService: ClienteService,
    private contaService: ContaService,
    private gerenteService: GerenteService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {

    forkJoin({
      clientes: this.clienteService.listarRelatorio(),
      contas: this.contaService.listarContas(),
      gerentes: this.gerenteService.listarGerentes()
    }).subscribe({
      next: ({ clientes, contas, gerentes }) => {
        this.clientes = clientes
          .map((cliente: any) => {
            const conta = contas.find((c: any) => c.cliente === cliente.cpf);
            const gerente = conta
              ? gerentes.find((g: any) => g.cpf === conta.gerente)
              : null;
            return {
              ...cliente,
              numeroConta: conta?.numero   || '-',
              saldo:       conta?.saldo    ?? null,
              limite:      conta?.limite   ?? null,
              gerente: {
                nome: gerente?.nome || '-',
                cpf:  gerente?.cpf  || conta?.gerente || '-',
              }
            };
          })
          .sort((a: any, b: any) => a.nome.localeCompare(b.nome, 'pt-BR'));

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar relatório:', err);
        this.erro = 'Erro ao carregar relatório de clientes.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}