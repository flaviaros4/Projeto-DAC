import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cliente } from '../../../../core/models/cliente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-gerente',
  imports: [MatTableModule, CommonModule],
  templateUrl: './home-gerente.html',
  styleUrl: './home-gerente.css',
})
export class HomeGerente {
  displayedColumns: string[] = ['cpf', 'nome', 'salario', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>([]);

  clientes: Cliente[] = [];

  constructor(private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.listarSolicitacoes();
  }

  listarSolicitacoes(): Cliente[] {
    this.clientes = this.clienteService.listarSolicitacoes();
    this.dataSource.data = this.clientes;
    return this.clientes;
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

}
