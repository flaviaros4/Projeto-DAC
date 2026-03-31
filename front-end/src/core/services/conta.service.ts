import { Injectable } from '@angular/core';
import { Cliente } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Conta } from '../models/conta.model';

@Injectable({
  providedIn: 'root',
})
export class ContaService {

  constructor(private http: HttpClient) { }

  private api = 'http://localhost:3000/contas';


  listarContas(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.api);
  }

  getContaPorCliente(clienteId: number): Observable<Conta | undefined> {
    return this.http.get<Conta[]>(this.api).pipe(
      map(contas => contas.find(c => Number(c.clienteId) === Number(clienteId)))
    );
  }

  criarConta(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.api, conta);
  }

  atualizarSaldo(contaId: string, novoSaldo: number): Observable<Conta> {
  return this.http.patch<Conta>(`${this.api}/${contaId}`, { saldo: novoSaldo });
  }

  atualizarLimite(contaId: string, novoLimite: number): Observable<Conta> {
  return this.http.patch<Conta>(`${this.api}/${contaId}`, { limite: novoLimite });
  }
}

