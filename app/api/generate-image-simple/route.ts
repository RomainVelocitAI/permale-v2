import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { createUploadService } from '@/lib/upload-service';
import { getBaseUrl } from '@/lib/config';

// API simplifiée qui retourne immédiatement et génère en arrière-plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projet, projetId } = body;
    
    if (!projet || !projetId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Lancer la génération en arrière-plan sans attendre
    generateImagesInBackground(projet, projetId).catch(error => {
      console.error('[generate-image-simple] Erreur background:', error);
    });

    // Retourner immédiatement
    return NextResponse.json({
      success: true,
      message: 'Génération d\'images lancée',
      projetId
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du lancement' },
      { status: 500 }
    );
  }
}

// Fonction qui génère les images en arrière-plan
async function generateImagesInBackground(projet: any, projetId: string) {
  console.log('[Background] Début génération pour:', projetId);
  console.log('[Background] Projet data:', JSON.stringify(projet));
  
  const uploadService = createUploadService();
  const publicUrls: string[] = [];
  
  // Générer 4 images séquentiellement
  for (let i = 0; i < 4; i++) {
    try {
      console.log(`[Background] Génération image ${i + 1}/4...`);
      console.log('[Background] Appel GPTImageJewelryServiceV2.generateJewelryImage...');
      
      // Générer l'image
      const result = await GPTImageJewelryServiceV2.generateJewelryImage(projet, {
        quality: 'standard',
        returnBase64: false
      });
      
      console.log('[Background] Image générée, URL:', result.imageUrl);
      
      // Télécharger et convertir
      console.log('[Background] Téléchargement de l\'image...');
      const response = await fetch(result.imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log('[Background] Image téléchargée, taille:', buffer.length);
      
      // Upload vers GitHub
      const signature = buffer.slice(0, 8).toString('hex');
      const isPNG = signature === '89504e470d0a1a0a';
      const mimeType = isPNG ? 'image/png' : 'image/jpeg';
      const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
      
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filename = `projet-${projetId}-image-${i + 1}-${randomSuffix}.${isPNG ? 'png' : 'jpg'}`;
      
      console.log('[Background] Upload vers GitHub, filename:', filename);
      const publicUrl = await uploadService.uploadImage(base64, filename);
      
      publicUrls.push(publicUrl);
      console.log(`[Background] Image ${i + 1} uploadée avec succès:`, publicUrl);
      
    } catch (error) {
      console.error(`[Background] Erreur détaillée image ${i + 1}:`, error);
      console.error(`[Background] Stack trace:`, error instanceof Error ? error.stack : 'N/A');
    }
  }
  
  // Mettre à jour Airtable
  if (publicUrls.length > 0) {
    try {
      const updateResponse = await fetch(`${getBaseUrl()}/api/projets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projetId,
          images: publicUrls.map((url, index) => ({
            url: url,
            filename: `visualisation-ia-${index + 1}.png`
          }))
        }),
      });
      
      if (updateResponse.ok) {
        console.log('[Background] Airtable mis à jour avec succès');
      }
    } catch (error) {
      console.error('[Background] Erreur mise à jour Airtable:', error);
    }
  }
  
  console.log('[Background] Génération terminée, images:', publicUrls.length);
}