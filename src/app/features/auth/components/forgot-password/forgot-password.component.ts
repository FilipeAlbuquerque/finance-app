import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import {MatFormField} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatProgressSpinner
  ],
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Pare se o formulário for inválido
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.requestPasswordReset({
      email: this.f['email'].value
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Email de redefinição de senha enviado. Por favor, verifique sua caixa de entrada.';
      },
      error: (error) => {
        this.loading = false;
        // Não informamos se o email existe ou não por razões de segurança
        // Sempre mostramos a mesma mensagem bem-sucedida
        this.successMessage = 'Se o email estiver registrado, você receberá um email com instruções para redefinir sua senha.';
      }
    });
  }
}
