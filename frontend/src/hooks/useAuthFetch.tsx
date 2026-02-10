import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const useAuthFetch = () => {
  const { token, logout } = useContext(AuthContext);

  const authFetch = async (url: string, options: FetchOptions = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        logout();
        throw new Error('Unauthorized - Please login again');
      }

      if (response.status === 403) {
        throw new Error('Forbidden - You do not have permission');
      }

      if (response.status >= 500) {
        throw new Error('Server error occurred');
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  return authFetch;
};