import OpenAI from 'openai';

// Initialiser le client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Configuration officielle de GPT-Image 1
 * Modèle lancé en avril 2025
 */
export interface GPTImageConfig {
  model: 'gpt-image-1';
  size?: '1024x1024' | '1536x1024' | '1024x1536';
  quality?: 'low' | 'standard' | 'high';
  output_format?: 'png' | 'jpg' | 'webp';
  moderation?: 'auto' | 'none';
}

/**
 * Prix officiels GPT-Image 1 (avril 2025)
 */
export const GPT_IMAGE_PRICING = {
  low: 0.02,      // Qualité basse - parfait pour les tests
  standard: 0.05, // Qualité standard
  high: 0.10      // Haute qualité
};

/**
 * Génère une image avec GPT-Image 1
 * @param prompt - Le prompt descriptif pour générer l'image
 * @param config - Configuration GPT-Image
 * @returns URL de l'image générée et métadonnées
 */
export async function generateWithGPTImage(
  prompt: string,
  config: Partial<GPTImageConfig> = {}
): Promise<{
  url: string;
  model: string;
  size: string;
  quality: string;
  cost: number;
}> {
  try {
    const finalConfig: GPTImageConfig = {
      model: 'gpt-image-1',
      size: config.size || '1024x1024',
      quality: config.quality || 'low', // Par défaut : 0.02€
      output_format: config.output_format || 'png',
      moderation: config.moderation || 'auto'
    };

    // Appel à l'API OpenAI avec le modèle GPT-Image
    const response = await openai.images.generate({
      model: finalConfig.model,
      prompt,
      n: 1,
      size: finalConfig.size,
      quality: finalConfig.quality,
      response_format: 'url',
    });

    if (!response.data[0]?.url) {
      throw new Error('GPT-Image n\'a pas retourné d\'URL');
    }

    return {
      url: response.data[0].url,
      model: finalConfig.model,
      size: finalConfig.size,
      quality: finalConfig.quality,
      cost: GPT_IMAGE_PRICING[finalConfig.quality]
    };
  } catch (error) {
    console.error('Erreur GPT-Image:', error);
    throw error;
  }
}

/**
 * Génère une image en base64 avec GPT-Image 1
 */
export async function generateBase64WithGPTImage(
  prompt: string,
  config: Partial<GPTImageConfig> = {}
): Promise<{
  base64: string;
  model: string;
  size: string;
  quality: string;
  cost: number;
}> {
  try {
    const finalConfig: GPTImageConfig = {
      model: 'gpt-image-1',
      size: config.size || '1024x1024',
      quality: config.quality || 'low',
      output_format: config.output_format || 'png',
      moderation: config.moderation || 'auto'
    };

    const response = await openai.images.generate({
      model: finalConfig.model,
      prompt,
      n: 1,
      size: finalConfig.size,
      quality: finalConfig.quality,
      response_format: 'b64_json',
    });

    if (!response.data[0]?.b64_json) {
      throw new Error('GPT-Image n\'a pas retourné de base64');
    }

    return {
      base64: `data:image/${finalConfig.output_format};base64,${response.data[0].b64_json}`,
      model: finalConfig.model,
      size: finalConfig.size,
      quality: finalConfig.quality,
      cost: GPT_IMAGE_PRICING[finalConfig.quality]
    };
  } catch (error) {
    console.error('Erreur GPT-Image Base64:', error);
    throw error;
  }
}

/**
 * Convertit une URL d'image en base64
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erreur conversion base64:', error);
    throw error;
  }
}

/**
 * Obtient les informations sur GPT-Image
 */
export function getGPTImageInfo() {
  return {
    model: 'gpt-image-1',
    version: '1.0',
    releaseDate: 'Avril 2025',
    supportedSizes: ['1024x1024', '1536x1024', '1024x1536'],
    supportedQualities: ['low', 'standard', 'high'],
    supportedFormats: ['png', 'jpg', 'webp'],
    pricing: GPT_IMAGE_PRICING,
    features: [
      'Génération d\'images photoréalistes',
      'Support des prompts en français',
      'Modération automatique du contenu',
      'Optimisation pour la joaillerie',
      'Rendu haute définition des métaux et pierres'
    ]
  };
}