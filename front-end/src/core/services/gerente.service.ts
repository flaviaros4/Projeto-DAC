import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gerente } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class GerenteService {
  private api = 'http://localhost:3000/gerentes';
  constructor(private http: HttpClient) {}


  listarGerentes(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.api);
  }

  buscarPorId(id: number): Observable<Gerente> {
    return this.http.get<Gerente>(`${this.api}/${id}`);
  }
}
