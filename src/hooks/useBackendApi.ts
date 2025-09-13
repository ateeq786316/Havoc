import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Ensure API_BASE_URL doesn't already end with /api
const cleanBaseURL = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function useBackendApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    console.log('🌐 API Request:', {
      method: options.method || 'GET',
      url: `${cleanBaseURL}${endpoint}`,
      endpoint: endpoint,
      hasBody: !!options.body,
      body: options.body ? JSON.parse(options.body as string) : null
    });
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('admin_token');
      console.log('🔑 Token status:', token ? 'Present' : 'Missing');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('📤 Request headers:', headers);

      const response = await fetch(`${cleanBaseURL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok) {
        console.error('❌ Request failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || data.error || 'Request failed');
      }

      console.log('✅ Request successful:', data);
      return data;
    } catch (err: any) {
      console.error('💥 Request error:', err);
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
      console.log('🏁 Request completed');
    }
  };

  const get = <T = any>(endpoint: string, options: RequestInit = {}) =>
    makeRequest<T>(endpoint, { ...options, method: 'GET' });

  const post = <T = any>(endpoint: string, data: any, options: RequestInit = {}) =>
    makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });

  const put = <T = any>(endpoint: string, data: any, options: RequestInit = {}) =>
    makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });

  const del = <T = any>(endpoint: string, options: RequestInit = {}) =>
    makeRequest<T>(endpoint, { ...options, method: 'DELETE' });

  return {
    get,
    post,
    put,
    del,
    loading,
    error,
    clearError: () => setError(null),
  };
}
