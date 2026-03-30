import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxMaskDirective, CurrencyMaskModule, CommonModule],
  providers: [provideNgxMask()],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-end');
  private router = inject(Router);
  private authService = inject(AuthService);

  logado: any;

  ngOnInit(): void {

   this.logado = JSON.parse(localStorage.getItem('auth') || 'null');
   console.log('Usuario logado:', this.logado);
   
   
  }

  logout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
