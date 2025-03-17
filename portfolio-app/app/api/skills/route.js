import { NextResponse } from 'next/server';
import { skills } from '../../../mocks/skills';

// GET /api/skills - Récupérer toutes les skills
export async function GET(request) {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(skills);
}

// POST /api/skills - Ajouter une nouvelle skill (protégé par authentification)
export async function POST(request) {
  try {
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    
    // Validation des données
    if (!data.name) {
      return NextResponse.json(
        { error: 'Le champ name est requis' },
        { status: 400 }
      );
    }
    
    // Simuler l'ajout d'une nouvelle skill
    const newSkill = {
      id: skills.length + 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous ajouterions la skill à la base de données
    // skills.push(newSkill);
    
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la skill' },
      { status: 500 }
    );
  }
} 