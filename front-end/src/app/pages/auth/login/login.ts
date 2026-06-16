import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Perfil, Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  usuario: Usuario = {
      id: 0,
      nome: '',
      email:'',
      senha:'',
      perfil: '' as Perfil,
      usuarioId: 0
  };

  constructor(private router: Router,
    private authService: AuthService
  ) {

  }
  
  ngOnInit() {

  } 
  
 logar() {
  const payload = { login: this.usuario.email, senha: this.usuario.senha ?? '' };
  this.authService.login(payload).subscribe({
    next: (res) => {
      if (!res) {
        alert('Credenciais inválidas!');
        return;
      }
  
      const perfil = res.tipo || res.usuario?.perfil;

      if (perfil === 'GERENTE') {
        this.router.navigate(['/home-gerente']);
      } else if (perfil === 'CLIENTE') {
        this.router.navigate(['/home-cliente']);
      } else if (perfil === 'ADMIN') {
        this.router.navigate(['/home-admin']);
      } else {
        alert('Perfil não reconhecido: ' + perfil);
      }
    },
    error: (err) => {
      console.error('Erro ao logar:', err);
      alert('Erro ao fazer login');
    }
  });
}
}

