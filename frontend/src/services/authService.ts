import { api } from './api';
import { AuthTokens, User } from '../types';

export interface RegisterPayload {
  email: string;
  full_name: string;
  phone_number?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login', payload);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async updateProfile(payload: { full_name?: string; phone_number?: string }): Promise<User> {
    const response = await api.put<User>('/users/profile', payload);
    return response.data;
  },
};
