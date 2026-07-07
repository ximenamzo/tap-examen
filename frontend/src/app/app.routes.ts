import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { sectionGuard } from './core/guards/section.guard';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, sectionGuard('users')],
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
    canActivate: [authGuard, sectionGuard('products')],
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
  {
    path: 'perfiles',
    canActivate: [authGuard, sectionGuard('profiles')],
    loadComponent: () =>
      import('./features/profiles/profile-list/profile-list.component').then((m) => m.ProfileListComponent),
  },
  {
    path: 'perfiles/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profiles/profile-form/profile-form.component').then((m) => m.ProfileFormComponent),
  },
  {
    path: 'perfiles/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profiles/profile-form/profile-form.component').then((m) => m.ProfileFormComponent),
  },
  {
    path: 'cambiar-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];