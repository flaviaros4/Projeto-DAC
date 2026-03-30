import { Injectable } from '@angular/core';
import { Cliente, Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const LS_CHAVE = 'auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

   constructor(private http: HttpClient) {}

   private api = 'http://localhost:3000/usuarios';

 login(usuario: Usuario): Observable<Usuario | undefined> {

  return this.http
    .get<Usuario[]>(`${this.api}?email=${usuario.email}&senha=${usuario.senha}`)
    .pipe(map(usuarios => usuarios[0]));
    
}

 logout() {
  localStorage.removeItem(LS_CHAVE);
 }

}
