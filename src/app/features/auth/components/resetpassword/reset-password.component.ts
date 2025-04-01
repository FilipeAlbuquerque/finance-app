import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  token = '';
  errorMessage = '';
  successMessage = '';
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obter token da URL
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.errorMessage = 'Token inválido ou ausente. Solicite uma nova redefinição de senha.';
    }

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]]
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Pare se o formulário for inválido ou se não houver token
    if (this.resetPasswordForm.invalid || !this.token) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword({
      token: this.token,
      password: this.f['password'].value
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Senha redefinida com sucesso!';

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error || 'Erro ao redefinir senha. O token pode ser inválido ou expirado.';
      }
    });
  }
}
