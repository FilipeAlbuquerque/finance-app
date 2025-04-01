import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Verifica se a rota requer roles específicas
    const requiredRoles = route.data?.['roles'] as Array<string>;

    if (requiredRoles) {
      // Verifica se o usuário tem pelo menos uma das roles requeridas
      const hasRequiredRole = requiredRoles.some(role =>
        authService.hasRole(role)
      );

      if (!hasRequiredRole) {
        // Redireciona para uma página de acesso negado
        router.navigate(['/access-denied']);
        return false;
      }
    }

    return true;
  }

  // Redireciona para a página de login
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
