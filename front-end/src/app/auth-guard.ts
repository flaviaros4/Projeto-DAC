import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = (route: any) => {
  const router = inject(Router);

  const logado = localStorage.getItem('usuarioLogado');


  if (!logado) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(logado);

  const tipoPermitido = route.data?.['tipo'];

  if (!tipoPermitido) return true;

  if (user.tipo === tipoPermitido) {
    return true;
  }

  if (user.tipo === 'admin') {
    router.navigate(['/home-admin']);
  } else if (user.tipo === 'gerente') {
    router.navigate(['/home-gerente']);
  } else {
    router.navigate(['/home-cliente']);
  }

  return false;
};