import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { GerenteService } from '../../../../core/services/gerente.service';
import { ContaService } from '../../../../core/services/conta.service';

import { ModalNovoGerente } from '../modais-admin/modal-novo-gerente/modal-novo-gerente';
import { ModalEditarGerente } from "../modais-admin/modal-editar-gerente/modal-editar-gerente";

export interface Gerente {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
}

type GerenteView = Gerente & {
  numeroClientes: number;
};

@Component({
  selector: 'app-gerenciar-gerentes',
  standalone: true,
  imports: [MatIcon, CommonModule, ModalNovoGerente, ModalEditarGerente],
  templateUrl: './gerenciar-gerentes.html',
  styleUrl: './gerenciar-gerentes.css',
})
export class GerenciarGerentes implements OnInit {

  gerentes: GerenteView[] = [];
  isLoading = true;

  mostrarModal = false;
  mostrarEditarGerente = false;
  gerenteSelecionado: Gerente | null = null;

  constructor(
    private gerenteService: GerenteService,
    private contaService: ContaService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarGerentes();
  }

  carregarGerentes() {
    forkJoin({
      gerentes: this.gerenteService.listarGerentes(),
      contas: this.contaService.listarContas()
    }).subscribe({
      next: ({ gerentes, contas }) => {

        console.log('GERENTES:', gerentes);
        console.log('CONTAS:', contas);

        this.gerentes = gerentes.map(g => {

          const contasDoGerente = contas.filter(
            c => c.gerenteId === g.id
          );

          return {
            ...g,
            numeroClientes: contasDoGerente.length
          };
        });

        console.log('RESULTADO FINAL:', this.gerentes);

        this.isLoading = false;

        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Erro ao carregar gerentes:', err);
        this.isLoading = false;
      }
    });
  }


  abrirModal() {
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  abrirEditarGerentes(gerente: Gerente) {
    this.gerenteSelecionado = gerente;
    this.mostrarEditarGerente = true;
  }

  fecharEditarGerentes() {
    this.mostrarEditarGerente = false;
  }
}