import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-cliente.html',
  styleUrl: './home-cliente.css'
})
export class HomeCliente implements OnInit {
  saldo: number = -150.50;
  absSaldo: string = "";
  nomeUsuario: string = "cliente";

  constructor(private router: Router) {}

  ngOnInit() {
    const logado = localStorage.getItem('usuarioLogado');
    if (logado) {
      const user = JSON.parse(logado);
      this.nomeUsuario = user.nome || "cliente";
      this.saldo = user.saldo !== undefined ? user.saldo : -150.50;
    }

    this.absSaldo = Math.abs(this.saldo).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  }

  logout() {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}