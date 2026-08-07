import { useState, useEffect } from 'react';

const TOKEN_KEY = 'devlens_token';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  // Picks up token changes made in other tabs (or manually via devtools for now).
  useEffect(() => {
    function handleStorage() {
      setToken(localStorage.getItem(TOKEN_KEY));
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    token,
    isAuthenticated: Boolean(token),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    },
  };
}