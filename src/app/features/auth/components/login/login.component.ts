import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Redirecione se já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // Inicialize o formulário - removed minLength validator
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Obtenha a URL de retorno dos parâmetros da query ou use o padrão
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Verificar se o usuário veio da tela de registro
    const registered = this.route.snapshot.queryParams['registered'];
    if (registered === 'true') {
      // Poderia mostrar uma mensagem de sucesso aqui
    }
  }

  // Getter para facilitar o acesso aos campos do formulário
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    // Pare aqui se o formulário for inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      username: this.f['username'].value,
      password: this.f['password'].value
    }).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        // O backend retorna mensagens específicas para diferentes situações
        if (error.status === 401) {
          this.errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
        } else if (error.status === 429) {
          this.errorMessage = 'Conta temporariamente bloqueada devido a múltiplas tentativas de login falhas.';
        } else {
          this.errorMessage = error.message || 'Falha na autenticação. Tente novamente mais tarde.';
        }
        this.loading = false;
      }
    });
  }
}
