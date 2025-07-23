import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryService } from '@/lib/gpt-image-jewelry-service';
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

    // Estimer le coût avant de générer
    const estimatedCost = 0.02; // Prix pour qualité 'low'
    
    console.log('[API] Génération d\'image avec GPT-Image');
    console.log('[API] Coût estimé:', estimatedCost, '€');

    // Générer l'image avec GPT-Image
    const result = await GPTImageJewelryService.generateJewelryImage(projet as Partial<Projet>, {
      quality: 'low',
      returnBase64: false
    });
    
    const imageUrl = result.imageUrl;

    // Convertir l'URL en base64 pour l'upload
    let base64: string | undefined;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('[API] Erreur conversion base64:', error);
      // Continuer sans base64 si la conversion échoue
    }

    return NextResponse.json({
      success: true,
      result: {
        imageUrl,
        base64,
        prompt: result.prompt,
        model: 'gpt-image-1',
        cost: estimatedCost
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
          { error: 'Erreur avec le modèle GPT-Image. ' + error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image avec GPT-Image' },
      { status: 500 }
    );
  }
}

// Route GET pour obtenir les informations sur GPT-Image
export async function GET() {
  const estimatedCost = 0.02; // Prix pour qualité 'low'

  return NextResponse.json({
    model: 'gpt-image-1',
    description: 'Génération d\'images de bijoux avec GPT-Image (avril 2025)',
    currentConfig: {
      size: '1024x1024',
      quality: 'low',
      outputFormat: 'png',
      moderation: 'auto'
    },
    estimatedCost,
    pricing: {
      low: {
        '1024x1024': 0.02,
        '1536x1024': 0.025,
        '1024x1536': 0.025
      },
      medium: {
        '1024x1024': 0.07,
        '1536x1024': 0.08,
        '1024x1536': 0.08
      },
      high: {
        '1024x1024': 0.19,
        '1536x1024': 0.22,
        '1024x1536': 0.22
      }
    },
    features: [
      'Génération de bijoux photoréalistes',
      'Prompts adaptatifs basés sur le formulaire',
      'Support des gravures personnalisées',
      'Modération automatique du contenu',
      'Prix économique pour les tests (0.02€)'
    ]
  });
}

// Route POST pour générer plusieurs variations
export async function POST_VARIATIONS(request: NextRequest) {
  try {
    const body = await request.json();
    const { projet, count = 3 } = body;

    if (!projet) {
      return NextResponse.json(
        { error: 'Données du projet manquantes' },
        { status: 400 }
      );
    }

    const estimatedCost = 0.02 * count; // Prix pour qualité 'low'

    // Limiter le coût total
    if (estimatedCost > 0.10) {
      return NextResponse.json(
        { error: `Coût trop élevé: ${estimatedCost}€. Maximum autorisé: 0.10€` },
        { status: 400 }
      );
    }

    // Générer plusieurs variations
    const variations = [];
    for (let i = 0; i < count; i++) {
      const result = await GPTImageJewelryService.generateJewelryImage(projet as Partial<Projet>, {
        quality: 'low',
        returnBase64: false
      });
      variations.push(result);
    }

    return NextResponse.json({
      success: true,
      result: {
        images: variations.map(v => v.imageUrl),
        prompt: GPTImageJewelryService.generatePrompt(projet),
        model: 'gpt-image-1',
        totalCost: estimatedCost
      },
      estimatedCost
    });

  } catch (error) {
    console.error('[API] Erreur lors de la génération des variations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des variations' },
      { status: 500 }
    );
  }
}