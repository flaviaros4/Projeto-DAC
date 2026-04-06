import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  private apiGerentes = 'http://localhost:3000/gerentes';
  private apiUsuarios = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.nome = this.gerente.nome;
    this.email = this.gerente.email;
  }

  fecharModal() {
    this.fechar.emit();
  }

  salvar() {
    const gerenteAtualizado = {
      ...this.gerente,
      nome: this.nome || this.gerente.nome,
      email: this.email || this.gerente.email
    };

    this.http.get<any[]>(this.apiUsuarios).subscribe(usuarios => {

      const usuario = usuarios.find(
        u => u.usuarioId === this.gerente.id && u.perfil === 'GERENTE'
      );

      let usuarioAtualizado: any = null;

      if (usuario) {
        usuarioAtualizado = {
          ...usuario,
          nome: this.nome || usuario.nome,
          email: this.email || usuario.email,
          senha: this.senha || usuario.senha
        };
      }

      const requests = [
        this.http.put(`${this.apiGerentes}/${this.gerente.id}`, gerenteAtualizado)
      ];

      if (usuarioAtualizado) {
        requests.push(
          this.http.put(`${this.apiUsuarios}/${usuario.id}`, usuarioAtualizado)
        );
      }

      forkJoin(requests).subscribe(() => {
        this.atualizado.emit();
        this.fecharModal();
      });

    });
  }
}