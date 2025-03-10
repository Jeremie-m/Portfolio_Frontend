import { NextResponse } from 'next/server';

// POST /api/auth/login - Authentifier un utilisateur
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Validation des données
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Les champs username et password sont requis' },
        { status: 400 }
      );
    }
    
    // Dans une vraie application, nous vérifierions les identifiants dans la base de données
    // Pour le mock, nous acceptons seulement admin/password
    if (username === 'admin' && password === 'password') {
      // Simuler la création d'un token JWT
      const token = 'mock_jwt_token';
      
      // Dans une vraie application, nous utiliserions un cookie sécurisé
      return NextResponse.json(
        { 
          success: true, 
          message: 'Authentification réussie',
          user: { username: 'admin', role: 'admin' },
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
        { error: 'Identifiants invalides' },
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