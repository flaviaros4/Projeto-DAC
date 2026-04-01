import { Component, inject, signal, Type } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { Perfil } from '../core/models/usuario.model';
import { ModalPerfil } from './pages/cliente/modals/modal-perfil/modal-perfil';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CurrencyMaskModule, CommonModule, MatIcon, RouterLinkWithHref],
  providers: [provideNgxMask()],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');
  readonly modalPerfilComponent = ModalPerfil;
  private router = inject(Router);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  get logado() {
    return this.authService.usuarioLogado;
  }

  ngOnInit(): void {
    if (this.logado) {
      console.log('Usuário logado:', this.logado);
    } else {
      console.log('Nenhum usuário logado');
    }
  }

  perfilLogado(perfil: Perfil) {
    if (this.logado && this.logado.perfil === perfil) {
      return true;
    }
    return false;
  }

  home() {
    if(this.logado) {
      if (this.logado.perfil === 'GERENTE') {
        this.router.navigate(['/home-gerente']);
      } else if (this.logado.perfil === 'CLIENTE') {
        this.router.navigate(['/home-cliente']);
      } else if (this.logado.perfil === 'ADMIN') {
        this.router.navigate(['/home-admin']);
      }
    } else {
      this.router.navigate(['/autocadastro']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/autocadastro']);
  }

  abrirModal(component: Type<unknown>, width = '400px') {
    this.dialog.open(component, { width });
  }
}
