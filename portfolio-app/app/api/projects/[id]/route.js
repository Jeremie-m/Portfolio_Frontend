import { NextResponse } from 'next/server';
import { projects } from '../../../../mocks/projects';

// GET /api/projects/:id - Récupérer un projet spécifique
export async function GET(request, { params }) {
  const { id } = params;
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const project = projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return NextResponse.json(
      { error: 'Projet non trouvé' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(project);
}

// PUT /api/projects/:id - Mettre à jour un projet existant (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    // Simuler la mise à jour d'un projet
    const updatedProject = {
      ...projects[projectIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous mettrions à jour le projet dans la base de données
    // projects[projectIndex] = updatedProject;
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Supprimer un projet (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    // Dans une vraie application, nous supprimerions le projet de la base de données
    // projects.splice(projectIndex, 1);
    
    return NextResponse.json(
      { message: 'Projet supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
} 