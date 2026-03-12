import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  email: string = '';
  senha: string = '';

  constructor(private router: Router) {}
  
  ngOnInit() {
    if(!localStorage.getItem('users')){
      const usuarios = [
        { email: 'cliente@bantads.com', senha: '123', tipo: 'cliente' },
        { email: 'gerente@bantads.com', senha: '123', tipo: 'gerente' },
        { email: 'admin@bantads.com', senha: '123', tipo: 'admin' }
      ];
      localStorage.setItem('users', JSON.stringify(usuarios));
  }
 }

  logar(){
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === this.email && u.senha === this.senha);

    if(user){
      localStorage.setItem('usuarioLogado', JSON.stringify(user));
      if(user.tipo === 'cliente'){
        this.router.navigate(['/home-cliente']);
      } else if(user.tipo === 'gerente'){
        this.router.navigate(['/home-gerente']);
      } else if(user.tipo === 'admin'){
        this.router.navigate(['/home-admin']);
      } else {
        alert('Usuário ou senha inválidos!');
      }
    }
  }
}
