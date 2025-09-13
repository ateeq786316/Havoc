import { create } from 'zustand';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor' | 'viewer' | 'client';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      set({ user, isAuthenticated: true });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, isAuthenticated: false });
    
    // Call logout endpoint to invalidate token
    apiClient.logout().catch(console.error);
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      // Token is validated by API interceptor
      // If successful, user is already authenticated
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('auth_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// Check auth on store creation
useAuthStore.getState().checkAuth();