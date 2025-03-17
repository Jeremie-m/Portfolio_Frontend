import { NextResponse } from 'next/server';
import multer from 'multer';
import sharp from 'sharp';
import potrace from 'potrace';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Formats acceptés : PNG, JPG, SVG, WEBP'));
    }
  }
});

// Fonction pour convertir une image en SVG
const convertToSVG = async (buffer) => {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, {
      turdSize: 2,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      alphaMax: 1,
      optCurve: true
    }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });
};

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

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Redimensionner l'image à 64x64
    const resizedBuffer = await sharp(buffer)
      .resize(64, 64, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    // Convertir en SVG
    const svg = await convertToSVG(resizedBuffer);

    // Générer un nom de fichier unique
    const fileName = `${skillId}_${Date.now()}.svg`;
    const filePath = path.join(process.cwd(), 'public', 'images', 'skills', fileName);

    // Sauvegarder le SVG
    await fs.writeFile(filePath, svg);

    // Log des informations pour le mode mock
    console.log('Nouvelle image traitée :', {
      skillId,
      fileName,
      filePath,
      originalSize: file.size,
      mimeType: file.type,
      dimensions: '64x64',
      format: 'SVG'
    });

    return NextResponse.json({
      success: true,
      imageUrl: `/images/skills/${fileName}`
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l\'upload' },
      { status: 500 }
    );
  }
} 