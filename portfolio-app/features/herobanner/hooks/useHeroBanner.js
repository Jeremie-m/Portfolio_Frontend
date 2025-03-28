'use client';

import { useState, useEffect } from 'react';
// Suppression de l'import des mocks car non nécessaire
// import { heroBannerTexts } from '@/features/herobanner/mocks/herobanner';

export const useHeroBanner = () => {
  const [activeTexts, setActiveTexts] = useState([]);
  const [allTexts, setAllTexts] = useState([]);
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

  // Fonction GET pour charger les données actives
  const fetchActiveTexts = async () => {
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
        setActiveTexts(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        setActiveTexts(data.data);
      } else if (data && typeof data === 'object' && Array.isArray(data.textes)) {
        setActiveTexts(data.textes);
      } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
        setActiveTexts(data.items);
      } else {
        if (data && data.message) {
          throw new Error(data.message);
        }
        throw new Error('Format de réponse inattendu');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des textes');
      setActiveTexts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction GET pour charger les données totales
  const fetchAllTexts = async () => {
    setIsLoading(true);
    try {
      const url = `/api/herobanner`;
      
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
        setAllTexts(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        setAllTexts(data.data);
      } else {
        throw new Error('Format de réponse inattendu');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des textes');
      setAllTexts([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sauvegarde les textes modifiés
   * @param {Array} updatedTexts - Liste des textes à sauvegarder
   * @returns {Promise<boolean>} - Succès ou échec de l'opération
   */
  const saveTexts = async (updatedTexts) => {
    if (!updatedTexts || !Array.isArray(updatedTexts) || updatedTexts.length === 0) {
      setError('Aucun texte à sauvegarder');
      return false;
    }

    setIsLoading(true);
    const authToken = getAuthToken();
    
    if (!authToken) {
      setError('Vous devez être connecté pour effectuer cette action');
      setIsLoading(false);
      return false;
    }

    try {
      // Envoyer une requête PUT individuelle pour chaque texte
      const updatePromises = updatedTexts.map(async (text) => {
        if (!text.id) {
          throw new Error('L\'ID est manquant pour un élément');
        }
        
        const response = await fetch(`/api/herobanner/${text.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          body: JSON.stringify(text),
          cache: 'no-store'
        });

        if (!response.ok) {
          // Si la réponse est 401, problème d'authentification
          if (response.status === 401) {
            throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
          }
          
          // Essayer de récupérer le message d'erreur
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur lors de la mise à jour du texte ${text.id}`);
        }

        return await response.json();
      });

      // Attendre que toutes les requêtes soient terminées
      await Promise.all(updatePromises);
      
      // Rafraîchir les données après la sauvegarde
      await fetchActiveTexts();
      await fetchAllTexts();

      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error.message || 'Erreur lors de la sauvegarde des textes');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Supprime un texte
   * @param {string} id - ID du texte à supprimer
   * @returns {Promise<boolean>} - Succès ou échec de l'opération
   */
  const deleteText = async (id) => {
    if (!id) {
      setError('ID du texte manquant');
      return false;
    }

    setIsLoading(true);
    const authToken = getAuthToken();
    
    if (!authToken) {
      setError('Vous devez être connecté pour effectuer cette action');
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(`/api/herobanner/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authToken,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        // Si la réponse est 401, problème d'authentification
        if (response.status === 401) {
          setError('Votre session a expiré. Veuillez vous reconnecter.');
          setIsLoading(false);
          return false;
        }
        
        // Essayer de récupérer le message d'erreur
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Erreur lors de la suppression du texte ${id}`);
        setIsLoading(false);
        return false;
      }

      // Rafraîchir les données après la suppression
      await fetchActiveTexts();
      await fetchAllTexts();
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Erreur lors de la suppression du texte');
      setIsLoading(false);
      return false;
    }
  };

  // Fonction POST pour ajouter un nouveau texte
  const addText = async (text = "Nouveau texte") => {
    setIsLoading(true);
    try {
      // Récupérer le token d'authentification
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Vous devez être connecté pour ajouter un texte');
      }
      
      // Configurer les en-têtes avec le token
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`
      };  
      
      const response = await fetch('/api/herobanner', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
          text, 
          isActive: true,
        }),
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
      console.log('Nouveau texte ajouté:', newItem); // Pour déboguer
      
      // Mettre à jour l'état local avec le nouveau texte
      setActiveTexts(prevTexts => [...prevTexts, newItem].sort((a, b) => a.order - b.order));
      setAllTexts(prevTexts => [...prevTexts, newItem].sort((a, b) => a.order - b.order));
      
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
  const refreshTexts = () => fetchActiveTexts();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchActiveTexts();
    fetchAllTexts();
  }, []);

  return {
    activeTexts,
    allTexts,
    isLoading,
    error,
    fetchActiveTexts,
    fetchAllTexts,
    saveTexts,
    deleteText,
    addText,
    refreshTexts
  };
}; 