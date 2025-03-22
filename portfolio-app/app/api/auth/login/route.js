import { NextResponse } from 'next/server';
import { admin } from '@/features/auth/mocks/admin';

// POST /api/auth/login - Authentifier un utilisateur
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Les champs email et password sont requis' },
        { status: 400 }
      );
    }
    
    // Vérification avec les données du mock
    if (email === admin.email && password === admin.password) {
      // Simuler la création d'un token JWT
      const token = 'mock_jwt_token';
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Authentification réussie',
          user: { email: admin.email, role: 'admin' },
          token 
        },
        { 
          status: 200,
          headers: {
            'Set-Cookie': `auth=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
          }
        }
      );
    } else {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'authentification' },
      { status: 500 }
    );
  }
} 