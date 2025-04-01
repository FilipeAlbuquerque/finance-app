import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  PasswordResetRequest,
  PasswordUpdateRequest
} from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private loadStoredUser(): void {
    if (!this.isBrowser) return;

    const storedToken = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as AuthResponse;
        user.token = storedToken;
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(
      tap(response => this.storeUserData(response)),
      catchError(error => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  requestPasswordReset(email: PasswordResetRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, email);
  }

  resetPassword(data: PasswordUpdateRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, data);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.roles.includes(role);
  }

  private storeUserData(response: AuthResponse): void {
    if (!this.isBrowser) return;

    if (response && response.token) {
      localStorage.setItem(this.tokenKey, response.token);

      // Store user data without token for security
      // Usando uma cópia para evitar o erro TS2790
      const userToStore = { ...response } as Partial<AuthResponse>;
      userToStore.token = undefined; // Usar undefined em vez de delete
      localStorage.setItem(this.userKey, JSON.stringify(userToStore));

      this.currentUserSubject.next(response);
    }
  }

  testToken(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/auth/test-token`, {});
  }
}
