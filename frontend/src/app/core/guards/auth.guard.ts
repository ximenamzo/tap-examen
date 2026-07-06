import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Token en guard:', authService.getToken());
  console.log('isLoggedIn:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    return true;
  }

  console.log('X - Redirigiendo a login porque no hay token');
  router.navigate(['/login']);
  return false;
};
