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

  mostrarConfirmacao = false;
  gerenteParaDeletar: Gerente | null = null;

  mostrarErro = false;
  mensagemErro = '';

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

        this.gerentes = gerentes.map(g => {
          const contasDoGerente = contas.filter(c => c.gerenteId === g.id);

          return {
            ...g,
            numeroClientes: contasDoGerente.length
          };
        }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

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

  recarregarGerentes() {
    setTimeout(() => {
      this.carregarGerentes();
    }, 0);
  }
  
  confirmarDelecao(gerente: Gerente) {
    console.log('clicou');
    if (this.gerentes.length <= 1) {
      this.mensagemErro = 'Não é possível deletar o único gerente';
      this.mostrarErro = true;
      return;
    }

    this.gerenteParaDeletar = gerente;
    this.mostrarConfirmacao = true;
  }






deletarGerenteConfirmado() {
  if (!this.gerenteParaDeletar) return;

  const gerenteId = this.gerenteParaDeletar.id;

  forkJoin({
    gerentes: this.gerenteService.listarGerentes(),
    contas: this.contaService.listarContas(),
    usuarios: this.gerenteService.listarUsuarios()
  }).subscribe(({ gerentes, contas, usuarios }) => {

    const outrosGerentes = gerentes.filter(g => g.id !== gerenteId);

    const ranking = outrosGerentes.map(g => {
      const contasGerente = contas.filter(c => c.gerenteId === g.id);

      const saldoPositivo = contasGerente.reduce(
        (acc, c) => acc + (c.saldo > 0 ? c.saldo : 0),
        0
      );

      return {
        ...g,
        numeroContas: contasGerente.length,
        saldoPositivo
      };
    });

    if (ranking.length === 0) {
      this.mensagemErro = 'Erro ao redistribuir contas';
      this.mostrarErro = true;
      return;
    }

    ranking.sort((a, b) => {
      if (a.numeroContas !== b.numeroContas) {
        return a.numeroContas - b.numeroContas;
      }
      return b.saldoPositivo - a.saldoPositivo;
    });

    const novoGerenteId = ranking[0].id;

    const contasParaAtualizar = contas.filter(c => c.gerenteId === gerenteId);

    const updates = contasParaAtualizar.map(c =>
      this.contaService.atualizarConta({
        ...c,
        gerenteId: novoGerenteId
      })
    );
    

    forkJoin(updates).subscribe(() => {

      const usuario = usuarios.find(
        u => u.usuarioId === gerenteId && u.perfil === 'GERENTE'
      );

      const deletarGerenteFinal = () => {
        this.gerenteService.deletarGerente(gerenteId).subscribe(() => {
          this.mostrarConfirmacao = false;
          this.carregarGerentes();
        });
      };

      if (usuario) {
        this.gerenteService.deletarUsuario(usuario.id)
          .subscribe(() => deletarGerenteFinal());
      } else {
        deletarGerenteFinal();
      }

    });

  });
}

}