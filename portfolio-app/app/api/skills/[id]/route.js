import { NextResponse } from 'next/server';
// Import des mocks pour le mode fallback
import { skills as mockSkills } from '../../../../features/skills/mocks/skills';
import { promises as fs } from 'fs';
import path from 'path';

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
export async function PUT(request, context) {
  try {
    // Attendre les paramètres avant d'y accéder
    const params = await context.params;
    if (!params) {
      return NextResponse.json(
        { message: 'Paramètres invalides' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID de la compétence requis' },
        { status: 400 }
      );
    }
    
    // Récupérer le token depuis l'en-tête Authorization de la requête entrante
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader) {
      // Si l'en-tête est au format "Bearer <token>"
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Sinon utiliser directement la valeur
        token = authHeader;
      }
    } else {
      // Aucun token trouvé
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Récupération du corps de la requête
    const body = await request.json();
    
    // Utilisation de l'URL spécifique du backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const endpoint = `${apiUrl}/skills/${id}`;
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (useMockApi) {
      // Dans ce cas, simuler une mise à jour réussie
      const updatedItem = {
        ...body,
        id,
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json(updatedItem, { status: 200 });
    }
    
    // En mode normal, appel au backend avec le token d'authentification
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
      cache: 'no-store'
    });
    
    // Essayer de récupérer les données de la réponse
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { message: 'Impossible de lire la réponse du serveur' };
    }
    
    // Si le backend n'est pas disponible ou renvoie une erreur
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { message: 'Votre session a expiré. Veuillez vous reconnecter.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: responseData.message || `Erreur lors de la mise à jour de la compétence ${id}` },
        { status: response.status }
      );
    }
    
    // Retourner l'élément mis à jour au client
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la compétence', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/:id - Supprimer une skill (protégé par authentification)
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    if (!params) {
      return NextResponse.json(
        { message: 'Paramètres invalides' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID du texte requis' },
        { status: 400 }
      );
    }
    
    // Récupérer le token depuis l'en-tête Authorization de la requête entrante
    const authHeader = request.headers.get('Authorization');
    let token;
    
    if (authHeader) {
      // Si l'en-tête est au format "Bearer <token>"
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Sinon utiliser directement la valeur
        token = authHeader;
      }
    } else {
      // Aucun token trouvé
      return NextResponse.json(
        { message: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      );
    }
    
    // Mode development/fallback
    const useMockApi = process.env.USE_MOCK_API === 'true';
    
    if (!useMockApi) {
      // Appel API réel
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const endpoint = `${apiUrl}/skills/${id}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      };
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: headers,
        cache: 'no-store'
      });

      if (!response.ok) {
        // ... gestion des erreurs ...
        return NextResponse.json(
          { message: 'Erreur lors de la suppression' },
          { status: response.status }
        );
      }
    }

    try {
      // Rechercher et supprimer le fichier d'image correspondant
      const skillsDirectory = path.join(process.cwd(), 'public', 'images', 'skills');
      const files = await fs.readdir(skillsDirectory);
      
      // Chercher tous les fichiers commençant par l'ID de la skill
      const skillFiles = files.filter(file => file.startsWith(`${id}_`));
      
      // Supprimer chaque fichier trouvé
      for (const file of skillFiles) {
        const filePath = path.join(skillsDirectory, file);
        try {
          await fs.unlink(filePath);
          console.log(`Fichier supprimé: ${filePath}`);
        } catch (err) {
          console.error(`Erreur lors de la suppression du fichier ${filePath}:`, err);
          // On continue même si la suppression du fichier échoue
        }
      }
    } catch (err) {
      console.error('Erreur lors de la suppression des fichiers:', err);
      // On continue même si la suppression des fichiers échoue
    }

    return NextResponse.json(
      { message: 'Compétence et fichiers associés supprimés avec succès', id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression', details: error.message },
      { status: 500 }
    );
  }
}  