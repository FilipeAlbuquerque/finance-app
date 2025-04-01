import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <button mat-icon-button (click)="toggleMenu()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>

      <div class="logo" routerLink="/dashboard">
        <mat-icon>account_balance</mat-icon>
        <span>Finance Service</span>
      </div>

      <span class="spacer"></span>

      <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
        <mat-icon>person</mat-icon>
        <span class="username">{{ username }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu" xPosition="before" class="user-menu">
        <button mat-menu-item (click)="navigateToProfile()">
          <mat-icon>account_circle</mat-icon>
          <span>Meu Perfil</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Sair</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
    }

    .menu-button {
      margin-right: 10px;
    }

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;

      mat-icon {
        margin-right: 8px;
      }

      span {
        font-size: 20px;
        font-weight: 500;
      }
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu-button {
      display: flex;
      align-items: center;

      .username {
        margin: 0 5px;
      }
    }

    @media (max-width: 599px) {
      .username {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<void>();
  appName = 'Finance Service';
  username = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
    }
  }

  toggleMenu(): void {
    this.menuToggled.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
