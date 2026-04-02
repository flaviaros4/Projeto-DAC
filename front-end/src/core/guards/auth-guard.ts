import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuarioLogado = authService.usuarioLogado;
  let url = state.url;


  if (!usuarioLogado) {
    router.navigate(['/login'], { queryParams: { error: "Proibido acesso a " + url } });
    return false;
  }

  
  if (route.data && route.data['perfil'] && route.data['perfil'].indexOf(usuarioLogado.perfil) === -1) {
    router.navigate(['/login'], { queryParams: { error: "Proibido acesso a " + url } });
    return false;
  }

  return true;
};