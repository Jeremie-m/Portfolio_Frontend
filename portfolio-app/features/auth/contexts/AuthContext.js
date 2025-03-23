'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  isAdmin: false,
  setIsAdmin: () => {},
});

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Vérifier le token au chargement depuis sessionStorage
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('authToken');
      setIsAdmin(!!token);
  
      // Observer les changements de sessionStorage
      const handleStorageChange = (e) => {
        if (e.key === 'authToken') {
          setIsAdmin(!!e.newValue);
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 