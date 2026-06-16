import { Injectable } from '@angular/core';
import { Cliente } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  private api = 'http://localhost:3000/clientes';

 cadastrar(cliente: Cliente): Observable<Cliente> {

  const cpfNormalizado = this.normalizarCpf(cliente.cpf);

  if (cliente.salario <= 0) {
    throw new Error('Salário deve ser positivo');
  }

  cliente.cpf = cpfNormalizado;
  cliente.estado = 'PENDENTE';

  return this.http.post<Cliente>(this.api, cliente);
}


 verificarCpf(cpf: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.api}?cpf=${cpf}`);
  }

  private normalizarCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

listarSolicitacoes(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(`${this.api}?estado=PENDENTE`);
}

listarClientes(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>(`${this.api}?estado=APROVADO`);
}

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  atualizarStatus(id: number, estado: 'APROVADO' | 'REJEITADO', motivoRejeicao?: string, dataRejeicao?: Date): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.api}/${id}`, { estado, motivoRejeicao, dataRejeicao });
  }

  atualizar(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
  return this.http.put<Cliente>(`${this.api}/${id}`, cliente);
  }
}
