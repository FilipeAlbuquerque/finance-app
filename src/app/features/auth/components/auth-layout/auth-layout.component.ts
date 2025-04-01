import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  templateUrl: './auth-layout.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    MatIcon
  ],
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  // O ano atual para o copyright
  currentYear = new Date().getFullYear();
}
