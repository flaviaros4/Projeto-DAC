import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GerenteService } from '../../../../core/services/gerente.service';
import { ModalNovoGerente } from '../modais-admin/modal-novo-gerente/modal-novo-gerente';
import { ModalEditarGerente } from '../modais-admin/modal-editar-gerente/modal-editar-gerente';

export interface Gerente {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil?: string;
}

@Component({
  selector: 'app-gerenciar-gerentes',
  standalone: true,
  imports: [MatIcon, CommonModule, ModalNovoGerente, ModalEditarGerente],
  templateUrl: './gerenciar-gerentes.html',
  styleUrl: './gerenciar-gerentes.css',
})
export class GerenciarGerentes implements OnInit {
  gerentes: Gerente[] = [];
  isLoading = true;

  mostrarModal = false;
  mostrarEditarGerente = false;
  gerenteSelecionado: Gerente | null = null;

  mostrarConfirmacao = false;
  gerenteParaDeletar: Gerente | null = null;

  mostrarErro = false;
  mensagemErro = '';

  constructor(
    private gerenteService: GerenteService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarGerentes();
  }

  carregarGerentes() {
    this.isLoading = true;

    this.gerenteService.listarGerentes().subscribe({
      next: (lista: any[]) => {
        this.gerentes = (lista || []).sort((a, b) =>
          (a.nome || '').localeCompare(b.nome || '', 'pt-BR')
        );
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar gerentes:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  abrirModal() { this.mostrarModal = true; }
  fecharModal() { this.mostrarModal = false; }

  abrirEditarGerentes(gerente: Gerente) {
    this.gerenteSelecionado = gerente;
    this.mostrarEditarGerente = true;
  }
  fecharEditarGerentes() { this.mostrarEditarGerente = false; }

  recarregarGerentes() {
    setTimeout(() => this.carregarGerentes(), 300);
  }

  confirmarDelecao(gerente: Gerente) {
    if (this.gerentes.length <= 1) {
      this.mensagemErro = 'Não é possível remover o único gerente do banco.';
      this.mostrarErro = true;
      return;
    }
    this.gerenteParaDeletar = gerente;
    this.mostrarConfirmacao = true;
  }

  deletarGerenteConfirmado() {
    if (!this.gerenteParaDeletar) return;
    const cpf = this.gerenteParaDeletar.cpf;

    this.gerenteService.deletarGerente(cpf).subscribe({
      next: () => {
        this.mostrarConfirmacao = false;
        this.gerenteParaDeletar = null;
        this.carregarGerentes();
      },
      error: (err: any) => {
        this.mensagemErro = err?.error?.message || 'Erro ao remover gerente.';
        this.mostrarErro = true;
        this.mostrarConfirmacao = false;
      }
    });
  }
}