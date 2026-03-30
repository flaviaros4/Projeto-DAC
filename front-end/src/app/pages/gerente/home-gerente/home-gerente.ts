import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente } from '../../../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { NgxMaskPipe } from 'ngx-mask';
import { MatDialog } from '@angular/material/dialog';
import { AprovarCliente } from './modals/aprovar-cliente/aprovar-cliente';

@Component({
  selector: 'app-home-gerente',
  imports: [MatTableModule, CommonModule, MatSidenavModule, MatIcon, RouterLink, NgxMaskPipe ],
  templateUrl: './home-gerente.html',
  styleUrl: './home-gerente.css',
})
export class HomeGerente {
  displayedColumns: string[] = ['cpf', 'nome', 'salario', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>([]);

  clientes: Cliente[] = [];
  usuarioLogado: any;

  constructor(private router: Router,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.listarSolicitacoes();
  }

  listarSolicitacoes(): void {
    this.clienteService.listarSolicitacoes().subscribe(
      (clientes) => {
        this.clientes = clientes;
        this.dataSource.data = clientes;
      },
      (error) => {
        console.error('Erro ao listar solicitações:', error);
      }
    );
  }

  aprovarCliente(cliente: Cliente): void {
     this.dialog.open(AprovarCliente, {
      width: '600px',
      backdropClass: 'blurred-backdrop',
      data: { cliente }
    });
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

}
