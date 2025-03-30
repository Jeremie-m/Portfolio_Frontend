'use client';

import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/features/projects/contexts/ProjectsContext';

export const useProjects = () => {
  const { globalProjects, setGlobalProjects, fetchProjects } = useProjectsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('4. useEffect dans useProjects - globalProjects:', globalProjects);
  }, [globalProjects]);

  // Charger les données au montage du composant
  useEffect(() => {
    console.log('5. Appel de fetchProjects dans useEffect');
    fetchProjects();
  }, []);

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
      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un projet');
      } 

      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(projectData),
      });

      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const responseData = await response.json();
      console.log('Données de la réponse:', responseData);
      
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

  // Fonction pour sauvegarder les modifications
  const saveProjects = async (updatedProjects) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/projects', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedProjects),
      // });
      // const data = await response.json();
      setGlobalProjects([...updatedProjects]);
      setProjects([...updatedProjects]);
      return true;
    } catch (err) {
      throw new Error('Erreur lors de la sauvegarde des projets');
    }
  };

  // Fonction pour supprimer un projet
  const deleteProject = async (id) => {
    try {
      // Remplacer la logique de suppression
      const updatedProjects = globalProjects.filter(project => project.id !== id);
      setGlobalProjects(updatedProjects);
      setProjects(updatedProjects);
      
      // TODO: Décommenter quand l'API sera prête
      // await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      
      return true;
    } catch (err) {
      throw new Error('Erreur lors de la suppression du projet');
    }
  };
  
  // Ajouter cette fonction pour forcer la synchronisation
  const refreshProjects = async () => {
    setProjects([...globalProjects]);
  };

  

  // Fonction pour mettre à jour un projet
  const updateProject = async (id, projectData) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch(`/api/projects/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(projectData),
      // });
      const updatedProject = {
        id,
        ...projectData
      };
      const updatedProjects = projects.map(project => 
        project.id === id ? updatedProject : project
      );
      setGlobalProjects(updatedProjects);
      setProjects(updatedProjects);
      return updatedProject;
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du projet');
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    globalProjects,
    isLoading,
    error,
    fetchProjects,
    saveProjects,
    deleteProject,
    addProject,
    updateProject
  };
}; 