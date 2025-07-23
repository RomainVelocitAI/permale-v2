import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { Projet } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projet } = body;

    if (!projet) {
      return NextResponse.json(
        { error: 'Données du projet manquantes' },
        { status: 400 }
      );
    }

    // Vérifier la clé API OpenAI
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Configuration manquante: OPENAI_API_KEY requis pour GPT-4.1 Nano' },
        { status: 500 }
      );
    }

    // Estimer le coût (GPT-4.1 Nano + GPT-Image)
    const gptNanoCost = 0.001; // Coût estimé pour la génération du prompt
    const imageCost = 0.02 * 4; // Prix pour qualité 'low' x 4 images
    const totalCost = gptNanoCost + imageCost;
    
    console.log('[API] Génération d\'image avec GPT-4.1 Nano + GPT-Image');
    console.log('[API] Coût estimé total:', totalCost, '€');

    // Générer 4 images avec le nouveau service
    const results = await Promise.all(
      Array(4).fill(null).map(() => 
        GPTImageJewelryServiceV2.generateJewelryImage(projet as Partial<Projet>, {
          quality: 'standard',
          returnBase64: false
        })
      )
    );
    
    const images = results.map(result => result.imageUrl);

    // Convertir les URLs en base64 pour l'upload
    const base64Images: (string | undefined)[] = [];
    for (const imageUrl of images) {
      try {
        const response = await fetch(imageUrl);
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
      } catch (error) {
        console.error('[API] Erreur conversion base64:', error);
        base64Images.push(undefined);
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        images: images.map((url, index) => ({
          url,
          base64: base64Images[index],
          index: index + 1
        })),
        prompt: results[0].prompt,
        model: 'gpt-4.1-nano + gpt-image-1',
        generationMethod: results[0].generationMethod,
        cost: totalCost,
        count: 4
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
  const gptNanoCost = 0.001;
  const imageCost = 0.02 * 4; // 4 images
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
      imageModel: 'gpt-image-1',
      size: '512x512',
      quality: 'low',
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