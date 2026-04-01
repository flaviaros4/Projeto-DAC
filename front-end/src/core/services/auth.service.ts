import { Injectable } from '@angular/core';
import { Cliente, Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const LS_CHAVE = 'auth';

type NovoUsuarioPayload = {
  nome: string;
  email: string;
  senha: string;
  perfil: Usuario['perfil'];
  usuarioId: number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

   constructor(private http: HttpClient) {}

   private api = 'http://localhost:3000/usuarios';

 login(usuario: Usuario): Observable<Usuario | undefined> {
  return this.http.get<Usuario[]>(this.api).pipe(
    map((usuarios) => {
      const usuarioEncontrado = usuarios.find(
        (u) => u.email === usuario.email && u.senha === usuario.senha
      );
      if (usuarioEncontrado) {
        localStorage.setItem(LS_CHAVE, JSON.stringify(usuarioEncontrado));
      }
      return usuarioEncontrado;
    })
  );
 
    
}

 criarUsuario(usuario: NovoUsuarioPayload): Observable<NovoUsuarioPayload & { id: number }> {
  return this.http.post<NovoUsuarioPayload & { id: number }>(this.api, usuario);
 }

 get usuarioLogado(): Usuario | null {
  const authData = localStorage.getItem(LS_CHAVE);
  if(authData) {
    try {
      return JSON.parse(authData) as Usuario;
    } catch (error) {
      return null;
    }
  }
  return null;
 }

 logout(): void{
  localStorage.removeItem(LS_CHAVE);
 }

}
