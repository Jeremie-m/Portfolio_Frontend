'use client';

import { useState, useEffect } from 'react';
import { aboutMeText } from '@/features/aboutme/mocks/aboutme'; // On suppose que ce mock existe

export const useAboutMe = () => {
  // État initial avec les propriétés correctes
  const [aboutMe, setAboutMe] = useState({
    id: '',
    text: '',
    updated_at: null
  });
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
  const fetchContent = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      // Ajouter un timestamp pour éviter le cache du navigateur
      const timestamp = Date.now();
      // Toujours ajouter refresh=true pour forcer le rafraîchissement côté API
      const url = `/api/about-me?refresh=true&t=${timestamp}`;
      
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
      if (!data.text) {
        console.warn('Format de réponse inattendu:', data);
        if (data.message) {
          throw new Error(data.message);
        }
      }
      
      // Mettre à jour l'état avec les données correctes
      setAboutMe(data);
      console.log('Données About-me chargées:', data);
      setError(null);

    } catch (err) {
      setError('Erreur lors du chargement des données About-me');
      console.error('Erreur lors du chargement des données About-me:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction PUT pour sauvegarder les modifications
  const saveContent = async (newText) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Vérifier que le texte est valide
      if (!newText || typeof newText !== 'string') {
        throw new Error('Le texte est requis et doit être une chaîne de caractères');
      }
      
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
      
      // Envoyer la requête avec le token
      const response = await fetch('/api/about-me', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ text: newText }),
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
      
      // Mettre à jour immédiatement l'état avec les nouvelles données
      setAboutMe(data);
      console.log('Données sauvegardées avec succès:', data);
      
      // Terminer le chargement
      setIsLoading(false);
      
      return data;
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des données About-me:', err);
      setError(err.message || 'Erreur lors de la sauvegarde des données');
      throw err;
    } finally {
      // S'assurer que le chargement est terminé même en cas d'erreur
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchContent();
  }, []);

  return {
    // Exposer les propriétés spécifiques pour faciliter l'utilisation
    id: aboutMe.id,
    text: aboutMe.text,
    updated_at: aboutMe.updated_at,
    aboutMe, // Exposer aussi l'objet complet si nécessaire
    isLoading,
    error,
    fetchContent,
    saveContent,
    // Fonction d'aide pour forcer le rafraîchissement - comme toutes les requêtes ignorent le cache,
    // cette fonction fait simplement un appel à fetchContent
    refreshContent: () => fetchContent()
  };
}; 