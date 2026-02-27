import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'landing-page',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent),
  },
  {
    path: 'group',
    loadComponent: () =>
      import('./pages/group/group.component').then(m => m.GroupComponent),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./pages/user/user.component').then(m => m.UserComponent),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];