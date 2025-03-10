import { NextResponse } from 'next/server';
import { blogPosts } from '../../../../mocks/blog';

// GET /api/blog/:id - Récupérer un article de blog spécifique
export async function GET(request, { params }) {
  const { id } = params;
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const post = blogPosts.find(p => p.id === parseInt(id));
  
  if (!post) {
    return NextResponse.json(
      { error: 'Article non trouvé' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(post);
}

// PUT /api/blog/:id - Mettre à jour un article de blog existant (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    const postIndex = blogPosts.findIndex(p => p.id === parseInt(id));
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    // Simuler la mise à jour d'un article
    const updatedPost = {
      ...blogPosts[postIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous mettrions à jour l'article dans la base de données
    // blogPosts[postIndex] = updatedPost;
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/:id - Supprimer un article de blog (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const postIndex = blogPosts.findIndex(p => p.id === parseInt(id));
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    // Dans une vraie application, nous supprimerions l'article de la base de données
    // blogPosts.splice(postIndex, 1);
    
    return NextResponse.json(
      { message: 'Article supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
} 