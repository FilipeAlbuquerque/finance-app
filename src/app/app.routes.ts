import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboards/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'accounts',
      //   loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'clients',
      //   loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule),
      //   canActivate: [AuthGuard],
      //   data: {roles: ['ROLE_ADMIN']}
      // },
      // {
      //   path: 'transactions',
      //   loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'profile',
      //   loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
      //   canActivate: [AuthGuard]
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./shared/components/access-denied/access-denied.component').then(c => c.AccessDeniedComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
