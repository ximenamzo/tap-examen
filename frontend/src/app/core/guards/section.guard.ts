import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sectionGuard = (sectionKey: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasAccess(sectionKey)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
