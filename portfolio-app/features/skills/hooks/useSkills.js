'use client';

import { useState } from 'react';
import { useSkillsContext } from '../contexts/SkillsContext';

export const useSkills = () => {
  const { globalSkills, setGlobalSkills, fetchSkills } = useSkillsContext();
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

  // Fonction pour ajouter un skill
  const addSkill = async (e) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un texte');
      }
      
      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(e),
      });

      // Gérer les erreurs d'authentification spécifiquement
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Erreur lors de l\'ajout du skill');
      }

      // Mettre à jour l'état avec le nouveau skill
      setGlobalSkills(prevSkills => [...prevSkills, responseData]);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour un skill
  const updateSkill = async (id, skillData) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier un skill');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
      };

      const response = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(skillData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du skill');
      }

      const updatedSkill = await response.json();
      setGlobalSkills(prevSkills =>
        prevSkills.map(skill => skill.id === id ? updatedSkill : skill)
      );
      return updatedSkill;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un skill
  const deleteSkill = async (id) => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour supprimer un skill');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      };

      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du skill');
      }

      setGlobalSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillChange = (id, field, value) => {
    // Ne mettre à jour que name et image_url dans localSkills
    const updatedSkills = globalSkills.map(skill => 
      skill.id === id 
        ? { 
            ...skill,
            name: field === 'name' ? value : skill.name,
            image_url: field === 'image_url' ? value : skill.image_url
          } 
        : skill
    );
    setGlobalSkills(updatedSkills);
  };

  const handleSkillUpdate = async (id) => {
    try {
      const skill = globalSkills.find(s => s.id === id);
      if (!skill) return;
      
      // Extraire uniquement les propriétés nécessaires
      const { name, image_url } = skill;
      await updateSkill(id, { name, image_url });
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    skills: globalSkills,
    isLoading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
    refreshSkills: fetchSkills
  };
}; 