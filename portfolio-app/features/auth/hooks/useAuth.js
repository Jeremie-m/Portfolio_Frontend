'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour vérifier si un token est valide
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // Fonction pour récupérer le token
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
  };

  // Fonction pour définir le token avec gestion de l'expiration
  const setToken = (token) => {
    if (!token) {
      sessionStorage.removeItem('authToken');
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const expiresIn = decodedToken.exp * 1000 - Date.now();
      
      if (expiresIn <= 0) {
        sessionStorage.removeItem('authToken');
        setIsAuthenticated(false);
        return;
      }

      sessionStorage.setItem('authToken', token);
      setIsAuthenticated(true);

      // Programmer la suppression automatique du token
      setTimeout(() => {
        sessionStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }, expiresIn);

    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      sessionStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  // Vérifier le token au chargement et configurer sa suppression automatique
  useEffect(() => {
    const token = getToken();
    if (token) {
      if (isTokenValid(token)) {
        setToken(token); // Cela va configurer le timer pour l'expiration
      } else {
        logout(); // Supprimer le token s'il est déjà expiré
      }
    }
  }, []);

  return {
    isAuthenticated,
    getToken,
    setToken,
    logout,
    isTokenValid
  };
}; 