import { NextResponse } from 'next/server';
import { admin } from '@/features/auth/mocks/admin';

// Fonctions de sécurité pour prévenir les attaques XSS et SQLi

// Sanitizer pour nettoyer les entrées utilisateur
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Échapper les caractères spéciaux HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

// Valider le format d'email
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email);
};

// Détecter les tentatives d'injection SQL
const hasSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION)(\s|$)/i,
    /['";](\s|\d)*(\s|$)/,
    /--(\s|$)/,
    /\/\*.*\*\//,
    /xp_/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// POST /api/auth/login - Authentifier un utilisateur
export async function POST(request) {
  try {
    // Limiter la taille de la requête pour éviter les attaques DoS
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1000) {
      return NextResponse.json(
        { error: 'Requête trop volumineuse' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const email = body.email;
    const password = body.password;
    
    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Les champs email et password sont requis' },
        { status: 400 }
      );
    }
    
    // Vérification du format de l'email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Détection d'injection SQL
    if (hasSQLInjection(email) || hasSQLInjection(password)) {
      // Enregistrer la tentative d'attaque dans les logs (dans un environnement de production)
      console.warn(`Tentative d'injection SQL détectée: ${email}`);
      
      return NextResponse.json(
        { error: 'Données non valides' },
        { status: 400 }
      );
    }
    
    // Sanitiser les entrées
    const sanitizedEmail = sanitizeInput(email);
    
    // Vérification avec les données du mock
    // Note: En production, utilisez une comparaison sécurisée comme bcrypt.compare
    if (sanitizedEmail === admin.email && password === admin.password) {
      // Simuler la création d'un token JWT avec une expiration
      const token = `mock_jwt_token_${Date.now()}`;
      const expiresIn = 3600; // 1 heure en secondes
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Authentification réussie',
          user: { email: admin.email, role: 'admin' },
          token,
          expiresIn
        },
        { 
          status: 200,
          headers: {
            // Définir un cookie HttpOnly pour le token, avec expiration et autres paramètres de sécurité
            'Set-Cookie': `auth=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${expiresIn}; Secure`
          }
        }
      );
    } else {
      // Utiliser un temps de réponse constant pour éviter les attaques timing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'authentification' },
      { status: 500 }
    );
  }
} 