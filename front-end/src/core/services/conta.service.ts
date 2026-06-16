import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Conta } from '../models/conta.model';

@Injectable({
  providedIn: 'root',
})
export class ContaService {

  private api = 'http://localhost:3000/contas';

  constructor(private http: HttpClient) { }

  listarContas(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.api);
  }

  buscarPorNumero(numero: string): Observable<Conta> {
    return this.http.get<Conta>(`${this.api}/${numero}`);
  }

  getContaPorCliente(cpf: string): Observable<Conta | undefined> {
    return this.http.get<Conta>(`${this.api}/cliente/${cpf}`);
  }

  depositar(numeroConta: string, valor: number): Observable<any> {
    return this.http.post(`${this.api}/${numeroConta}/depositar`, { valor });
  }

  sacar(numeroConta: string, valor: number): Observable<any> {
    return this.http.post(`${this.api}/${numeroConta}/sacar`, { valor });
  }

  transferir(numeroConta: string, numeroContaDestino: string, valor: number): Observable<any> {
    return this.http.post(`${this.api}/${numeroConta}/transferir`, { valor, numeroContaDestino });
  }

  extrato(numeroConta: string, dataInicio?: string, dataFim?: string): Observable<any> {
    let url = `${this.api}/${numeroConta}/extrato`;
    const params: string[] = [];
    if (dataInicio) params.push(`dataInicio=${dataInicio}`);
    if (dataFim) params.push(`dataFim=${dataFim}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<any>(url);
  }

  saldo(numeroConta: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${numeroConta}/saldo`);
  }

  melhoresSaldos(): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.api}/melhores-saldos`);
  }

  criarConta(conta: any): Observable<any> {
    return this.http.post(this.api, conta);
  }

  atualizarConta(conta: any): Observable<any> {
    return this.http.put(`${this.api}/${conta.numero ?? conta.numeroConta}`, conta);
  }

  // Mantido para compatibilidade com código que ainda usa id numérico
  atualizarSaldo(numeroOuId: string | number, novoSaldo: number): Observable<any> {
    return this.http.patch<any>(`${this.api}/${numeroOuId}`, { saldo: novoSaldo });
  }

  atualizarLimite(numero: string, novoLimite: number): Observable<any> {
    return this.http.patch<any>(`${this.api}/${numero}`, { limite: novoLimite });
  }
}