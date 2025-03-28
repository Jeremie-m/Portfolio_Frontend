'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SkillsContext = createContext();

export function SkillsProvider({ children }) {
  const [globalSkills, setGlobalSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les skills depuis l'API
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/skills', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Vérifier le format de la réponse
      if (Array.isArray(data)) {
        setGlobalSkills(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        setGlobalSkills(data.data);
      } else {
        throw new Error('Format de réponse inattendu');
      }

      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des skills:', err);
      setError(err.message || 'Erreur lors du chargement des skills');
      setGlobalSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les skills au montage du composant
  useEffect(() => {
    fetchSkills();
  }, []);

  const value = {
    globalSkills,
    setGlobalSkills,
    isLoading,
    error,
    fetchSkills
  };

  return (
    <SkillsContext.Provider value={value}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkillsContext() {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkillsContext must be used within a SkillsProvider');
  }
  return context;
} 