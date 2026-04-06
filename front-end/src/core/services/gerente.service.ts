import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gerente } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class GerenteService {

  private apiGerentes = 'http://localhost:3000/gerentes';
  private apiUsuarios = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  listarGerentes(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.apiGerentes);
  }

  buscarPorId(id: number): Observable<Gerente> {
    return this.http.get<Gerente>(`${this.apiGerentes}/${id}`);
  }

  listarUsuarios() {
    return this.http.get<any[]>(this.apiUsuarios);
  }

  deletarGerente(id: number) {
    return this.http.delete(`${this.apiGerentes}/${id}`);
  }

  deletarUsuario(id: number) {
    return this.http.delete(`${this.apiUsuarios}/${id}`);
  }
}