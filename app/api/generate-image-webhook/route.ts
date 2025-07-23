import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { createUploadService } from '@/lib/upload-service';
import { getBaseUrl } from '@/lib/config';

// API webhook pour génération d'images
// Appelée par un service externe (cron, n8n, etc.) ou par elle-même
export async function POST(request: NextRequest) {
  console.log('[Webhook] Début de la génération d\'images');
  
  try {
    const body = await request.json();
    const { projet, projetId } = body;
    
    if (!projet || !projetId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    console.log('[Webhook] Génération pour projet:', projetId);
    
    // Générer une seule image à la fois pour éviter les timeouts
    const imageIndex = body.imageIndex || 0;
    
    if (imageIndex >= 4) {
      console.log('[Webhook] Toutes les images ont été générées');
      return NextResponse.json({
        success: true,
        message: 'Toutes les images ont été générées',
        completed: true
      });
    }
    
    try {
      console.log(`[Webhook] Génération image ${imageIndex + 1}/4...`);
      
      // Générer l'image
      const result = await GPTImageJewelryServiceV2.generateJewelryImage(projet, {
        quality: 'standard',
        returnBase64: false
      });
      
      console.log('[Webhook] Image générée, URL:', result.imageUrl);
      
      // Télécharger et convertir
      const response = await fetch(result.imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload vers GitHub
      const uploadService = createUploadService();
      const signature = buffer.slice(0, 8).toString('hex');
      const isPNG = signature === '89504e470d0a1a0a';
      const mimeType = isPNG ? 'image/png' : 'image/jpeg';
      const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
      
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const filename = `projet-${projetId}-image-${imageIndex + 1}-${randomSuffix}.${isPNG ? 'png' : 'jpg'}`;
      
      console.log('[Webhook] Upload vers GitHub, filename:', filename);
      const publicUrl = await uploadService.uploadImage(base64, filename);
      console.log(`[Webhook] Image ${imageIndex + 1} uploadée:`, publicUrl);
      
      // Mettre à jour Airtable avec cette image
      const updateResponse = await fetch(`${getBaseUrl()}/api/projets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projetId,
          [`imageIA${imageIndex + 1}`]: publicUrl
        }),
      });
      
      if (updateResponse.ok) {
        console.log(`[Webhook] Image ${imageIndex + 1} mise à jour dans Airtable`);
      }
      
      // Appeler le webhook pour l'image suivante
      if (imageIndex < 3) {
        const nextCall = {
          projet,
          projetId,
          imageIndex: imageIndex + 1
        };
        
        // Appel asynchrone pour la prochaine image
        fetch(`${getBaseUrl()}/api/generate-image-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nextCall),
        }).catch(err => {
          console.error('[Webhook] Erreur appel suivant:', err);
        });
      }
      
      return NextResponse.json({
        success: true,
        imageIndex,
        publicUrl,
        nextImage: imageIndex < 3
      });
      
    } catch (error) {
      console.error(`[Webhook] Erreur image ${imageIndex + 1}:`, error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        imageIndex
      });
    }
    
  } catch (error) {
    console.error('[Webhook] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    );
  }
}