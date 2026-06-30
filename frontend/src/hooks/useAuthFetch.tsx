import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const useAuthFetch = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const token = context?.token ?? null;
  const refreshToken = context?.refreshToken ?? (async () => null);

  const authFetch = async (url: string, options: FetchOptions = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          throw new Error('Session expired - Please login again');
        }
      }

      if (response.status === 403) {
        navigate('/login/')
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