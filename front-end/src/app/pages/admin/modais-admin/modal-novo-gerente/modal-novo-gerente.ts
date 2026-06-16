import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GerenteService } from '../../../../../core/services/gerente.service';

@Component({
  selector: 'app-modal-novo-gerente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-novo-gerente.html',
  styleUrl: './modal-novo-gerente.css',
})
export class ModalNovoGerente {

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<void>();

  novoGerente = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  };

  carregando = false;
  erro = '';

  constructor(private gerenteService: GerenteService) {}

  fecharModal() {
    this.fechar.emit();
  }

  salvar() {
    if (!this.novoGerente.nome || !this.novoGerente.cpf || !this.novoGerente.email || !this.novoGerente.senha) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    const payload = {
      nome: this.novoGerente.nome,
      cpf: this.novoGerente.cpf.replace(/\D/g, ''),
      telefone: this.novoGerente.telefone,
      email: this.novoGerente.email,
      senha: this.novoGerente.senha,
    };


    this.gerenteService.inserir(payload).subscribe({
      next: () => {
        this.carregando = false;
        this.atualizado.emit();
        this.fechar.emit();
      },
      error: (err: any) => {
        this.erro = err?.error?.message || 'Erro ao inserir gerente.';
        this.carregando = false;
      }
    });
  }
}