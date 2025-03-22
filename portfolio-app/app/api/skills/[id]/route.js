import { NextResponse } from 'next/server';
import { skills } from '../../../../features/skills/mocks/skills';

// GET /api/skills/:id - Récupérer une skill spécifique
export async function GET(request, { params }) {
  const { id } = params;
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const skill = skills.find(s => s.id === parseInt(id));
  
  if (!skill) {
    return NextResponse.json(
      { error: 'Skill non trouvée' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(skill);
}

// PUT /api/skills/:id - Mettre à jour une skill existante (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const data = await request.json();
    const skillIndex = skills.findIndex(s => s.id === parseInt(id));
    
    if (skillIndex === -1) {
      return NextResponse.json(
        { error: 'Skill non trouvée' },
        { status: 404 }
      );
    }
    
    // Simuler la mise à jour d'une skill
    const updatedSkill = {
      ...skills[skillIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Dans une vraie application, nous mettrions à jour la skill dans la base de données
    // skills[skillIndex] = updatedSkill;
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/:id - Supprimer une skill (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier l'authentification (à implémenter)
    // const isAuthenticated = checkAuthentication(request);
    // if (!isAuthenticated) {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    // }
    
    const skillIndex = skills.findIndex(s => s.id === parseInt(id));
    
    if (skillIndex === -1) {
      return NextResponse.json(
        { error: 'Skill non trouvée' },
        { status: 404 }
      );
    }
    
    // Dans une vraie application, nous supprimerions la skill de la base de données
    // skills.splice(skillIndex, 1);
    
    return NextResponse.json(
      { message: 'Skill supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la skill' },
      { status: 500 }
    );
  }
} 