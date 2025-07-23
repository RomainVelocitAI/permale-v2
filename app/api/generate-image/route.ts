import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryService } from '@/lib/gpt-image-jewelry-service';
import { Projet } from '@/types';
import { getBaseUrl } from '@/lib/config';
import { createUploadService } from '@/lib/upload-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projet, projetId } = body;

    if (!projet) {
      return NextResponse.json(
        { error: 'Données du projet manquantes' },
        { status: 400 }
      );
    }

    // Estimer le coût avant de générer
    const estimatedCost = 0.04 * 4; // Prix pour qualité 'standard' x 4 images
    
    console.log('[API] Génération de 4 images avec DALL-E 3');
    console.log('[API] Coût estimé:', estimatedCost, '€');

    // Générer 4 images avec DALL-E 3
    const results = await Promise.all(
      Array(4).fill(null).map(() => 
        GPTImageJewelryService.generateJewelryImage(projet as Partial<Projet>, {
          quality: 'standard',
          returnBase64: false
        })
      )
    );
    
    const images = results.map(result => result.imageUrl);

    // Convertir les URLs en base64 et uploader vers GitHub
    const uploadService = createUploadService();
    const publicUrls: string[] = [];
    const base64Images: (string | undefined)[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        base64Images.push(base64);
        
        // Uploader vers GitHub pour obtenir une URL publique permanente
        const publicUrl = await uploadService.uploadImage(base64, `visualisation-ia-${i + 1}.png`);
        publicUrls.push(publicUrl);
        console.log(`[API] Image ${i + 1} uploadée vers GitHub:`, publicUrl);
      } catch (error) {
        console.error('[API] Erreur conversion/upload image:', error);
        base64Images.push(undefined);
      }
    }

    // Si on a un ID de projet, mettre à jour Airtable avec les URLs publiques
    if (projetId && publicUrls.length > 0) {
      try {
        // Préparer les images pour Airtable (URLs publiques depuis GitHub)
        const imagesForAirtable = publicUrls.map((url, index) => ({
          url: url,
          filename: `visualisation-ia-${index + 1}.png`
        }));
        
        // Préparer aussi les champs individuels imageIA1-4
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
        
        const updateResponse = await fetch(`${getBaseUrl()}/api/projets`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageFields),
        });

        if (!updateResponse.ok) {
          console.error('[API] Erreur lors de la mise à jour Airtable');
        } else {
          console.log('[API] Images mises à jour dans Airtable avec succès');
        }
      } catch (error) {
        console.error('[API] Erreur lors de la mise à jour des images dans Airtable:', error);
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        images: images.map((url, index) => ({
          url,
          publicUrl: publicUrls[index] || url,
          base64: base64Images[index],
          index: index + 1
        })),
        prompt: results[0].prompt,
        model: 'dall-e-3',
        cost: estimatedCost,
        count: 4
      },
      estimatedCost
    });

  } catch (error) {
    console.error('[API] Erreur lors de la génération d\'image:', error);
    
    // Gestion des erreurs spécifiques de GPT-Image
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Erreur de configuration API. Vérifiez OPENAI_API_KEY.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Limite de taux dépassée, veuillez réessayer plus tard' },
          { status: 429 }
        );
      }
      if (error.message.includes('content policy') || error.message.includes('moderation')) {
        return NextResponse.json(
          { error: 'Le contenu demandé ne respecte pas les politiques de modération' },
          { status: 400 }
        );
      }
      if (error.message.includes('gpt-image-1')) {
        return NextResponse.json(
          { error: 'Erreur avec le modèle DALL-E 3. ' + error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image avec DALL-E 3' },
      { status: 500 }
    );
  }
}

// Route GET pour obtenir les informations sur DALL-E 3
export async function GET() {
  const estimatedCost = 0.04 * 4; // Prix pour qualité 'standard' x 4 images

  return NextResponse.json({
    model: 'dall-e-3',
    description: 'Génération d\'images de bijoux avec DALL-E 3',
    currentConfig: {
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    },
    estimatedCost,
    pricing: {
      standard: {
        '1024x1024': 0.04,
        '1792x1024': 0.08,
        '1024x1792': 0.08
      },
      hd: {
        '1024x1024': 0.08,
        '1792x1024': 0.12,
        '1024x1792': 0.12
      }
    },
    features: [
      'Génération de bijoux photoréalistes',
      'Prompts adaptatifs basés sur le formulaire',
      'Support des gravures personnalisées',
      'Modération automatique du contenu',
      'Qualité standard pour économiser les coûts'
    ]
  });
}

// Note: Pour générer plusieurs variations, 
// utilisez l'endpoint POST principal avec un paramètre 'count' dans le body