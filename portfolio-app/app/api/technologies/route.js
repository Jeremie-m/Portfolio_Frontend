import { NextResponse } from 'next/server';
import { technologies } from '../../../mocks/technologies';

// GET /api/technologies - Récupérer toutes les technologies
export async function GET(request) {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(technologies);
}

// POST /api/technologies - Ajouter une nouvelle technologie (protégé par authentification)
export async function POST(request) {
  try {
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    
    // Validation des données
    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: 'Les champs name et category sont requis' },
        { status: 400 }
      );
    }
    
    // Simuler l'ajout d'une nouvelle technologie
    const newTechnology = {
      id: technologies.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous ajouterions la technologie à la base de données
    // technologies.push(newTechnology);
    
    return NextResponse.json(newTechnology, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la technologie' },
      { status: 500 }
    );
  }
} 