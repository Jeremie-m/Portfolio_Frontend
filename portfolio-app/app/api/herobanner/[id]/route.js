/**
 * @fileoverview Routes API pour les opérations sur un élément spécifique du "Hero Banner"
 * Implémentation des routes PUT et DELETE avec ID
 */

import { NextResponse } from 'next/server';

/**
 * Met à jour un texte spécifique du hero banner
 * @route PUT /api/herobanner/[id]
 */
export async function PUT(request, context) {
  try {
    // Attendre les paramètres avant d'y accéder
    const params = await context.params;
    if (!params) {
      return NextResponse.json(
        { message: 'Paramètres invalides' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
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
    
    // Récupération du corps de la requête
    const body = await request.json();
    
    // Validation minimale des données
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { message: 'Le texte est requis et doit être une chaîne de caractères.' },
        { status: 400 }
      );
    }
    
    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/herobanner/${id}`;
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // Dans ce cas, simuler une mise à jour réussie
      const updatedItem = {
        ...body,
        id,
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json(updatedItem, { status: 200 });
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
        { message: responseData.message || `Erreur lors de la mise à jour du texte ${id}` },
        { status: response.status }
      );
    }
    
    // Retourner l'élément mis à jour au client
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du texte', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Supprime un texte spécifique du hero banner
 * @route DELETE /api/herobanner/[id]
 */
export async function DELETE(request, context) {
  try {
    // Attendre les paramètres avant d'y accéder
    const params = await context.params;
    if (!params) {
      return NextResponse.json(
        { message: 'Paramètres invalides' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
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
      // Dans ce cas, simuler une suppression réussie
      return NextResponse.json(
        { message: 'Texte supprimé avec succès', id },
        { status: 200 }
      );
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
        { message: responseData.message || `Erreur lors de la suppression du texte ${id}` },
        { status: response.status }
      );
    }
    
    // Retourner le résultat de la suppression au client
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du texte', details: error.message },
      { status: 500 }
    );
  }
} 