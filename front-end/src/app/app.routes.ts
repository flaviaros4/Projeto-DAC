import { Routes } from '@angular/router';

export const routes: Routes = [
    { path : '', redirectTo: '/autocadastro', pathMatch: 'full' },
    { path: 'autocadastro', loadComponent: () => import('./pages/auth/autocadastro/autocadastro').then(m => m.Autocadastro) },
    { path: 'login', loadComponent:  () => import('./pages/auth/login/login').then(m => m.Login)},
    { path: 'home-cliente', loadComponent:  () => import('./pages/cliente/home-cliente/home-cliente').then(m => m.HomeCliente)},
    { path: 'home-gerente', loadComponent:  () => import('./pages/gerente/home-gerente/home-gerente').then(m => m.HomeGerente)},
    {path: 'home-admin', loadComponent:  () => import('./pages/admin/home-admin/home-admin').then(m => m.HomeAdmin)},
];
