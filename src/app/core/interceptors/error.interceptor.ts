import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse, ValidationErrorResponse } from '../models/auth.models';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
        console.error('Erro do cliente:', error.error.message);
      } else {
        // Erro retornado pelo backend
        try {
          // Tentar tratar como ErrorResponse ou ValidationErrorResponse
          const serverError = error.error as ErrorResponse | ValidationErrorResponse;

          if (serverError && serverError.message) {
            errorMessage = serverError.message;

            // Verificar se é um erro de validação
            if ('errors' in serverError && serverError.errors) {
              const validationErrors = Object.values(serverError.errors).join(', ');
              errorMessage = `${errorMessage}: ${validationErrors}`;
            }
          }
        } catch (e) {
          // Fallback para o caso de não ser uma resposta de erro formatada
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else {
            errorMessage = error.error?.message || error.statusText || errorMessage;
          }
        }

        // Tratamento específico por status
        switch (error.status) {
          case 400:
            console.error('Requisição inválida:', errorMessage);
            notificationService.error(errorMessage);
            break;
          case 401:
            // Autenticação é tratada no auth.interceptor
            errorMessage = 'Você não está autenticado';
            // Não mostrar notificação para erro de autenticação no login
            if (!req.url.includes('/auth/login')) {
              notificationService.error(errorMessage);
            }
            break;
          case 403:
            errorMessage = 'Você não tem permissão para acessar este recurso';
            notificationService.error(errorMessage);
            router.navigate(['/access-denied']);
            break;
          case 404:
            errorMessage = 'Recurso não encontrado';
            notificationService.error(errorMessage);
            break;
          case 429:
            errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
            notificationService.warn(errorMessage);
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            notificationService.error(errorMessage);
            break;
          default:
            notificationService.error(errorMessage);
        }

        console.error(`Erro de API: ${error.status}`, error.error);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
