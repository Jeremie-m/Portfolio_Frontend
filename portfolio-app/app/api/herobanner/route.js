/**
 * @fileoverview Routes API pour les données "Hero Banner"
 * Implémentation des routes GET, POST, PUT et DELETE
 */

import { NextResponse } from 'next/server';

// Remarque: Le cache a été supprimé car non nécessaire

/**
 * Récupère les textes du hero banner
 * @route GET /api/hero-banner
 */
export async function GET(request) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const isActiveFilter = searchParams.get('isActive');
    
    // Si le cache n'est pas valide ou si on force le rafraîchissement, récupérer les données depuis le backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Ajouter le paramètre isActive à l'URL du backend si présent
    let endpoint = `${apiUrl}/herobanner`;
    if (isActiveFilter) {
      endpoint += `?isActive=${isActiveFilter}`;
    }
    
    console.log(`Tentative de récupération des données depuis: ${endpoint}`);
    
    // Appel au backend sans cache
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });

    // Si le backend n'est pas disponible, on retourne une erreur
    if (!response.ok) {
      console.warn(`Erreur lors de l'appel au backend: ${response.status}.`);
      
      // Au lieu de retourner des données mockées, on retourne une erreur
      return NextResponse.json(
        { message: `Erreur lors de la communication avec le backend: ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer les données du backend
    const backendData = await response.json();
    
    // Log pour débogage
    console.log('Données reçues du backend:', backendData);
    console.log('Type des données du backend:', typeof backendData);
    console.log('Est-ce un tableau?', Array.isArray(backendData));
    
    // Filtrer les données côté serveur si le paramètre isActive est spécifié
    let filteredData = backendData;
    if (isActiveFilter === 'true' && Array.isArray(backendData)) {
      filteredData = backendData.filter(item => item.isActive === true);
      console.log(`Filtrage des données par isActive=true : ${filteredData.length} éléments sur ${backendData.length}`);
    }
    
    // Retourner les données au client sans cache
    return NextResponse.json(filteredData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données herobanner:', error);
    
    // Au lieu de retourner des données mockées, on renvoie une erreur
    return NextResponse.json(
      { message: `Erreur interne du serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Ajoute un nouveau texte dans le hero banner
 * @route POST /api/hero-banner
 */
export async function POST(request) {
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
      // Aucun token trouvé
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Récupération du corps de la requête
    const body = await request.json();
    
    // Validation des données
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { message: 'Le texte est requis et doit être une chaîne de caractères.' },
        { status: 400 }
      );
    }
    
    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/herobanner`;
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      console.log('Mode mock activé pour l\'ajout de herobanner');
      
      // Dans ce cas, simuler un ajout réussi
      const newItem = {
        id: Date.now(),
        text: body.text,
        isActive: body.isActive !== undefined ? body.isActive : true,
        created_at: new Date().toISOString()
      };
      
      return NextResponse.json(newItem, { status: 201 });
    }
    
    // En mode normal, appel au backend avec le token d'authentification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
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
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Votre session a expiré. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: responseData.message || 'Erreur lors de l\'ajout du texte' },
        { status: response.status }
      );
    }
    
    // Retourner l'élément ajouté au client
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de herobanner:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout du texte', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Met à jour les textes du hero banner
 * @route PUT /api/hero-banner
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
      // Aucun token trouvé
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Récupération du corps de la requête
    const body = await request.json();
    
    // Validation des données
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: 'Les données doivent être un tableau de textes.' },
        { status: 400 }
      );
    }
    
    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/herobanner`;
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      console.log('Mode mock activé pour la mise à jour de herobanner');
      
      // Dans ce cas, simuler une mise à jour réussie
      const updatedData = body.map(item => ({
        ...item,
        updated_at: new Date().toISOString()
      }));
      
      return NextResponse.json(updatedData, { status: 200 });
    }
    
    // En mode normal, appel au backend avec le token d'authentification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
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
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Votre session a expiré. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: responseData.message || 'Erreur lors de la mise à jour des textes' },
        { status: response.status }
      );
    }
    
    // Retourner les données mises à jour au client
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des textes herobanner:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour des textes', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Supprime un texte du hero banner
 * @route DELETE /api/hero-banner/[id]
 */
export async function DELETE(request) {
  try {
    // Extraire l'ID du texte à supprimer depuis l'URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID du texte requis' },
        { status: 400 }
      );
    }
    
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
      // Aucun token trouvé
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/herobanner/${id}`;
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      console.log('Mode mock activé pour la suppression de herobanner');
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    // En mode normal, appel au backend avec le token d'authentification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: headers,
      cache: 'no-store'
    });
    
    // Si le backend n'est pas disponible ou renvoie une erreur
    if (!response.ok) {
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { message: 'Impossible de lire la réponse du serveur' };
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Votre session a expiré. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: responseData.message || 'Erreur lors de la suppression du texte' },
        { status: response.status }
      );
    }
    
    // Retourner un succès sans contenu
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression de herobanner:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du texte', details: error.message },
      { status: 500 }
    );
  }
} 