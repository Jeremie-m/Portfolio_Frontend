import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const projectId = formData.get('projectId');

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximale : 10MB' },
        { status: 400 }
      );
    }

    try {
      // Convertir le fichier en buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Traiter l'image avec sharp
      const processedBuffer = await sharp(buffer)
        // Redimensionner à 1024x720
        .resize(1024, 720, {
          fit: 'cover', // Couvre toute la zone
          position: 'center' // Centre l'image
        })
        // Convertir en WebP avec une bonne qualité
        .webp({
          quality: 80, // Bon compromis qualité/taille
          effort: 6,   // Niveau de compression (0-6)
        })
        .toBuffer();

      // Générer un nom de fichier unique
      const fileName = `${projectId}_${Date.now()}.webp`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'projects', fileName);

      // S'assurer que le dossier existe
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Sauvegarder l'image
      await fs.writeFile(filePath, processedBuffer);

      // Log des informations pour le développement
      console.log('Nouvelle image de projet traitée :', {
        projectId,
        fileName,
        filePath,
        originalSize: file.size,
        mimeType: file.type,
        dimensions: '1024x720',
        format: 'WebP'
      });

      return NextResponse.json({
        success: true,
        imageUrl: `/images/projects/${fileName}`
      });

    } catch (processingError) {
      console.error('Erreur lors du traitement de l\'image:', processingError);
      return NextResponse.json(
        { error: 'Erreur lors du traitement de l\'image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l\'upload' },
      { status: 500 }
    );
  }
}
