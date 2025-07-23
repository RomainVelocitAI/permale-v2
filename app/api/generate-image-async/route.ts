import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { createUploadService } from '@/lib/upload-service';
import { updateProjet } from '@/lib/airtable';

// Cette API génère les images de manière asynchrone
// Elle est appelée par un webhook n8n ou un cron job
export async function POST(request: NextRequest) {
  console.log('[API generate-image-async] Début de la génération asynchrone');
  
  try {
    const body = await request.json();
    const { projetId, projet } = body;
    
    if (!projetId || !projet) {
      return NextResponse.json(
        { error: 'Projet ID et données requises' },
        { status: 400 }
      );
    }

    console.log('[API generate-image-async] Génération pour projet:', projetId);
    
    // Générer 4 images une par une pour éviter la surcharge
    const uploadService = createUploadService();
    const publicUrls: string[] = [];
    
    for (let i = 0; i < 4; i++) {
      try {
        console.log(`[API generate-image-async] Génération image ${i + 1}/4...`);
        
        // Générer une image
        const result = await GPTImageJewelryServiceV2.generateJewelryImage(projet, {
          quality: 'standard',
          returnBase64: false
        });
        
        // Télécharger et convertir l'image
        const response = await fetch(result.imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Vérifier la signature de l'image
        const signature = buffer.slice(0, 8).toString('hex');
        const isPNG = signature === '89504e470d0a1a0a';
        const mimeType = isPNG ? 'image/png' : 'image/jpeg';
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        
        // Upload vers GitHub
        const uniqueId = projetId;
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = `projet-${uniqueId}-image-${i + 1}-${randomSuffix}.${isPNG ? 'png' : 'jpg'}`;
        const publicUrl = await uploadService.uploadImage(base64, filename);
        
        publicUrls.push(publicUrl);
        console.log(`[API generate-image-async] Image ${i + 1} uploadée:`, publicUrl);
        
        // Petit délai entre les générations
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`[API generate-image-async] Erreur image ${i + 1}:`, error);
      }
    }
    
    // Mettre à jour Airtable avec les URLs
    if (publicUrls.length > 0) {
      const imagesForAirtable = publicUrls.map((url, index) => ({
        url: url,
        filename: `visualisation-ia-${index + 1}.png`
      }));
      
      const imageFields: any = {
        id: projetId,
        images: imagesForAirtable
      };
      
      // Ajouter les URLs aux champs individuels imageIA1-4
      publicUrls.forEach((url, index) => {
        if (index < 4) {
          imageFields[`imageIA${index + 1}`] = url;
        }
      });
      
      await updateProjet(imageFields);
      console.log('[API generate-image-async] Airtable mis à jour avec succès');
    }
    
    return NextResponse.json({
      success: true,
      projetId,
      imagesGenerated: publicUrls.length,
      urls: publicUrls
    });
    
  } catch (error) {
    console.error('[API generate-image-async] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération asynchrone' },
      { status: 500 }
    );
  }
}