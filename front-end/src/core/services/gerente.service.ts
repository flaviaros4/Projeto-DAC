import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Gerente } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class GerenteService {

  private apiGerentes = 'http://localhost:3000/gerentes';

  constructor(private http: HttpClient) {}


  listarGerentes(): Observable<any[]> {
    return this.http.get<any>(this.apiGerentes).pipe(
      map((res: any) => {

        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.gerentes)) return res.gerentes;
        return [];
      })
    );
  }

  dashboard(): Observable<any[]> {
    return this.http.get<any>(`${this.apiGerentes}?numero=dashboard`).pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.items)) return res.items;
        return [];
      })
    );
  }

  buscarPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.apiGerentes}/${cpf}`);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiGerentes}/${id}`);
  }

  inserir(gerente: any): Observable<any> {
    return this.http.post<any>(this.apiGerentes, gerente);
  }

  atualizar(cpf: string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiGerentes}/${cpf}`, dados);
  }

  deletarGerente(cpfOuId: string | number): Observable<any> {
    return this.http.delete(`${this.apiGerentes}/${cpfOuId}`);
  }

  listarUsuarios(): Observable<any[]> {
    return new Observable(obs => { obs.next([]); obs.complete(); });
  }

  deletarUsuario(id: number): Observable<any> {
    return new Observable(obs => { obs.next({}); obs.complete(); });
  }
}