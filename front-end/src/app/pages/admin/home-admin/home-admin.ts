import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { GerenteService } from '../../../../core/services/gerente.service';
registerLocaleData(localePt);

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css',
})
export class HomeAdmin implements OnInit {
  gerentes: any[] = [];
  carregando = true;
  erro = '';

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private gerenteService: GerenteService
  ) {}

  ngOnInit() {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
  
    this.gerenteService.dashboard().subscribe({
      next: (items: any[]) => {
  
        this.gerentes = items.map((item: any) => ({
          nome:           item.gerente?.nome          || '-',
          cpf:            item.gerente?.cpf           || '',
          email:          item.gerente?.email         || '',
          numeroClientes: item.clientesContas?.length ?? 0,
          saldoPositivo:  item.saldo_positivo         ?? 0,
          saldoNegativo:  item.saldo_negativo         ?? 0,
        }));
        this.carregando = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar dashboard:', err);
        this.erro = 'Não foi possível carregar os dados dos gerentes.';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }
}