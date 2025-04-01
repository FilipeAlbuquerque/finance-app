import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidenavComponent,
    FooterComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidenav -->
      <mat-sidenav #sidenav mode="over"
                  [fixedInViewport]="true"
                  [opened]="(isHandset$ | async) === false"
                  class="sidenav">
        <app-sidenav (navItemClicked)="closeSidenav()"></app-sidenav>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content>
        <!-- Header toolbar -->
        <app-header (menuToggled)="toggleSidenav()"></app-header>

        <!-- Page content -->
        <main class="content">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <app-footer></app-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidenav {
      width: 250px;
    }

    .content {
      padding: 20px;
      min-height: calc(100vh - 64px - 56px); /* Altura total - altura do header - altura do footer */
    }

    @media (max-width: 599px) {
      .content {
        min-height: calc(100vh - 56px - 56px); /* Ajuste para a altura do header no mobile */
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  }

  ngOnInit(): void {
  }

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  closeSidenav(): void {
    if (this.sidenav && this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.sidenav.close();
    }
  }
}
