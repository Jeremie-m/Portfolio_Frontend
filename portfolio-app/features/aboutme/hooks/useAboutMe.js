'use client';

import { useState, useEffect } from 'react';
import { aboutMeText } from '@/features/aboutme/mocks/aboutme'; // On suppose que ce mock existe

export const useAboutMe = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction GET pour charger les données
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/about-me');
      // const data = await response.json();
      // setContent(data.content);
      
      // Pour le moment, on utilise les données mockées
      setContent(aboutMeText);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du contenu');
      console.error('Erreur lors du chargement du contenu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction PUT pour sauvegarder les modifications
  const saveContent = async (newContent) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/about-me', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ content: newContent }),
      // });
      // const data = await response.json();
      // setContent(data.content);
      // return data;
      
      // Pour le moment, on simule une sauvegarde réussie
      console.log('Contenu sauvegardé:', newContent);
      setContent(newContent);
      return true;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      throw new Error('Erreur lors de la sauvegarde du contenu');
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    isLoading,
    error,
    fetchContent,
    saveContent
  };
}; 