import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    const skillId = formData.get('skillId');

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximale : 4MB' },
        { status: 400 }
      );
    }

    try {
      // Convertir le fichier en buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Traiter l'image avec sharp
      const processedBuffer = await sharp(buffer)
        .resize(64, 64, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        // Optimiser l'image
        .png({
          quality: 90,
          compressionLevel: 9,
        })
        .toBuffer();

      // Générer un nom de fichier unique
      const fileName = `${skillId}_${Date.now()}.png`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'skills', fileName);

      // S'assurer que le dossier existe
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Sauvegarder l'image
      await fs.writeFile(filePath, processedBuffer);

      return NextResponse.json({
        success: true,
        imageUrl: `/images/skills/${fileName}`
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