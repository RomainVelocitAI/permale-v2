import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { Projet } from '@/types';
import { getBaseUrl } from '@/lib/config';
import { createUploadService } from '@/lib/upload-service';

// Augmenter le timeout pour Netlify (10 secondes par défaut)
export const maxDuration = 300; // 5 minutes (maximum pour Netlify)

export async function POST(request: NextRequest) {
  console.log('[API generate-image-v2] Début de la requête');
  console.log('[API generate-image-v2] Variables d\'environnement:', {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'Set' : 'Not set',
    UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER || 'Not set',
  });
  
  try {
    const body = await request.json();
    const { projet, projetId } = body;
    
    console.log('[API generate-image-v2] Projet ID:', projetId);
    console.log('[API generate-image-v2] Type de bijou:', projet?.typeBijou);

    if (!projet) {
      return NextResponse.json(
        { error: 'Données du projet manquantes' },
        { status: 400 }
      );
    }

    // Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      console.error('[API generate-image-v2] OPENAI_API_KEY non définie');
      return NextResponse.json(
        { error: 'Configuration manquante: OPENAI_API_KEY requis pour GPT-4.1 Nano' },
        { status: 500 }
      );
    }

    // Estimer le coût (GPT-4.1 Nano + DALL-E 3)
    const numberOfImages = 4; // 4 images comme demandé
    const gptNanoCost = 0.001; // Coût estimé pour la génération du prompt (~300 tokens)
    const imageCost = 0.04 * numberOfImages; // Prix pour DALL-E 3 qualité 'standard'
    const totalCost = gptNanoCost + imageCost;
    
    console.log('[API] Génération avec GPT-4.1 Nano + DALL-E 3');
    console.log(`[API] Coût estimé total: ${totalCost}€ (0.001€ prompt + ${imageCost}€ pour ${numberOfImages} images)`);

    // Générer seulement 2 images pour éviter les timeouts Netlify
    const numberOfImagesToGenerate = 2; // Réduit temporairement de 4 à 2
    console.log(`[API] Génération de ${numberOfImagesToGenerate} images pour éviter les timeouts...`);
    
    const results = await Promise.all(
      Array(numberOfImagesToGenerate).fill(null).map(() => 
        GPTImageJewelryServiceV2.generateJewelryImage(projet as Partial<Projet>, {
          quality: 'standard',
          returnBase64: false
        })
      )
    );
    
    const images = results.map(result => result.imageUrl);
    console.log(`[API] ${images.length} images générées avec succès`);

    // Convertir les URLs en base64 et uploader vers GitHub
    const uploadService = createUploadService();
    console.log('[API] Service d\'upload:', process.env.UPLOAD_PROVIDER || 'local');
    const publicUrls: string[] = [];
    const base64Images: (string | undefined)[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        console.log(`[API] Téléchargement de l'image ${i + 1}:`, images[i]);
        
        const response = await fetch(images[i], {
          method: 'GET',
          headers: {
            'Accept': 'image/png,image/jpeg,image/*'
          }
        });
        
        // Vérifier que la réponse est valide
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log(`[API] Type de contenu image ${i + 1}:`, contentType);
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Vérifier que le buffer n'est pas vide
        if (buffer.length === 0) {
          throw new Error('Image vide reçue');
        }
        
        console.log(`[API] Taille de l'image ${i + 1}:`, buffer.length, 'bytes');
        
        // Vérifier la signature de l'image
        const signature = buffer.slice(0, 8).toString('hex');
        const isPNG = signature === '89504e470d0a1a0a';
        const isJPEG = signature.startsWith('ffd8ff');
        console.log(`[API] Image ${i + 1} - PNG: ${isPNG}, JPEG: ${isJPEG}, Signature: ${signature}`);
        
        // Déterminer le type MIME correct
        const mimeType = isPNG ? 'image/png' : isJPEG ? 'image/jpeg' : 'image/png';
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        base64Images.push(base64);
        
        // Uploader vers GitHub pour obtenir une URL publique permanente
        // Utiliser l'ID du projet ou un identifiant unique pour éviter les écrasements
        const uniqueId = projetId || Date.now().toString();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const filename = `projet-${uniqueId}-image-${i + 1}-${randomSuffix}.${isPNG ? 'png' : 'jpg'}`;
        const publicUrl = await uploadService.uploadImage(base64, filename);
        publicUrls.push(publicUrl);
        console.log(`[API] Image ${i + 1} uploadée vers GitHub:`, publicUrl);
      } catch (error) {
        console.error(`[API] Erreur conversion/upload image ${i + 1}:`, error);
        base64Images.push(undefined);
        publicUrls.push(images[i]); // Fallback vers l'URL OpenAI temporaire
      }
    }

    // Si on a un ID de projet, mettre à jour Airtable avec les URLs publiques
    if (projetId && publicUrls.length > 0) {
      try {
        // Préparer les images pour Airtable (URLs publiques depuis GitHub)
        const imagesForAirtable = publicUrls.map((url, index) => ({
          url: url,
          filename: `visualisation-ia-v2-${index + 1}.png`
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
        model: 'gpt-4.1-nano + dall-e-3',
        generationMethod: results[0].generationMethod,
        cost: totalCost,
        count: numberOfImages
      },
      estimatedCost: totalCost
    });

  } catch (error) {
    console.error('[API] Erreur lors de la génération d\'image:', error);
    
    // Gestion des erreurs spécifiques
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
      if (error.message.includes('gpt-4.1-nano')) {
        return NextResponse.json(
          { error: 'Erreur avec GPT-4.1 Nano. ' + error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    );
  }
}

// Route GET pour obtenir les informations sur le nouveau système
export async function GET() {
  const numberOfImages = 4;
  const gptNanoCost = 0.001;
  const imageCost = 0.04 * numberOfImages; // DALL-E 3 standard quality
  const totalCost = gptNanoCost + imageCost;

  return NextResponse.json({
    model: 'gpt-4.1-nano + gpt-image-1',
    description: 'Génération intelligente de prompts avec GPT-4.1 Nano puis création d\'images avec GPT-Image',
    improvements: [
      '✅ Triple vue professionnelle garantie',
      '✅ Prompts en anglais technique optimisé',
      '✅ Adaptation intelligente au contexte',
      '✅ Qualité constante et prévisible',
      '✅ Description enrichie et détaillée'
    ],
    currentConfig: {
      promptModel: 'gpt-4.1-nano',
      imageModel: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      numberOfImages: numberOfImages,
      outputFormat: 'png',
      moderation: 'auto'
    },
    estimatedCost: totalCost,
    costBreakdown: {
      promptGeneration: gptNanoCost,
      imageGeneration: imageCost
    },
    features: [
      'Prompt intelligent avec triple vue obligatoire',
      'Adaptation contextuelle basée sur les données du formulaire',
      'Support des gravures personnalisées',
      'Fallback intelligent en cas d\'erreur',
      'Comparaison avec l\'ancien système disponible'
    ]
  });
}

// Note: Pour prévisualiser le prompt ou comparer les systèmes, 
// utilisez l'endpoint POST principal avec un paramètre 'action' dans le body