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
import { Observable } from 'rxjs';


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

   isAuthenticated$!: Observable<boolean>; 
  userProfile: Perfil | null = null;

   get logado() {
    return this.authService.usuarioLogado;
  }

  ngOnInit(): void { 
    if(this.logado) {
      console.log(this.logado);
    } else {
      console.log('Nenhum usuário logado');
    }
    
     this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAuthenticated$.subscribe(isLogado => {
      if (isLogado) {
        this.userProfile = this.authService.getUserProfile();

        
      } else {
        this.userProfile = null;
    
      }
    })
   
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
      this.router.navigate(['/login']);
    }
  }
  temPermissao(perfis: Perfil): boolean {
    return this.logado ? this.logado.perfil === perfis : false;
   }
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModal(component: Type<unknown>, width = '400px') {
    this.dialog.open(component, { width });
  }
}
