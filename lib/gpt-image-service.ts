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
  model: 'dall-e-3';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

/**
 * Prix officiels GPT-Image 1
 */
export const GPT_IMAGE_PRICING = {
  standard: 0.04,  // DALL-E 3 standard pour 1024x1024
  hd: 0.08         // DALL-E 3 HD pour 1024x1024
};

/**
 * Génère une image avec GPT-Image 1
 * @param prompt - Le prompt descriptif pour générer l'image
 * @param config - Configuration GPT-Image
 * @returns URL de l'image générée et métadonnées
 */
export async function generateWithGPTImage(
  prompt: string,
  config: Partial<GPTImageConfig> = {},
  count: number = 1
): Promise<{
  url: string;
  model: string;
  size: string;
  quality: string;
  cost: number;
}[]> {
  try {
    const finalConfig: GPTImageConfig = {
      model: 'dall-e-3',
      size: config.size || '1024x1024',
      quality: config.quality || 'standard',
      style: config.style || 'vivid'
    };

    // Appel à l'API OpenAI avec GPT-Image 1
    const response = await openai.images.generate({
      model: finalConfig.model,
      prompt,
      n: count,
      size: finalConfig.size,
      quality: finalConfig.quality,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('GPT-Image n\'a pas retourné d\'images');
    }

    return response.data.map((image) => ({
      url: image.url!,
      model: finalConfig.model,
      size: finalConfig.size!,
      quality: finalConfig.quality!,
      cost: GPT_IMAGE_PRICING[finalConfig.quality!]
    }));
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
  config: Partial<GPTImageConfig> = {},
  count: number = 1
): Promise<{
  base64: string;
  model: string;
  size: string;
  quality: string;
  cost: number;
}[]> {
  try {
    const finalConfig: GPTImageConfig = {
      model: 'dall-e-3',
      size: config.size || '1024x1024',
      quality: config.quality || 'standard',
      style: config.style || 'vivid'
    };

    const response = await openai.images.generate({
      model: finalConfig.model,
      prompt,
      n: count,
      size: finalConfig.size,
      quality: finalConfig.quality,
      response_format: 'b64_json'
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('GPT-Image n\'a pas retourné d\'images');
    }

    return response.data.map((image) => ({
      base64: `data:image/png;base64,${image.b64_json}`,
      model: finalConfig.model,
      size: finalConfig.size!,
      quality: finalConfig.quality!,
      cost: GPT_IMAGE_PRICING[finalConfig.quality!]
    }));
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
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
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
    model: 'dall-e-3',
    version: '3.0',
    releaseDate: 'Novembre 2023',
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
    supportedQualities: ['standard', 'hd'],
    supportedStyles: ['vivid', 'natural'],
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