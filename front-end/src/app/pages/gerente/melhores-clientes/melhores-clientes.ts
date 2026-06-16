import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ContaService } from '../../../../core/services/conta.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-melhores-clientes',
  imports: [MatIcon, RouterLink, CommonModule, NgxMaskPipe, MatTableModule],
  templateUrl: './melhores-clientes.html',
  styleUrl: './melhores-clientes.css',
})
export class MelhoresClientes implements OnInit {
  displayedColumns: string[] = ['cpf', 'nome', 'cidade', 'estado', 'saldo'];
  dataSource = new MatTableDataSource<any>([]);
  clientes: any[] = [];
  carregando = true;

  constructor(
    private router: Router,
    private contaService: ContaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.listarMelhoresClientes();
  }

  listarMelhoresClientes(): void {

    this.contaService.melhoresSaldos().subscribe({
      next: (contas: any[]) => {
        if (!contas || contas.length === 0) {
          this.clientes = [];
          this.dataSource.data = [];
          this.carregando = false;
          return;
        }
    
        const requests = contas.map(conta =>
          this.clienteService.buscarPorCpf(conta.cliente).pipe(
            map((cliente: any) => ({
              cpf: conta.cliente,
              nome: cliente?.nome || '-',
              cidade: cliente?.cidade || '-',
              estado: cliente?.estado || '-',
              saldo: conta.saldo,
              limite: conta.limite,
              numero: conta.numero,
            })),
            catchError(() => of({
              cpf: conta.cliente,
              nome: '-',
              cidade: '-',
              estado: '-',
              saldo: conta.saldo,
              limite: conta.limite,
              numero: conta.numero,
            }))
          )
        );
        forkJoin(requests).subscribe({
          next: (dados: any[]) => {
            this.clientes = dados;
            this.dataSource.data = dados;
            this.carregando = false;
          },
          error: () => { this.carregando = false; }
        });
      },
      error: (err) => {
        console.error('Erro ao listar melhores clientes:', err);
        this.carregando = false;
      }
    });
  }
}
