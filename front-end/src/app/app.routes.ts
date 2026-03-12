import { Routes } from '@angular/router';

export const routes: Routes = [
    { path : '', redirectTo: '/autocadastro', pathMatch: 'full' },
    { path: 'autocadastro', loadComponent: () => import('./pages/auth/autocadastro/autocadastro').then(m => m.Autocadastro) },
    { path: 'login', loadComponent:  () => import('./pages/auth/login/login').then(m => m.Login)},
];
