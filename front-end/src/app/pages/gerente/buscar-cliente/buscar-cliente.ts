import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { Conta } from '../../../../core/models/conta.model';
import { Cliente } from '../../../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { ContaService } from '../../../../core/services/conta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { forkJoin } from 'rxjs';

type ClienteComConta = Cliente & {
  conta?: Conta;
};

@Component({
  selector: 'app-buscar-cliente',
  imports: [MatIcon, RouterLink, CommonModule, FormsModule, NgxMaskPipe],
  templateUrl: './buscar-cliente.html',
  styleUrl: './buscar-cliente.css',
})
export class BuscarCliente {

  clientes: Cliente[] = [];
  contas: Conta[] = [];

  cpfBusca: string = '';
  clienteSelecionado?: ClienteComConta;


  constructor(
    private clienteService: ClienteService,
    private contaService: ContaService
  ) { }

  ngOnInit() {
    forkJoin([
      this.clienteService.listarClientes(),
      this.contaService.listarContas()
    ]).subscribe(([clientes, contas]) => {
      this.clientes = clientes;
      this.contas = contas;
    });
  }

  buscarCliente(): void {

    if (!this.cpfBusca.trim()) return;

    const termo = this.cpfBusca.toLowerCase().trim();
    const termoCpf = this.cpfBusca.replace(/\D/g, '');

    const resultado = this.clientes
      .map(cliente => {
        const conta = this.contas.find(c => c.clienteId === cliente.id);

        return {
          ...cliente,
          saldo: conta?.saldo ?? 0,
          limite: conta?.limite ?? 0,
          conta
        };
      })
      .filter(cliente =>
        cliente.cpf.replace(/\D/g, '').includes(termoCpf)
      );



    if (resultado.length > 0) {
      this.clienteSelecionado = resultado[0];
    } else {
      this.clienteSelecionado = undefined;
    }
  }
}