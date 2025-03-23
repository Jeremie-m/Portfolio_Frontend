/**
 * @fileoverview Routes API pour les données "À propos de moi"
 * Implémentation des routes GET et PUT qui sont des proxies vers le backend
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Cache en mémoire pour l'API about-me
 * Permet d'éviter les appels multiples en peu de temps
 */
let apiCache = {
  data: null,
  timestamp: 0,
  expiresIn: 1000 // 1 seconde en millisecondes
};

/**
 * Vérifie si les données en cache sont encore valides
 * @returns {boolean} True si le cache est valide, false sinon
 */
function isCacheValid() {
  const now = Date.now();
  return apiCache.data && (now - apiCache.timestamp < apiCache.expiresIn);
}

/**
 * Récupère les données "À propos de moi" depuis le backend
 * @route GET /api/about-me
 */
export async function GET(request) {
  try {
    // Vérifier si l'URL de la requête contient un paramètre pour forcer le rafraîchissement
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Utiliser le cache si disponible et non expiré, sauf si on force le rafraîchissement
    if (isCacheValid() && !forceRefresh) {
      console.log('Utilisation des données en cache pour about-me');
      return NextResponse.json(apiCache.data, { 
        status: 200,
        headers: {
          'Cache-Control': 'max-age=60', // Cache côté navigateur de 60 secondes
          'X-Cache': 'HIT'
        }
      });
    }

    // Si le cache n'est pas valide ou si on force le rafraîchissement, récupérer les données depuis le backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/about-me`;
    
    console.log(`Tentative de récupération des données depuis: ${endpoint}`);
    
    // Appel au backend
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    // Si le backend n'est pas disponible, on retourne des données simulées
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Données non trouvées sur le backend');
        return NextResponse.json(
          { message: 'Les données "À propos de moi" n\'ont pas été trouvées' },
          { status: 404 }
        );
      }
      
      console.warn(`Erreur lors de l'appel au backend: ${response.status}. Utilisation de données simulées.`);
      
      // Données de fallback
      const fallbackData = {
        id: '1',
        text: "Erreur dans le chargement des données depuis le backend",
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json(fallbackData, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Cache': 'DISABLED'
        }
      });
    }

    // Récupérer les données du backend
    const backendData = await response.json();
    
    // Mettre à jour le cache
    apiCache.data = backendData;
    apiCache.timestamp = Date.now();
    
    // Retourner les données au client
    return NextResponse.json(backendData, { 
      status: 200,
      headers: {
        'Cache-Control': 'max-age=60', 
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données about-me:', error);
    
    // En cas d'erreur, on retourne des données simulées qui respectent le format attendu
    const fallbackData = {
      id: '1',
      text: "Erreur dans le chargement des données depuis le backend",
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(fallbackData, { 
      status: 200,
      headers: {
        'Cache-Control': 'max-age=60',
        'X-Cache': 'MISS' 
      }
    });
  }
}

/**
 * Met à jour les données "À propos de moi" via le backend
 * @route PUT /api/about-me
 */
export async function PUT(request) {
  try {
    // Récupérer le token depuis l'en-tête Authorization de la requête entrante
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader) {
      // Si l'en-tête est au format "Bearer <token>"
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Sinon utiliser directement la valeur
        token = authHeader;
      }
      console.log('Token récupéré de l\'en-tête Authorization');
    } else {
      // Aucun token trouvé
      console.log('Aucun token trouvé dans l\'en-tête Authorization');
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Récupération du corps de la requête
    const body = await request.json();
    
    // Validation simple des données
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { message: 'Les données sont invalides. Le texte est requis.' },
        { status: 400 }
      );
    }

    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/about-me`;

    console.log(`Tentative de mise à jour des données sur: ${endpoint}`);
    
    // Mode developement/fallback: permettre la mise à jour même sans backend valide
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      console.log('Mode mock activé pour la mise à jour about-me');
      
      // Dans ce cas, simuler une mise à jour réussie
      const mockData = {
        id: '1',
        text: body.text,
        updated_at: new Date().toISOString()
      };
      
      // Mise à jour du cache
      apiCache.data = mockData;
      apiCache.timestamp = Date.now();
      
      return NextResponse.json(mockData, { status: 200 });
    }
    
    // En mode normal, appel au backend avec le token d'authentification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log('Envoi de la requête au backend avec authentification');
    
    // Appel au backend avec le token d'authentification
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    // Essayer de récupérer les données de la réponse
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { message: 'Impossible de lire la réponse du serveur' };
    }

    // Si le backend n'est pas disponible ou renvoie une erreur
    if (!response.ok) {
      console.error('Erreur backend:', response.status, responseData);
      
      if (response.status === 401) {
        return NextResponse.json(
          { 
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            error: responseData.error
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          message: responseData.message || 'Erreur lors de la mise à jour des données',
          error: responseData.error
        },
        { status: response.status }
      );
    }

    // Après mise à jour réussie, invalider le cache
    apiCache.data = null;
    apiCache.timestamp = 0;
    
    // Retourner les données mises à jour au client
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données about-me:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour des données', details: error.message },
      { status: 500 }
    );
  }
}
