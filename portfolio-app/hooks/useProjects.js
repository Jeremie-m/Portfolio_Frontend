'use client';

import { useState, useEffect } from 'react';
import { useProjectsContext } from '@/contexts/ProjectsContext';

export const useProjects = () => {
  const { globalProjects, setGlobalProjects } = useProjectsContext();
  const [projects, setProjects] = useState(globalProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchroniser l'état local avec l'état global
  useEffect(() => {
    setProjects(globalProjects);
  }, [globalProjects]);

  // Fonction pour charger les projets
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/projects');
      // const data = await response.json();
      setProjects(globalProjects);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      setProjects(globalProjects);
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

  // Fonction pour ajouter un nouveau projet
  const addProject = async (projectData) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(projectData),
      // });
      const newId = Math.max(...projects.map(project => project.id), 0) + 1;
      const newProject = {
        id: newId,
        ...projectData
      };
      const updatedProjects = [...projects, newProject];
      setGlobalProjects(updatedProjects);
      setProjects(updatedProjects);
      return newProject;
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout du projet');
    }
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
    projects,
    isLoading,
    error,
    fetchProjects,
    saveProjects,
    deleteProject,
    addProject,
    updateProject
  };
}; 