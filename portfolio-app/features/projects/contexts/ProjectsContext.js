'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [globalProjects, setGlobalProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Données dans le contexte:', globalProjects);
  }, [globalProjects]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
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
      
      console.log('1. Avant setGlobalProjects:', globalProjects);
      
      if (data && Array.isArray(data.items)) {
        setGlobalProjects(data.items);
        console.log('2. Data reçue:', data.items);
        
        setTimeout(() => {
          console.log('3. État après mise à jour (timeout):', globalProjects);
        }, 100);
      } else {
        throw new Error('Format de réponse inattendu');
      }

      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
      setError(err.message);
      setGlobalProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const value = {
    globalProjects,
    setGlobalProjects,
    isLoading,
    error,
    fetchProjects
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
} 