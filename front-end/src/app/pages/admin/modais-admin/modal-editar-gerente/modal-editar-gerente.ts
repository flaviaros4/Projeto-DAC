import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GerenteService } from '../../../../../core/services/gerente.service';

@Component({
  selector: 'app-modal-editar-gerente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar-gerente.html',
  styleUrl: './modal-editar-gerente.css',
})
export class ModalEditarGerente implements OnInit {

  @Input() gerente: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<void>();

  nome: string = '';
  email: string = '';
  senha: string = '';
  carregando = false;
  erro = '';
  sucesso = false;

  constructor(private gerenteService: GerenteService) {}

  ngOnInit() {
    this.nome = this.gerente.nome;
    this.email = this.gerente.email;
  }

  fecharModal() {
    this.fechar.emit();
  }

  salvar() {
    if (!this.nome || !this.email) {
      this.erro = 'Nome e e-mail são obrigatórios.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    const payload: any = {
      nome: this.nome,
      email: this.email,
    };

    if (this.senha) {
      payload.senha = this.senha;
    }

    const cpf = this.gerente.cpf || this.gerente.id;

    this.gerenteService.atualizar(cpf, payload).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;
        setTimeout(() => {
          this.atualizado.emit();
          this.fecharModal();
        }, 800);
      },
      error: (err: any) => {
        this.erro = err?.error?.message || 'Erro ao atualizar gerente.';
        this.carregando = false;
      }
    });
  }
}