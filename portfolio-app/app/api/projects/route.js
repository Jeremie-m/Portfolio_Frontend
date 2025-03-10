import { NextResponse } from 'next/server';
import { projects } from '../../../mocks/projects';

// GET /api/projects - Récupérer tous les projets
export async function GET(request) {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(projects);
}

// POST /api/projects - Ajouter un nouveau projet (protégé par authentification)
export async function POST(request) {
  try {
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    
    // Validation des données
    if (!data.title || !data.description || !data.technologies) {
      return NextResponse.json(
        { error: 'Les champs title, description et technologies sont requis' },
        { status: 400 }
      );
    }
    
    // Simuler l'ajout d'un nouveau projet
    const newProject = {
      id: projects.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous ajouterions le projet à la base de données
    // projects.push(newProject);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet' },
      { status: 500 }
    );
  }
} 