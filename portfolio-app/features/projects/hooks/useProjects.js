'use client';

import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/features/projects/contexts/ProjectsContext';

export const useProjects = () => {
  const { globalProjects, setGlobalProjects, fetchProjects } = useProjectsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  /**
   * Récupère le token d'authentification depuis sessionStorage
   * @returns {string|null} Le token ou null si non trouvé
   */
  const getAuthToken = () => {
    // Vérifier que window existe (Next.js SSR sécurité)
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('authToken');
    }
    return null;
  }; 

  // Fonction pour ajouter un nouveau projet
  const addProject = async (projectData) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      console.log('Token récupéré:', token); // Debug

      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un projet');
      }

      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      console.log('Headers envoyés:', headers); // Debug

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(projectData),
      });

      console.log('Status:', response.status); // Debug
      const responseData = await response.json();
      console.log('Réponse:', responseData); // Debug

      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Erreur lors de l\'ajout du projet');
      }

      setGlobalProjects(prevProjects => [...prevProjects, responseData]);
      return responseData;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du projet:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un projet
  const deleteProject = async (id) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      console.log('Token récupéré:', token); // Debug

      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un projet');
      }

      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };
      console.log('Headers envoyés:', headers); // Debug

      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Erreur lors de la suppression du projet');
      }
      
      setGlobalProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);  
    }
  };

  // Fonction pour mettre à jour un projet
  const updateProject = async (id, projectData) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      console.log('Token récupéré pour update:', token); // Debug

      if (!token) {
        throw new Error('Vous devez être connecté pour modifier un projet');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Headers pour update:', headers); // Debug

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(projectData)
      });

      console.log('Status de la réponse update:', response.status); // Debug

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Erreur lors de la mise à jour du projet');
      }

      const updatedProject = await response.json();
      console.log('Projet mis à jour:', updatedProject); // Debug

      setGlobalProjects(prevProjects =>
        prevProjects.map(project => project.id === id ? updatedProject : project)
      );
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects: globalProjects,
    isLoading,
    error,
    fetchProjects,
    deleteProject,
    addProject,
    updateProject
  };
}; 