import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },

  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent),
  },

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
    path: 'home',
    loadComponent: () =>
      import('./layout/sidebar/sidebar.component').then(m => m.SidebarComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'user' },
      {
        path: 'user',
        loadComponent: () =>
          import('./pages/user/user.component').then(m => m.UserComponent),
      },
      {
        path: 'group',
        loadComponent: () =>
          import('./pages/group/group.component').then(m => m.GroupComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'landing' },
];