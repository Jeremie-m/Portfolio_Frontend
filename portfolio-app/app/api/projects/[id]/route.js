import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { projects as mockProjects } from '../../../../features/projects/mocks/projects';
import path from 'path';
import fs from 'fs/promises';

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
          'Authorization': request.headers.get('Authorization')
        }
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
    const { id } = await params;
    
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
      
      // Si l'image a changé, supprimer l'ancienne image
      const oldImageUrl = mockProjects[projectIndex].image_url;
      if (data.image_url && data.image_url !== oldImageUrl && !oldImageUrl.includes('default')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', oldImageUrl);
          await fs.unlink(oldImagePath);
          console.log(`Ancienne image supprimée: ${oldImagePath}`);
        } catch (err) {
          console.error('Erreur lors de la suppression de l\'ancienne image:', err);
          // Continuer même si la suppression échoue
        }
      }
      
      // Simuler la mise à jour d'un projet
      const updatedProject = {
        ...mockProjects[projectIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      return NextResponse.json(updatedProject);
    } else {
      // ---------- MODE RÉEL (connexion au backend) ----------
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('La variable d\'environnement NEXT_PUBLIC_API_URL n\'est pas définie');
      }
      
      // Récupérer le header d'autorisation
      const authHeader = request.headers.get('Authorization');
      console.log('Token reçu du frontend:', authHeader); // Debug
      
      if (!authHeader) {
        return NextResponse.json(
          { error: 'Token d\'authentification manquant' },
          { status: 401 }
        );
      }
      
      // Récupérer d'abord le projet actuel pour avoir l'ancienne URL d'image
      const currentProjectResponse = await fetch(`${apiUrl}/projects/${id}`, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      if (currentProjectResponse.ok) {
        const currentProject = await currentProjectResponse.json();
        
        // Si l'image a changé, supprimer l'ancienne image
        if (data.image_url && data.image_url !== currentProject.image_url && !currentProject.image_url.includes('default')) {
          try {
            const oldImagePath = path.join(process.cwd(), 'public', currentProject.image_url);
            await fs.unlink(oldImagePath);
            console.log(`Ancienne image supprimée: ${oldImagePath}`);
          } catch (err) {
            console.error('Erreur lors de la suppression de l\'ancienne image:', err);
            // Continuer même si la suppression échoue
          }
        }
      }
      
      console.log(`Mise à jour du projet ${id} via le backend: ${apiUrl}/projects/${id}`);
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(data),
      });
      
      console.log('Status backend:', backendResponse.status); // Debug
      
      // Récupérer les données de la réponse
      const responseData = await backendResponse.json();
      console.log('Réponse backend:', responseData); // Debug
      
      // Vérifier si la requête a réussi
      if (backendResponse.ok) {
        return NextResponse.json(responseData);
      } else {
        return NextResponse.json(
          { error: responseData.error || responseData.message || `Erreur lors de la mise à jour du projet ${id}` },
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
      
      // Effectuer la requête au backend
      const backendResponse = await fetch(`${apiUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization')
        }
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