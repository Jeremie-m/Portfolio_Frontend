import { NextResponse } from 'next/server';

// POST /api/auth/logout - Déconnecter un utilisateur
export async function POST() {
  // Dans une vraie application, nous supprimerions le token JWT du cookie
  return NextResponse.json(
    { success: true, message: 'Déconnexion réussie' },
    { 
      status: 200,
      headers: {
        'Set-Cookie': 'auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    }
  );
} 