import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ContaService } from '../../../../core/services/conta.service';
import { Cliente } from '../../../../core/models/usuario.model';
import { Conta } from '../../../../core/models/conta.model';
import { ModalDeposito } from '../modals/modal-deposito/modal-deposito';
import { ModalSaque } from '../modals/modal-saque/modal-saque';
import { ModalTransferencia } from '../modals/modal-transferencia/modal-transferencia';
import { ModalExtrato } from '../modals/modal-extrato/modal-extrato';
import { ModalPerfil } from '../modals/modal-perfil/modal-perfil';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule
  ],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css' 
})
export class HomeCliente implements OnInit {
  cliente?: Cliente;
  conta?: any;

  constructor(
    private clienteService: ClienteService,
    private contaService: ContaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const logado = localStorage.getItem('usuarioLogado');
    if (logado) {
      const user = JSON.parse(logado);
      this.cliente = user;
      this.conta = {
        numero: '12345-6',
        saldo: user.salario ? user.salario * 2 : 0 
      };

      if(user.id) {
        this.carregarDados(user.id);
      }
    }
  }

  carregarDados(id: number) {
    this.clienteService.buscarPorId(id).subscribe({
      next: (c) => this.cliente = c,
      error: (err: HttpErrorResponse) => console.error(err)
    });

    this.contaService.getContaPorCliente(id).subscribe({
      next: (c) => this.conta = c,
      error: (err: HttpErrorResponse) => console.error(err)
    });
  }

  abrirModal(tipo: string) {
    if (tipo === 'deposito') {
      this.dialog.open(ModalDeposito, { width: '400px' });
    } else if (tipo === 'saque') {
      this.dialog.open(ModalSaque, { width: '400px' });
    } else if (tipo === 'transferencia') {
      this.dialog.open(ModalTransferencia, { width: '400px' });
    } else if (tipo === 'extrato') {
      this.dialog.open(ModalExtrato, { width: '400px' });
    } else if (tipo === 'perfil') {
      this.dialog.open(ModalPerfil, { width: '400px' });
    }
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}