'use client';

import { useState, useEffect } from 'react';
import { useSkillsContext } from '@/contexts/SkillsContext';

export const useSkills = () => {
  const { globalSkills, setGlobalSkills } = useSkillsContext();
  const [skills, setSkills] = useState(globalSkills);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchroniser l'état local avec l'état global
  useEffect(() => {
    setSkills(globalSkills);
  }, [globalSkills]);

  // Fonction pour charger les compétences
  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/skills');
      // const data = await response.json();
      // setSkills(data);
      // setGlobalSkills(data);
      
      // Pour le moment, on utilise les données globales
      setSkills(globalSkills);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des compétences');
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
      // setGlobalSkills(data);
      
      // Pour le moment, on simule une sauvegarde réussie
      setGlobalSkills([...updatedSkills]);
      setSkills([...updatedSkills]);
      return true;
    } catch (err) {
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
      throw new Error('Erreur lors de l\'ajout de la compétence');
    }
  };

  // Charger les données au montage du composant seulement si l'état global est vide
  useEffect(() => {
    if (globalSkills.length === 0) {
      fetchSkills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSkills.length]);

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