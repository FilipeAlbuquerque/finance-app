import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <span>© {{ currentYear }} Finance Service. Todos os direitos reservados.</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      padding: 16px 0;
      text-align: center;
      font-size: 14px;
      color: var(--text-secondary);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
