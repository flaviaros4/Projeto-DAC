import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const LS_CHAVE = 'auth';

type LoginPayload = {
  email: string;
  senha: string;
};

type LoginResponse = {
  token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private api = 'http://localhost:3000';

  private isAuthenticated = new BehaviorSubject<boolean>(
    !!sessionStorage.getItem(LS_CHAVE)
  );

  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}


  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, payload).pipe(
      tap((res) => {
        sessionStorage.setItem(LS_CHAVE, res.token);
        this.isAuthenticated.next(true);
      })
    );
  }


  logout(): void {
    sessionStorage.removeItem(LS_CHAVE);
    this.isAuthenticated.next(false);

    this.http.post(`${this.api}/logout`, {}).subscribe();
  }


  get token(): string | null {
    return sessionStorage.getItem(LS_CHAVE);
  }

  
  getUserProfile(): string | null {
    const token = this.token;
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.perfil || null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}