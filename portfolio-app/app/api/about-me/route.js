/**
 * @fileoverview Routes API pour les données "À propos de moi"
 * Implémentation des routes GET et PUT qui sont des proxies vers le backend
 */

import { NextResponse } from 'next/server';


/**
 * Récupère les données "À propos de moi" depuis le backend
 * @route GET /api/about-me
 */
export async function GET(request) {
  try {
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      return NextResponse.json(mockAboutMe);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }

      const response = await fetch(`${apiUrl}/about-me`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.error || 'Erreur lors de la récupération des informations' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations', details: error.message },
      { status: 500 }
    );
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
    } else {
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
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body)
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
