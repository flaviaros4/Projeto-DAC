import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

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
    private contaService: ContaService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router
  ) { }

  get logado() {
    return this.authService.usuarioLogado;
  }


  ngOnInit() {

    if (this.logado) {
      this.carregarDados(this.logado.usuarioId);
    }
  }

  carregarDados(id: number) {
    this.contaService.getContaPorCliente(id).subscribe({
      next: (conta) => {
        this.conta = conta ?? { saldo: 0 };
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Erro ao buscar conta:", err);
      }

    });


  }

  abrirModal(tipo: string) {
  let dialogRef;

  if (tipo === 'deposito') {
    dialogRef = this.dialog.open(ModalDeposito, { width: '400px' });
  } else if (tipo === 'saque') {
    dialogRef = this.dialog.open(ModalSaque, { width: '400px' });
  } else if (tipo === 'transferencia') {
    dialogRef = this.dialog.open(ModalTransferencia, { width: '400px' });
  } else if (tipo === 'extrato') {
    this.router.navigate(['/extrato']);
    return;
  } else if (tipo === 'perfil') {
    this.router.navigate(['/perfil']);
    return;
  }

  if (dialogRef) {
    dialogRef.afterClosed().subscribe(() => {
      if (this.logado) {
        this.carregarDados(this.logado.usuarioId);
      }
    });
  }
}
}
