import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

interface Gerente {
  nome: string;
  numeroClientes: number;
  saldoNegativo: number;
  saldoPositivo: number;
}

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css',
})
export class HomeAdmin implements OnInit {

  nomeUsuario: string = '';

  gerentes: Gerente[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    //os dados não persistem pq o local storage sempre atualiza pq não tem condição de existência prévia de dados em gerente
      const dadosIniciais: Gerente[] = [
        { nome: "Ricardo", numeroClientes: 30, saldoNegativo: -800, saldoPositivo: 15000 },
        { nome: "Carlos", numeroClientes: 12, saldoNegativo: -200, saldoPositivo: 10000 },
        { nome: "Fernanda", numeroClientes: 25, saldoNegativo: -540, saldoPositivo: 7600 },
        { nome: "Patrícia", numeroClientes: 22, saldoNegativo: -300, saldoPositivo: 6800 },
        { nome: "Lucas", numeroClientes: 15, saldoNegativo: -150, saldoPositivo: 5500 },
        { nome: "Maria", numeroClientes: 18, saldoNegativo: -350, saldoPositivo: 4200 },
        { nome: "Juliana", numeroClientes: 10, saldoNegativo: -90, saldoPositivo: 3100 },
        { nome: "Roberto", numeroClientes: 8, saldoNegativo: -600, saldoPositivo: 2100 },
        { nome: "Ana", numeroClientes: 14, saldoNegativo: -250, saldoPositivo: 1500 },
        { nome: "João", numeroClientes: 7, saldoNegativo: -1200, saldoPositivo: 890 }
      ];

      localStorage.setItem('gerentes', JSON.stringify(dadosIniciais));
    

    this.gerentes = JSON.parse(localStorage.getItem('gerentes') || '[]');

    const logado = localStorage.getItem('usuarioLogado');

    if (logado) {
      const user = JSON.parse(logado);
      this.nomeUsuario = user.nome || 'Administrador';
    }
  }


  logout(): void {
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }
}