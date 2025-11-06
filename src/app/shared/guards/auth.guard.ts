import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as string[];

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        const userRole = localStorage.getItem('userRole');
        if (userRole && expectedRoles.includes(userRole)) {
          return true;
        } else {
          router.navigate(['/home']);
          return false;
        }
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
