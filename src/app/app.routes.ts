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
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'groups-tickets/:id',
        loadComponent: () =>
          import('./pages/ticket-board/ticket-board.component').then(m => m.TicketBoardComponent),
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent),
      }
    ],
  },

  { path: '**', redirectTo: 'landing' },
];