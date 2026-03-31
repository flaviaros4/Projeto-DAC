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
  cliente?: any;
  conta?: any;

  constructor(
    private clienteService: ClienteService,
    private contaService: ContaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const logado = localStorage.getItem('auth');
    if (logado) {
      const user = JSON.parse(logado);
      const idBusca = (user.usuarioId ?? user.id)?.toString();

      if(idBusca){
        this.carregarDados(idBusca);
      }
 } else {
  this.router.navigate(['/login']);
 }
}

carregarDados(id: string) {
  this.clienteService.buscarPorId(id).subscribe({
    next: (res) => {
      this.cliente = res;
    },
    error: (err) => {
      console.error("Erro ao buscar cliente:", err);
    }
  });

  this.contaService.getContaPorCliente(Number(id)).subscribe({
    next: (res) => {
     this.conta = res ?? {saldo: 0};
    },
    error: (err) => {
      this.conta = { saldo: 0 };
    }
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
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}