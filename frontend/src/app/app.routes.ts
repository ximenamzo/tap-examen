import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/user-list/user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'usuarios/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/user-form/user-form.component').then((m) => m.UserFormComponent),
  },
  {
    path: 'usuarios/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/user-form/user-form.component').then((m) => m.UserFormComponent),
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: 'productos/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: 'productos/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];