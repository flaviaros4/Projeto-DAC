import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/autocadastro', pathMatch: 'full' },

  {
    path: 'autocadastro',
    loadComponent: () =>
      import('./pages/auth/autocadastro/autocadastro')
        .then(m => m.Autocadastro)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'home-cliente',
    loadComponent: () =>
      import('./pages/cliente/home-cliente/home-cliente')
        .then(m => m.HomeCliente),
    canActivate: [authGuard],
    data: { perfil: 'CLIENTE' }
  },

  {
    path: 'home-gerente',
    loadComponent: () =>
      import('./pages/gerente/home-gerente/home-gerente')
        .then(m => m.HomeGerente),
    canActivate: [authGuard],
    data: { perfil: 'GERENTE' }
  },

  {
    path: 'home-admin',
    loadComponent: () =>
      import('./pages/admin/home-admin/home-admin')
        .then(m => m.HomeAdmin),
    canActivate: [authGuard],
    data: { perfil: 'ADMIN' }
  },

  {
    path: 'consultar-clientes',
    loadComponent: () =>
      import('./pages/gerente/consultar-clientes/consultar-clientes')
        .then(m => m.ConsultarClientes),
    canActivate: [authGuard],
    data: { perfil: 'GERENTE' }
  },
  {
    path: 'relatorio-clientes',
    loadComponent: () => 
        import('./pages/admin/relatorio-clientes/relatorio-clientes')
            .then(m => m.RelatorioClientes),
    canActivate: [authGuard],
    data: { perfil: 'ADMIN' }
  }
];