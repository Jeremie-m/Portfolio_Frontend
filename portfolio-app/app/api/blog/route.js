import { NextResponse } from 'next/server';
import { blogPosts } from '../../../mocks/blog';

// GET /api/blog - Récupérer tous les articles de blog
export async function GET(request) {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(blogPosts);
}

// POST /api/blog - Ajouter un nouvel article de blog (protégé par authentification)
export async function POST(request) {
  try {
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    
    // Validation des données
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Les champs title et content sont requis' },
        { status: 400 }
      );
    }
    
    // Simuler l'ajout d'un nouvel article
    const newPost = {
      id: blogPosts.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous ajouterions l'article à la base de données
    // blogPosts.push(newPost);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    );
  }
} 