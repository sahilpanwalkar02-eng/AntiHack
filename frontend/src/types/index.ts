export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  cyber_safety_score: number;
  created_at: string;
  last_login?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiErrorResponse {
  error?: string;
  detail?: string | Array<{ msg: string; loc: string[] }>;
  message?: string;
}
