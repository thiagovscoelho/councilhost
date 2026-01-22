import { apiClient } from './client';

export interface User {
  id: number;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url?: string;
}

export class AuthApi {
  static getTwitterAuthUrl(): string {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${API_BASE_URL}/auth/twitter`;
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      return null;
    }
  }

  static async logout(): Promise<void> {
    return apiClient.post('/auth/logout');
  }
}
