import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/models/usuario.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule } from '@angular/common';
import { ContaService } from '../../../../core/services/conta.service';
import { NgxMaskPipe } from 'ngx-mask';
import { DetalheClienteDialog } from './modals/cliente-detalhe';
import { MatDialog } from '@angular/material/dialog';
import { Conta } from '../../../../core/models/conta.model';

type ClienteComConta = Cliente & {
  saldo: number;
  limite: number;
  conta?: Conta;
};

@Component({
  selector: 'app-consultar-clientes',
  imports: [MatTableModule, CommonModule, MatSidenavModule, MatIcon, RouterLink, NgxMaskPipe],
  templateUrl: './consultar-clientes.html',
  styleUrl: './consultar-clientes.css',
})
export class ConsultarClientes {
  displayedColumns: string[] = ['cpf', 'nome', 'cidade', 'estado', 'saldo', 'limite', 'acoes'];
  dataSource = new MatTableDataSource<ClienteComConta>([]);

  clientes: ClienteComConta[] = [];
  clientesFiltrados: ClienteComConta[] = [];


  constructor(private router: Router,
    private clienteService: ClienteService,
    private contaService: ContaService, 
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.listarClientes();
  }

  listarClientes(): void {
    this.clienteService.listarClientes().subscribe(
      (clientes) => {
        this.contaService.listarContas().subscribe((contas) => {
          const clientesComConta = clientes
            .map((cliente) => {
              const conta = contas.find((c) => c.clienteId === cliente.id);
              return {
                ...cliente,
                saldo: conta ? conta.saldo : 0,
                limite: conta ? conta.limite : 0,
                conta,
              };
            })
            .sort((a, b) => a.nome.localeCompare(b.nome));

          this.clientes = clientesComConta;
          this.clientesFiltrados = clientesComConta;
          this.dataSource.data = clientesComConta;
        });
      },
      (error) => {
        console.error('Erro ao listar clientes:', error);
      }
    );
  }

  filtrarClientes(valor: string): void {
    const valorFiltrado = valor.trim().toLowerCase();

    this.clientesFiltrados = this.clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(valorFiltrado) ||
        cliente.cpf.includes(valorFiltrado)
    );
    this.dataSource.data = this.clientesFiltrados;
  }

  detalharCliente(cliente: ClienteComConta): void {

    this.dialog.open(DetalheClienteDialog,
      {
        data: {
          cliente,
          conta: cliente.conta,
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}
