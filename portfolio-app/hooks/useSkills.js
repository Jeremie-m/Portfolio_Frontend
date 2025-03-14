'use client';

import { useState, useEffect } from 'react';
import { skills as mockSkills } from '@/mocks/skills';

export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les compétences
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/skills');
      // const data = await response.json();
      // setSkills(data);
      
      // Pour le moment, on utilise les données mockées
      setSkills(mockSkills);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des compétences');
      console.error('Erreur lors du chargement des compétences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les modifications
  const saveSkills = async (updatedSkills) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/skills', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedSkills),
      // });
      // const data = await response.json();
      // setSkills(data);
      
      // Pour le moment, on simule une sauvegarde réussie
      console.log('Compétences sauvegardées:', updatedSkills);
      setSkills(updatedSkills);
      return true;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      throw new Error('Erreur lors de la sauvegarde des compétences');
    }
  };

  // Fonction pour supprimer une compétence
  const deleteSkill = async (id) => {
    try {
      const updatedSkills = skills.filter(skill => skill.id !== id);
      await saveSkills(updatedSkills);
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw new Error('Erreur lors de la suppression de la compétence');
    }
  };

  // Fonction pour ajouter une nouvelle compétence
  const addSkill = async (skillData) => {
    try {
      const newId = Math.max(...skills.map(skill => skill.id), 0) + 1;
      const newSkill = {
        id: newId,
        ...skillData
      };
      
      const updatedSkills = [...skills, newSkill];
      await saveSkills(updatedSkills);
      return newSkill;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      throw new Error('Erreur lors de l\'ajout de la compétence');
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    isLoading,
    error,
    fetchSkills,
    saveSkills,
    deleteSkill,
    addSkill
  };
}; 