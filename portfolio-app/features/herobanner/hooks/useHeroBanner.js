'use client';

import { useState, useEffect } from 'react';
import { heroBannerTexts } from '@/features/herobanner/mocks/herobanner';

export const useHeroBanner = () => {
  const [texts, setTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction GET pour charger les données
  const fetchTexts = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/hero-banner');
      // const data = await response.json();
      // setTexts(data);
      
      // Pour le moment, on utilise les données mockées
      setTexts(heroBannerTexts);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des textes');
      console.error('Erreur lors du chargement des textes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction PUT pour sauvegarder les modifications
  const saveTexts = async (updatedTexts) => {
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch('/api/hero-banner', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedTexts),
      // });
      // const data = await response.json();
      // return data;
      
      // Pour le moment, on simule une sauvegarde réussie
      console.log('Textes sauvegardés:', updatedTexts);
      setTexts(updatedTexts);
      return true;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      throw new Error('Erreur lors de la sauvegarde des textes');
    }
  };

  // Fonction DELETE pour supprimer un texte
  const deleteText = async (id) => {
    try {
      const updatedTexts = texts.filter(item => item.id !== id);
      await saveTexts(updatedTexts);
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw new Error('Erreur lors de la suppression du texte');
    }
  };

  // Fonction POST pour ajouter un nouveau texte
  const addText = async (text = "Nouveau texte") => {
    try {
      const newId = Math.max(...texts.map(item => item.id), 0) + 1;
      const newItem = {
        id: newId,
        text,
        isActive: true
      };
      
      const updatedTexts = [newItem, ...texts];
      await saveTexts(updatedTexts);
      return newItem;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      throw new Error('Erreur lors de l\'ajout du texte');
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchTexts();
  }, []);

  return {
    texts,
    isLoading,
    error,
    fetchTexts,
    saveTexts,
    deleteText,
    addText
  };
}; 