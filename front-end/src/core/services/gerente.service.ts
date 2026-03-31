import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GerenteService {
  private api = 'http://localhost:3000/gerentes';
  constructor(private http: HttpClient) {}

  buscarPorId(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }
}
