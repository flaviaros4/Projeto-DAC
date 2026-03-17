import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule,MatIconModule, MatCardModule, MatSidenavModule, MatListModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css'
})
export class HomeCliente implements OnInit {
  nomeUsuario: string = '';
  saldo: number = 0;
  absSaldo: string = '0,00';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const logado = localStorage.getItem('usuarioLogado');
    if (logado) {
      const user = JSON.parse(logado);
      this.nomeUsuario = user.nome || 'Cliente';
      this.saldo = user.salario || 0;
      this.formatarSaldo();
    } else {
      this.router.navigate(['/login']);
    }
  }

  formatarSaldo(): void {
    this.absSaldo = Math.abs(this.saldo).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}