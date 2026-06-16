import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gerente } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class GerenteService {

  private apiGerentes = 'http://localhost:3000/gerentes';


  constructor(private http: HttpClient) {}


listarGerentes(): Observable<Gerente[]> {
  return this.http.get<Gerente[]>(this.apiGerentes);
}

buscarPorId(id: number): Observable<Gerente> {
  return this.http.get<Gerente>(`${this.apiGerentes}/${id}`);
}

deletarGerente(id: number) {
  return this.http.delete(`${this.apiGerentes}/${id}`);
}

}