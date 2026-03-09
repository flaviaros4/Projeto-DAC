import { Routes } from '@angular/router';

export const routes: Routes = [
    { path : '', redirectTo: '/autocadastro', pathMatch: 'full' },
    { path: 'autocadastro', loadComponent: () => import('./pages/autocadastro/autocadastro').then(m => m.Autocadastro) },
    { path: 'login', loadComponent:  () => import('./pages/login/login').then(m => m.Login)},
];
