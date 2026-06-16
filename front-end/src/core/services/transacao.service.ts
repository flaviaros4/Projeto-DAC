import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class TransacaoService {

  private api = 'http://localhost:3000/contas';

  constructor(private http: HttpClient) {}

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


  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }


  registrar(transacao: any): Observable<any> {
    return new Observable(obs => { obs.next({}); obs.complete(); });
  }

  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}?clienteORigem=${clienteId}`);
  }
}