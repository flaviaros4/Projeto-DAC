import { Component, EventEmitter, Output } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap, map } from 'rxjs';

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
    perfil: 'GERENTE'
  };

  constructor(private http: HttpClient) {}

  fecharModal() {
    this.fechar.emit();
  }

  finalizarFluxo() {
    this.atualizado.emit(); 
    this.fechar.emit();     
  }

  salvar() {

    const gerentePayload = {
      nome: this.novoGerente.nome,
      cpf: this.novoGerente.cpf,
      telefone: this.novoGerente.telefone,
      email: this.novoGerente.email,
      perfil: 'GERENTE'
    };

    this.http.post<any>('http://localhost:3000/gerentes', gerentePayload)
      .pipe(

        switchMap((gerenteCriado) => {

          const usuarioPayload = {
            nome: gerenteCriado.nome,
            email: gerenteCriado.email,
            senha: this.novoGerente.senha,
            perfil: 'GERENTE',
            usuarioId: gerenteCriado.id
          };

          return this.http.post('http://localhost:3000/usuarios', usuarioPayload)
            .pipe(
              switchMap(() =>
                forkJoin({
                  gerentes: this.http.get<any[]>('http://localhost:3000/gerentes'),
                  contas: this.http.get<any[]>('http://localhost:3000/contas')
                }).pipe(
                  map(({ gerentes, contas }) => ({
                    gerentes,
                    contas,
                    gerenteCriado
                  }))
                )
              )
            );
        })

      )
      .subscribe(({ gerentes, contas, gerenteCriado }) => {

        if (gerentes.length <= 1) {
          this.finalizarFluxo();
          return;
        }

        const gerentesFiltrados = gerentes.filter(g => g.id !== gerenteCriado.id);

        const gerentesStats = gerentesFiltrados.map(g => {
          const contasGerente = contas.filter(c => c.gerenteId === g.id);

          return {
            ...g,
            numeroContas: contasGerente.length,
            saldoPositivo: contasGerente.reduce(
              (acc, c) => acc + (c.saldo > 0 ? c.saldo : 0),
              0
            )
          };
        });

        gerentesStats.sort((a, b) => {
          if (b.numeroContas !== a.numeroContas) {
            return b.numeroContas - a.numeroContas;
          }
          return a.saldoPositivo - b.saldoPositivo;
        });

        const gerenteEscolhido = gerentesStats[0];

        if (gerenteEscolhido.numeroContas <= 1 && gerentes.length === 2) {
          this.finalizarFluxo();
          return;
        }

        const contaParaTransferir = contas.find(
          c => c.gerenteId === gerenteEscolhido.id
        );

        if (contaParaTransferir) {

          this.http.patch(
            `http://localhost:3000/contas/${contaParaTransferir.id}`,
            { gerenteId: gerenteCriado.id }
          ).subscribe(() => {
            this.finalizarFluxo();  
          });

        } else {
          this.finalizarFluxo();
        }

      });
  }
}