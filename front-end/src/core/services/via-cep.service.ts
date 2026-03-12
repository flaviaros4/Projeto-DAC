import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  buscarCep(cep: string): Observable<any> {
    const digits = (cep || '').replace(/\D/g, '');
    if (digits.length !== 8) {
      return of({ erro: true });
    }
    return this.http.get<any>(`${this.baseUrl}/${digits}/json/`)
      .pipe(catchError(() => of({ erro: true })));
  }
}