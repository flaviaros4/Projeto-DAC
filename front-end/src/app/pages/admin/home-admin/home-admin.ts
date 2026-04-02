import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import localePt from '@angular/common/locales/pt';
import { Gerente } from '../../../../core/models/usuario.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { GerenteService } from '../../../../core/services/gerente.service';
import { ContaService } from '../../../../core/services/conta.service';
import { forkJoin } from 'rxjs';
registerLocaleData(localePt);

type Gerentes = Gerente &{
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
 gerentes: Gerentes[] = [];

  constructor(private router: Router,
    private cd: ChangeDetectorRef,
    private gerenteService: GerenteService,
    private contaService: ContaService
  ) {}

  ngOnInit() {
  this.listarClientesPorGerente(); 

  
   
   
    
  }

  

   listarClientesPorGerente(): void  {
    forkJoin({
      gerente: this.gerenteService.listarGerentes(),
      conta: this.contaService.listarContas()
    }).subscribe(({ gerente, conta }) => {
      this.gerentes = gerente.map(g => {
        const clientesGerente = conta.filter(c => c.gerenteId === g.id);
        const totalClientes = clientesGerente.length;
        const saldoPositivo = clientesGerente.reduce((acc, c) =>  acc + (c.saldo > 0 ? c.saldo : 0), 0);
        const saldoNegativo = clientesGerente.reduce((acc, c) =>  acc + (c.saldo < 0 ? c.saldo : 0), 0);
        return {
          ...g,
          numeroClientes: totalClientes,
          saldoPositivo,
          saldoNegativo
        };
      }).sort((a, b) => b.saldoPositivo - a.saldoPositivo); 
    this.cd.detectChanges();
    }); 
  
  }

}