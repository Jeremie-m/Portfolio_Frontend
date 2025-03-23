import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { skills as mockSkills } from '../../../../features/skills/mocks/skills';

// GET /api/skills/:id - Récupérer une skill spécifique
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la récupération de la compétence ${id}`);
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const skill = mockSkills.find(s => s.id === parseInt(id));
      
      if (!skill) {
        return NextResponse.json(
          { error: 'Compétence non trouvée' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(skill);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Récupération de la compétence ${id} depuis le backend: ${apiUrl}/skills/${id}`);
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/skills/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter les éventuels headers d'authentification si nécessaire
          ...(request.headers.get('Cookie') ? { Cookie: request.headers.get('Cookie') } : {})
        },
        credentials: 'include',
      });
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        const skill = await backendResponse.json();
        return NextResponse.json(skill);
      } else {
        // Récupérer les données d'erreur
        const errorData = await backendResponse.json().catch(() => ({}));
        
        console.error(`Erreur lors de la récupération de la compétence ${id}:`, errorData);
        
        // Si la compétence n'est pas trouvée
        if (backendResponse.status === 404) {
          // En mode de développement, on peut essayer de récupérer la compétence depuis les mocks
          if (process.env.NODE_ENV === 'development') {
            console.log(`Compétence ${id} non trouvée dans le backend, recherche dans les mocks`);
            const mockSkill = mockSkills.find(s => s.id === parseInt(id));
            
            if (mockSkill) {
              console.log(`Compétence ${id} trouvée dans les mocks`);
              return NextResponse.json(mockSkill);
            }
          }
          
          // Sinon, retourner l'erreur 404
          return NextResponse.json(
            { error: errorData.error || 'Compétence non trouvée' },
            { status: 404 }
          );
        }
        
        // Pour les autres erreurs
        return NextResponse.json(
          { error: errorData.error || `Erreur lors de la récupération de la compétence ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de la compétence ${params.id}:`, error);
    
    // En cas d'erreur de connexion, essayer les mocks
    if (process.env.NODE_ENV === 'development') {
      console.log(`Erreur lors de la connexion au backend, recherche dans les mocks pour la compétence ${params.id}`);
      const mockSkill = mockSkills.find(s => s.id === parseInt(params.id));
      
      if (mockSkill) {
        console.log(`Compétence ${params.id} trouvée dans les mocks`);
        return NextResponse.json(mockSkill);
      }
    }
    
    return NextResponse.json(
      { error: `Erreur lors de la récupération de la compétence ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/skills/:id - Mettre à jour une skill existante (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    const data = await request.json();
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la mise à jour de la compétence ${id}`);
      
      const skillIndex = mockSkills.findIndex(s => s.id === parseInt(id));
      
      if (skillIndex === -1) {
        return NextResponse.json(
          { error: 'Compétence non trouvée' },
          { status: 404 }
        );
      }
      
      // Simuler la mise à jour d'une compétence
      const updatedSkill = {
        ...mockSkills[skillIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      // Dans une vraie application, nous mettrions à jour la compétence dans la base de données
      // skills[skillIndex] = updatedSkill;
      
      return NextResponse.json(updatedSkill);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Mise à jour de la compétence ${id} via le backend: ${apiUrl}/skills/${id}`);
      
      // Récupérer le token d'authentification depuis les cookies
      const authCookie = request.headers.get('Cookie');
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter les headers d'authentification
          ...(authCookie ? { Cookie: authCookie } : {})
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      // Récupérer les données de la réponse
      const responseData = await backendResponse.json();
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        return NextResponse.json(responseData);
      } else {
        return NextResponse.json(
          { error: responseData.error || `Erreur lors de la mise à jour de la compétence ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la compétence ${params.id}:`, error);
    
    return NextResponse.json(
      { error: `Erreur lors de la mise à jour de la compétence ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/:id - Supprimer une skill (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la suppression de la compétence ${id}`);
      
      const skillIndex = mockSkills.findIndex(s => s.id === parseInt(id));
      
      if (skillIndex === -1) {
        return NextResponse.json(
          { error: 'Compétence non trouvée' },
          { status: 404 }
        );
      }
      
      // Dans une vraie application, nous supprimerions la compétence de la base de données
      // skills.splice(skillIndex, 1);
      
      return NextResponse.json(
        { message: 'Compétence supprimée avec succès' },
        { status: 200 }
      );
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Suppression de la compétence ${id} via le backend: ${apiUrl}/skills/${id}`);
      
      // Récupérer le token d'authentification depuis les cookies
      const authCookie = request.headers.get('Cookie');
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter les headers d'authentification
          ...(authCookie ? { Cookie: authCookie } : {})
        },
        credentials: 'include',
      });
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        // Si la réponse ne contient pas de corps JSON, retourner un message standard
        if (backendResponse.headers.get('content-length') === '0') {
          return NextResponse.json(
            { message: 'Compétence supprimée avec succès' },
            { status: 200 }
          );
        }
        
        // Sinon, utiliser la réponse du backend
        const responseData = await backendResponse.json();
        return NextResponse.json(responseData);
      } else {
        // Récupérer les données d'erreur si possible
        const errorData = await backendResponse.json().catch(() => ({}));
        
        return NextResponse.json(
          { error: errorData.error || `Erreur lors de la suppression de la compétence ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la compétence ${params.id}:`, error);
    
    return NextResponse.json(
      { error: `Erreur lors de la suppression de la compétence ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
} 