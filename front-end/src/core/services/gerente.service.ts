import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gerente } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {

  constructor(private http: HttpClient) { }

  private api = 'http://localhost:3000/gerentes';

  getGerentes(): Observable<Gerente[]> {
    return this.http.get<Gerente[]>(this.api);
  }
}
