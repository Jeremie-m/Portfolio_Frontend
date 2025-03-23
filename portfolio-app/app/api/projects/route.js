import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { projects as mockProjects } from '../../../features/projects/mocks/projects';

// GET /api/projects - Récupérer tous les projets
export async function GET(request) {
  try {
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log('Mode mock activé pour la récupération des projets');
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return NextResponse.json(mockProjects);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Récupération des projets depuis le backend: ${apiUrl}/projects`);
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter les éventuels headers d'authentification si nécessaire
          ...(request.headers.get('Cookie') ? { Cookie: request.headers.get('Cookie') } : {})
        },
        // Transmettre les credentials si nécessaire pour les cookies
        credentials: 'include',
      });
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        const projects = await backendResponse.json();
        return NextResponse.json(projects);
      } else {
        // Récupérer les données d'erreur
        const errorData = await backendResponse.json().catch(() => ({}));
        
        console.error('Erreur lors de la récupération des projets:', errorData);
        
        // En cas d'erreur backend, utiliser les mocks en fallback
        if (backendResponse.status === 404) {
          console.log('Backend indisponible, utilisation des données mockées en fallback');
          return NextResponse.json(mockProjects);
        }
        
        // Sinon, retourner l'erreur
        return NextResponse.json(
          { error: errorData.error || 'Erreur lors de la récupération des projets' },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    
    // En cas d'erreur de connexion, utiliser les mocks en fallback
    console.log('Erreur de connexion, utilisation des données mockées en fallback');
    return NextResponse.json(mockProjects);
  }
}

// POST /api/projects - Ajouter un nouveau projet (protégé par authentification)
export async function POST(request) {
  try {
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    const data = await request.json();
    
    // Validation des données de base
    if (!data.title || !data.description || !data.technologies) {
      return NextResponse.json(
        { error: 'Les champs title, description et technologies sont requis' },
        { status: 400 }
      );
    }
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log('Mode mock activé pour la création de projet');
      
      // Simuler l'ajout d'un nouveau projet
      const newProject = {
        id: mockProjects.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Dans une vraie application, nous ajouterions le projet à la base de données
      // projects.push(newProject);
      
      return NextResponse.json(newProject, { status: 201 });
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Création d'un projet via le backend: ${apiUrl}/projects`);
      
      // Récupérer le token d'authentification depuis les cookies
      const authCookie = request.headers.get('Cookie');
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
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
        return NextResponse.json(responseData, { status: backendResponse.status });
      } else {
        return NextResponse.json(
          { error: responseData.error || 'Erreur lors de la création du projet' },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet', details: error.message },
      { status: 500 }
    );
  }
} 