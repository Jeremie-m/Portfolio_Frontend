import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { projects as mockProjects } from '../../../../features/projects/mocks/projects';

// GET /api/projects/:id - Récupérer un projet spécifique
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la récupération du projet ${id}`);
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const project = mockProjects.find(p => p.id === parseInt(id));
      
      if (!project) {
        return NextResponse.json(
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(project);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Récupération du projet ${id} depuis le backend: ${apiUrl}/projects/${id}`);
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects/${id}`, {
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
        const project = await backendResponse.json();
        return NextResponse.json(project);
      } else {
        // Récupérer les données d'erreur
        const errorData = await backendResponse.json().catch(() => ({}));
        
        console.error(`Erreur lors de la récupération du projet ${id}:`, errorData);
        
        // Si le projet n'est pas trouvé
        if (backendResponse.status === 404) {
          // En mode de développement, on peut essayer de récupérer le projet depuis les mocks
          if (process.env.NODE_ENV === 'development') {
            console.log(`Projet ${id} non trouvé dans le backend, recherche dans les mocks`);
            const mockProject = mockProjects.find(p => p.id === parseInt(id));
            
            if (mockProject) {
              console.log(`Projet ${id} trouvé dans les mocks`);
              return NextResponse.json(mockProject);
            }
          }
          
          // Sinon, retourner l'erreur 404
          return NextResponse.json(
            { error: errorData.error || 'Projet non trouvé' },
            { status: 404 }
          );
        }
        
        // Pour les autres erreurs
        return NextResponse.json(
          { error: errorData.error || `Erreur lors de la récupération du projet ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet ${params.id}:`, error);
    
    // En cas d'erreur de connexion, essayer les mocks
    if (process.env.NODE_ENV === 'development') {
      console.log(`Erreur lors de la connexion au backend, recherche dans les mocks pour le projet ${params.id}`);
      const mockProject = mockProjects.find(p => p.id === parseInt(params.id));
      
      if (mockProject) {
        console.log(`Projet ${params.id} trouvé dans les mocks`);
        return NextResponse.json(mockProject);
      }
    }
    
    return NextResponse.json(
      { error: `Erreur lors de la récupération du projet ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/:id - Mettre à jour un projet existant (protégé par authentification)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    const data = await request.json();
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la mise à jour du projet ${id}`);
      
      const projectIndex = mockProjects.findIndex(p => p.id === parseInt(id));
      
      if (projectIndex === -1) {
        return NextResponse.json(
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }
      
      // Simuler la mise à jour d'un projet
      const updatedProject = {
        ...mockProjects[projectIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      // Dans une vraie application, nous mettrions à jour le projet dans la base de données
      // projects[projectIndex] = updatedProject;
      
      return NextResponse.json(updatedProject);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Mise à jour du projet ${id} via le backend: ${apiUrl}/projects/${id}`);
      
      // Récupérer le token d'authentification depuis les cookies
      const authCookie = request.headers.get('Cookie');
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects/${id}`, {
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
          { error: responseData.error || `Erreur lors de la mise à jour du projet ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du projet ${params.id}:`, error);
    
    return NextResponse.json(
      { error: `Erreur lors de la mise à jour du projet ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/:id - Supprimer un projet (protégé par authentification)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Vérifier si on doit utiliser les mocks ou le backend réel
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // ---------- MODE MOCK (pour développement sans backend) ----------
      console.log(`Mode mock activé pour la suppression du projet ${id}`);
      
      const projectIndex = mockProjects.findIndex(p => p.id === parseInt(id));
      
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
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      // Récupérer l'URL de l'API depuis les variables d'environnement
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      console.log(`Suppression du projet ${id} via le backend: ${apiUrl}/projects/${id}`);
      
      // Récupérer le token d'authentification depuis les cookies
      const authCookie = request.headers.get('Cookie');
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects/${id}`, {
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
            { message: 'Projet supprimé avec succès' },
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
          { error: errorData.error || `Erreur lors de la suppression du projet ${id}` },
          { status: backendResponse.status }
        );
      }
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du projet ${params.id}:`, error);
    
    return NextResponse.json(
      { error: `Erreur lors de la suppression du projet ${params.id}`, details: error.message },
      { status: 500 }
    );
  }
} 