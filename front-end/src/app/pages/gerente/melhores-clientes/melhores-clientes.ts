import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { ContaService } from '../../../../core/services/conta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Conta } from '../../../../core/models/conta.model';
import { Cliente } from '../../../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';

type ClienteComConta = Cliente & {
  saldo: number;
  conta?: Conta;
};

@Component({
  selector: 'app-melhores-clientes',
  imports: [MatIcon, RouterLink, CommonModule, NgxMaskPipe, MatTableModule],
  templateUrl: './melhores-clientes.html',
  styleUrl: './melhores-clientes.css',
})
export class MelhoresClientes {
  displayedColumns: string[] = ['cpf', 'nome', 'cidade', 'estado', 'saldo'];
  dataSource = new MatTableDataSource<ClienteComConta>([]);

  clientes: ClienteComConta[] = [];

  constructor(private router: Router,
    private clienteService: ClienteService,
    private contaService: ContaService,

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
                conta,
              };
            })
            .sort((a, b) => b.saldo - a.saldo).slice(0, 3);

          this.clientes = clientesComConta;
          this.dataSource.data = clientesComConta;
        });
      },
      (error) => {
        console.error('Erro ao listar clientes:', error);
      }
    );
  }
}
