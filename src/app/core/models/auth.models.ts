// Modelos para autenticação baseados nos DTOs do backend

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  password: string;
}

export interface UserProfileUpdate {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: {[key: string]: string};
}
