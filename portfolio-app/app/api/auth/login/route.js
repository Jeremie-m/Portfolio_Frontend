import { NextResponse } from 'next/server';
import { admin } from '@/features/auth/mocks/admin';
import { sign } from 'jsonwebtoken';

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
      // Mode mock (pour développement sans backend)
      if (email === admin.email && password === admin.password) {
        // Créer un vrai token JWT pour le mock
        const token = sign(
          { 
            sub: admin.email,
            role: 'admin',
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expire dans 1 heure
          },
          process.env.JWT_SECRET || 'mock-secret'
        );
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'Authentification réussie',
            user: { email: admin.email, role: 'admin' },
            token
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }
    } else {
      // Mode réel (connexion au backend)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }

      const backendResponse = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const backendData = await backendResponse.json();
      
      if (backendResponse.ok) {
        return NextResponse.json({ 
          success: true, 
          message: backendData.message || 'Authentification réussie',
          user: backendData.user,
          token: backendData.access_token
        }, { 
          status: 200 
        });
      } else {
        return NextResponse.json(
          { error: backendData.error || 'Erreur d\'authentification' },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'authentification' },
      { status: 500 }
    );
  }
} 