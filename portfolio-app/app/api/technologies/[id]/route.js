import { NextResponse } from 'next/server';
import { technologies } from '../../../../mocks/skills';

// GET /api/technologies/:id - Récupérer une technologie spécifique
export async function GET(request, { params }) {
  const { id } = params;
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const technology = technologies.find(t => t.id === parseInt(id));
  
  if (!technology) {
    return NextResponse.json(
      { error: 'Technologie non trouvée' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(technology);
}

// PUT /api/technologies/:id - Mettre à jour une technologie existante (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    const technologyIndex = technologies.findIndex(t => t.id === parseInt(id));
    
    if (technologyIndex === -1) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Simuler la mise à jour d'une technologie
    const updatedTechnology = {
      ...technologies[technologyIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous mettrions à jour la technologie dans la base de données
    // technologies[technologyIndex] = updatedTechnology;
    
    return NextResponse.json(updatedTechnology);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la technologie' },
      { status: 500 }
    );
  }
}

// DELETE /api/technologies/:id - Supprimer une technologie (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const technologyIndex = technologies.findIndex(t => t.id === parseInt(id));
    
    if (technologyIndex === -1) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Dans une vraie application, nous supprimerions la technologie de la base de données
    // technologies.splice(technologyIndex, 1);
    
    return NextResponse.json(
      { message: 'Technologie supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la technologie' },
      { status: 500 }
    );
  }
} 