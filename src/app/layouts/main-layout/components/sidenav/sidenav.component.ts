import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() navItemClicked = new EventEmitter<void>();
  username = '';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Contas',
      icon: 'account_balance',
      route: '/accounts'
    },
    {
      label: 'Transações',
      icon: 'swap_horiz',
      route: '/transactions'
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/clients',
      roles: ['ROLE_ADMIN']
    }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.username;
    }
  }

  canShow(navItem: NavItem): boolean {
    // Se não houver restrição de roles, pode mostrar
    if (!navItem.roles || navItem.roles.length === 0) {
      return true;
    }

    // Caso contrário, verifica se o usuário tem pelo menos uma das roles necessárias
    return navItem.roles.some(role => this.authService.hasRole(role));
  }

  onNavItemClick(): void {
    this.navItemClicked.emit();
  }
}
