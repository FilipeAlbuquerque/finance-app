import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-content">
        <mat-icon class="access-denied-icon">security</mat-icon>
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <button mat-raised-button color="primary" (click)="goToDashboard()">
          <mat-icon>home</mat-icon>
          Voltar para o Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 56px);
      padding: 20px;
    }

    .access-denied-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      width: 100%;
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;

      h1 {
        font-size: 28px;
        color: var(--primary-color);
        margin-bottom: 16px;
      }

      p {
        font-size: 16px;
        color: var(--text-secondary);
        margin-bottom: 24px;
      }

      button {
        display: flex;
        align-items: center;
        padding: 8px 16px;

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    .access-denied-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: var(--danger-color);
      margin-bottom: 16px;
    }

    @media (max-width: 599px) {
      .access-denied-container {
        min-height: calc(100vh - 56px - 56px);
      }

      .access-denied-content {
        padding: 30px 20px;
      }
    }
  `]
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
