import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransacaoService {
private api = 'http://localhost:3000/contas';
  constructor(private http: HttpClient) {}

  registrar(transacao: Partial<{tipo: string, clienteORigem: any, clienteDestino: any, valor: number, dataHora: string}>): Observable<any> {
    return this.http.post(this.api, transacao);
  }

  listarPorCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}?clienteORigem=${clienteId}`);
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
