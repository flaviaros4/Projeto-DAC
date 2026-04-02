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
  this.authService.login(this.usuario).subscribe({
    next: (usuario) => {
      if (!usuario) {
        alert('Credenciais inválidas!');
        return;
      }


      if (usuario.perfil === 'GERENTE') {
        this.router.navigate(['/home-gerente']);
      } else if (usuario.perfil === 'CLIENTE') {
        this.router.navigate(['/home-cliente']);
      } else if (usuario.perfil === 'ADMIN') {
        this.router.navigate(['/home-admin']);
      }
    },
    error: (err) => {
      console.error('Erro ao logar:', err);
      alert('Erro ao fazer login');
    }
  });
}
}

