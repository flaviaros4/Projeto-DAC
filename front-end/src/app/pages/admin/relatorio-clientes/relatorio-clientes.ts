import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ContaService } from '../../../../core/services/conta.service';
import { GerenteService } from '../../../../core/services/gerente.service';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

interface ClienteView {
  nome: string;
  email: string;
  cpf: string;
  salario: number;
  numeroConta: string;
  saldo: number;
  limite: number;
  gerente: {
    nome: string;
    cpf: string;
  };
}

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-clientes.html',
  styleUrl: './relatorio-clientes.css',
})
export class RelatorioClientes implements OnInit {

  clientes: ClienteView[] = [];
  isLoading = true;

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
    clientes: this.clienteService.listarClientes(),
    contas: this.contaService.listarContas(),
    gerentes: this.gerenteService.listarGerentes()
  }).subscribe({
    next: ({ clientes, contas, gerentes }) => {

      console.log('=== CLIENTES ===', clientes);
      console.log('=== CONTAS ===', contas);
      console.log('=== GERENTES ===', gerentes);

      this.clientes = clientes.map(c => {

        const conta = contas.find(ct => ct.clienteId === c.id);
        const gerente = gerentes.find(g => g.id === conta?.gerenteId);

        console.log('--- PROCESSANDO CLIENTE ---');
        console.log('Cliente:', c);
        console.log('Conta encontrada:', conta);
        console.log('Gerente encontrado:', gerente);

        return {
          nome: c.nome,
          email: c.email,
          cpf: c.cpf,
          salario: c.salario,
          numeroConta: String(conta?.numeroConta ?? '-'),
          saldo: conta?.saldo ?? 0,
          limite: conta?.limite ?? 0,
          gerente: {
            nome: gerente?.nome ?? 'N/A',
            cpf: gerente?.cpf ?? 'N/A'
          }
        };
      });

      console.log('=== RESULTADO FINAL (clientes) ===', this.clientes);

      this.isLoading = false;
      this.cd.detectChanges();
    },

    error: (err) => {
      console.error('❌ ERRO NA REQUISIÇÃO:', err);
      this.isLoading = false;
    }
  });
}
}