'use client';

import { useState, useEffect } from 'react';
// Suppression de l'import des mocks car non nécessaire
// import { heroBannerTexts } from '@/features/herobanner/mocks/herobanner';

export const useHeroBanner = () => {
  const [texts, setTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fonction GET pour charger les données
  const fetchTexts = async () => {
    setIsLoading(true);
    try {
      const url = `/api/herobanner?isActive=true`;
      
      // Options pour éviter le cache côté client
      const options = {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      };
      
      const response = await fetch(url, options);
      
      // Vérifier si la réponse est correcte
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      
      // Vérifier si on a bien les données attendues
      if (Array.isArray(data)) {
        // C'est un tableau, on peut l'utiliser directement
        setTexts(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        // C'est un objet avec une propriété data qui est un tableau
        console.log('Utilisation de la propriété data qui contient le tableau');
        setTexts(data.data);
      } else if (data && typeof data === 'object' && Array.isArray(data.textes)) {
        // C'est un objet avec une propriété textes qui est un tableau
        console.log('Utilisation de la propriété textes qui contient le tableau');
        setTexts(data.textes);
      } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
        // C'est un objet avec une propriété items qui est un tableau
        console.log('Utilisation de la propriété items qui contient le tableau');
        setTexts(data.items);
      } else {
        console.warn('Format de réponse inattendu:', data);
        if (data && data.message) {
          throw new Error(data.message);
        }
        throw new Error('Format de réponse inattendu');
      }
      
      console.log('Textes du héros chargés:', texts);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des textes');
      console.error('Erreur lors du chargement des textes:', err);
      
      // Ne pas utiliser de données mockées en cas d'erreur
      // Garder le tableau vide
      setTexts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction PUT pour sauvegarder les modifications
  const saveTexts = async (updatedTexts) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier le contenu');
      }
      
      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch('/api/herobanner', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatedTexts),
      });
      
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }
      
      const data = await response.json();
      
      // Mettre à jour l'état avec les données mises à jour
      setTexts(data);
      console.log('Textes sauvegardés avec succès:', data);
      return data;
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde des textes');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction DELETE pour supprimer un texte
  const deleteText = async (id) => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const token = getAuthToken();
      if (!token) {
        throw new Error('Vous devez être connecté pour supprimer un texte');
      }
      
      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`/api/herobanner/${id}`, {
        method: 'DELETE',
        headers: headers
      });
      
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }
      
      // Mettre à jour l'état local sans faire de nouveau appel API
      const updatedTexts = texts.filter(item => item.id !== id);
      setTexts(updatedTexts);
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.message || 'Erreur lors de la suppression du texte');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction POST pour ajouter un nouveau texte
  const addText = async (text = "Nouveau texte") => {
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
      
      const response = await fetch('/api/herobanner', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ text, isActive: true }),
      });
      
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout');
      }
      
      const newItem = await response.json();
      
      // Mettre à jour l'état local avec le nouveau texte
      setTexts(prevTexts => [newItem, ...prevTexts]);
      
      return newItem;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError(err.message || 'Erreur lors de l\'ajout du texte');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour rafraîchir les données
  const refreshTexts = () => fetchTexts();

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
    addText,
    refreshTexts
  };
}; 