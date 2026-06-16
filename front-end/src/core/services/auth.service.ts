import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Perfil } from '../models/usuario.model';

const LS_TOKEN = 'auth';
const LS_CPF   = 'cpf';
const LS_PERFIL = 'perfil';

type LoginPayload = {
  login: string;
  senha: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private api = 'http://localhost:3000';

  private isAuthenticated = new BehaviorSubject<boolean>(
    !!sessionStorage.getItem(LS_TOKEN)
  );

  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, payload).pipe(
      tap((res) => {
        if (res?.access_token) {
          sessionStorage.setItem(LS_TOKEN, res.access_token);
        }
    
        if (res?.usuario?.cpf) {
          sessionStorage.setItem(LS_CPF, res.usuario.cpf);
        }
        if (res?.tipo) {
          sessionStorage.setItem(LS_PERFIL, res.tipo);
        }
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(LS_TOKEN);
    sessionStorage.removeItem(LS_CPF);
    sessionStorage.removeItem(LS_PERFIL);
    this.isAuthenticated.next(false);
    this.http.post(`${this.api}/logout`, {}).subscribe();
  }

  get token(): string | null {
    return sessionStorage.getItem(LS_TOKEN);
  }

 
  getCpf(): string | null {
    return sessionStorage.getItem(LS_CPF);
  }

  getUserProfile(): Perfil | null {
    const token = this.token;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.perfil as Perfil) || null;
    } catch {
      return null;
    }
  }


  get usuarioLogado(): any {
    const token = this.token;
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  criarUsuario(payload: { cpf?: string; nome?: string; email?: string; senha?: string; perfil?: string; usuarioId?: number }): Observable<any> {
    const cpf = payload.cpf || payload.usuarioId?.toString() || '';
    return this.http.post(`${this.api}/clientes/${cpf}/aprovar`, {});
  }
}
