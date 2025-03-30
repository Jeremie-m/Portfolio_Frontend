import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback si la connexion au backend échoue
import { admin } from '@/features/auth/mocks/admin';


// POST /api/auth/login - Authentifier un utilisateur
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validation des données de base
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Les champs email et password sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log('Mode mock activé pour l\'authentification');
      
      // Vérification avec les données du mock
      if (email === admin.email && password === admin.password) {
        // Simuler la création d'un token JWT
        const token = 'mock_jwt_token';
        
        // Débogage - afficher le token qui sera renvoyé
        console.log('Debug - Mode mock - Token généré:', token);
        
        // Pour sessionStorage, on envoie uniquement dans le corps (pas de cookie HttpOnly)
        return NextResponse.json(
          { 
            success: true, 
            message: 'Authentification réussie (mock)',
            user: { email: admin.email, role: 'admin' },
            token // Le token sera stocké dans sessionStorage côté client
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect (mock)' },
          { status: 401 }
        );
      }
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Tentative de connexion au backend: ${apiUrl}/auth/login`);
      
      // Transférer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Récupérer les données de la réponse
      const backendData = await backendResponse.json();
      
      // Débogage - afficher les données reçues du backend
      console.log('Debug - Réponse du backend:', {
        status: backendResponse.status,
        hasToken: !!backendData.access_token,
        token: backendData.access_token ? 'Présent (non affiché pour sécurité)' : 'Absent',
        data: backendData
      });
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        // Utiliser le access_token du backend s'il existe, sinon générer un token de secours
        const token = backendData.access_token || generateFallbackToken(backendData.user || { email });
        
        // Débogage - afficher le token utilisé
        console.log('Debug - Token utilisé:', token.substring(0, 10) + '...');
        
        // Créer une réponse avec le même format que ce que le frontend attend
        const responseData = { 
          success: true, 
          message: backendData.message || 'Authentification réussie',
          user: backendData.user || { email, role: 'admin' }, // Utiliser les données du backend ou créer un utilisateur minimal
          token // Utiliser le token backend ou notre token de secours
        };
        
        // Vérification du token dans la réponse finale
        console.log('Debug - Réponse finale envoyée au frontend:', {
          hasToken: !!responseData.token,
          tokenType: responseData.token ? typeof responseData.token : 'undefined',
          isBackendToken: !!backendData.access_token
        });
        
        // Retourner la réponse avec uniquement le corps (pas de cookie)
        // Le frontend sera responsable de stocker le token dans sessionStorage
        return NextResponse.json(responseData, { status: backendResponse.status });
      } else {
        // En cas d'erreur, transmettre le message d'erreur du backend
        return NextResponse.json(
          { error: backendData.error || 'Erreur d\'authentification' },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'authentification', details: error.message },
      { status: 500 }
    );
  }
} 