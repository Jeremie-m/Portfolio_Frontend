/**
 * @fileoverview Routes API pour les données "Hero Banner"
 * Implémentation des routes GET et POST
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
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    // Récupérer le corps de la requête
    const body = await request.json();
    
    // Validation du corps de la requête
    if (!body || !body.text) {
      return NextResponse.json(
        { message: 'Le texte est requis' },
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
      'Authorization': authHeader // Transmettre le header d'autorisation tel quel
    };
    
    console.log('Headers envoyés au backend:', headers); // Pour déboguer
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });
    
    // Essayer de récupérer les données de la réponse
    let responseData;
    try {
      responseData = await response.json();
      console.log('Réponse du backend:', responseData); // Pour déboguer
    } catch (e) {
      console.error('Erreur lors de la lecture de la réponse:', e); // Pour déboguer
      responseData = { message: 'Impossible de lire la réponse du serveur' };
    }
    
    // Si le backend n'est pas disponible ou renvoie une erreur
    if (!response.ok) {
      if (response.status === 401) {
        console.error('Erreur 401 du backend:', responseData); // Pour déboguer
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