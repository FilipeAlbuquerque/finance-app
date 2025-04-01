import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
        console.error('Erro do cliente:', error.error.message);
      } else {
        // Erro retornado pelo backend
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Requisição inválida';
            break;
          case 401:
            // Autenticação é tratada no auth.interceptor
            errorMessage = 'Você não está autenticado';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para acessar este recurso';
            router.navigate(['/access-denied']);
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.error?.message || error.statusText}`;
        }
        console.error(`Erro de API: ${error.status}`, error.error);
      }

      // Aqui você pode adicionar um serviço de notificação para mostrar mensagens de erro
      // const notificationService = inject(NotificationService);
      // notificationService.error(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
