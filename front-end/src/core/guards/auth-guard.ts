import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const perfil = authService.getUserProfile();
  const url = state.url;

  if (!perfil) {
    router.navigate(['/login'], {
      queryParams: { error: `Acesso negado a ${url}` }
    });
    return false;
  }

  const perfisPermitidos = route.data?.['perfil'];

  if (perfisPermitidos && !perfisPermitidos.includes(perfil)) {
    router.navigate(['/login'], {
      queryParams: { error: `Sem permissão para ${url}` }
    });
    return false;
  }

  return true;
};