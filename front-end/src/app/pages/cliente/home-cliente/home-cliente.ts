import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContaService } from '../../../../core/services/conta.service';
import { AuthService } from '../../../../core/services/auth.service';
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
  conta?: any;

  constructor(
    private contaService: ContaService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  get logado() {
    return this.authService.usuarioLogado;
  }

  ngOnInit() {
    const cpf = this.authService.getCpf();
    if (cpf) {
      this.carregarDados(cpf);
    }
  }

  carregarDados(cpf: string) {
    this.contaService.getContaPorCliente(cpf).subscribe({
      next: (conta) => {
        this.conta = conta ?? { saldo: 0, limite: 0 };
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar conta:', err);
      }
    });
  }

  abrirModal(tipo: string) {
    let dialogRef: any;

    if (tipo === 'deposito') {
      dialogRef = this.dialog.open(ModalDeposito, { width: '400px' });
    } else if (tipo === 'saque') {
      dialogRef = this.dialog.open(ModalSaque, { width: '400px' });
    } else if (tipo === 'transferencia') {
      dialogRef = this.dialog.open(ModalTransferencia, { width: '400px' });
    } else if (tipo === 'extrato') {
      dialogRef = this.dialog.open(ModalExtrato, { width: '900px', maxWidth: '95vw' });
    } else if (tipo === 'perfil') {
      dialogRef = this.dialog.open(ModalPerfil, { width: '900px', maxWidth: '95vw' });
    }

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(() => {

        const cpf = this.authService.getCpf();
        if (cpf) {
          this.carregarDados(cpf);
        }
      });
    }
  }
}
