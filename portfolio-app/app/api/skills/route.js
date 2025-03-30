import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { skills as mockSkills } from '../../../features/skills/mocks/skills';

// GET /api/skills - Récupérer toutes les skills
export async function GET(request) {
  try {
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log('Mode mock activé pour la récupération des compétences');
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json(mockSkills);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Récupération des compétences depuis le backend: ${apiUrl}/skills`);
      
      // Récupérer le header d'autorisation
      const authHeader = request.headers.get('Authorization');
      console.log('Token reçu du frontend:', authHeader); // Debug
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/skills`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      });
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        const skills = await backendResponse.json();
        return NextResponse.json(skills);
      } else {
        // Récupérer les données d'erreur
        const errorData = await backendResponse.json().catch(() => ({}));
        
        console.error('Erreur lors de la récupération des compétences:', errorData);
        
        // En cas d'erreur backend, utiliser les mocks en fallback
        if (backendResponse.status === 404) {
          console.log('Backend indisponible, utilisation des données mockées en fallback');
          return NextResponse.json(mockSkills);
        }
        
        // Sinon, retourner l'erreur
        return NextResponse.json(
          { error: errorData.error || 'Erreur lors de la récupération des compétences' },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    
    // En cas d'erreur de connexion, utiliser les mocks en fallback
    console.log('Erreur de connexion, utilisation des données mockées en fallback');
    return NextResponse.json(mockSkills);
  }
}

// POST /api/skills - Ajouter une nouvelle skill
export async function POST(request) {
  try {
    const useMockApi = process.env.USE_MOCK_API === 'true';
    const data = await request.json();

    // Récupérer le token depuis l'en-tête Authorization de la requête entrante
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('Aucun token trouvé dans l\'en-tête Authorization');
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Validation des données de base
    if (!data.name) {
      return NextResponse.json(
        { error: 'Le champ name est requis' },
        { status: 400 }
      );
    }
    
    if (useMockApi) {
      console.log('Mode mock activé pour la création de compétence');
      const newSkill = {
        id: mockSkills.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return NextResponse.json(newSkill, { status: 201 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
    }

    console.log(`Création d'une compétence via le backend: ${apiUrl}/skills`);

    const backendResponse = await fetch(`${apiUrl}/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    });

    // Essayer de récupérer les données de la réponse
    let responseData;
    try {
      responseData = await backendResponse.json();
    } catch (e) {
      responseData = { message: 'Impossible de lire la réponse du serveur' };
    }

    console.log('Réponse du backend:', {
      status: backendResponse.status,
      statusText: backendResponse.statusText
    });
    console.log('Données de la réponse:', responseData);
    
    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return NextResponse.json(
          { message: 'Votre session a expiré. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(responseData, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compétence', details: error.message },
      { status: 500 }
    );
  }
} 