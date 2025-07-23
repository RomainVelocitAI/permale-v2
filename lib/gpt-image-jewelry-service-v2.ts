import { generateWithGPTImage, generateBase64WithGPTImage, imageUrlToBase64 } from './gpt-image-service';
import { GPTNanoPromptService } from './gpt-nano-prompt-service';
import { Projet } from '@/types';

/**
 * Service de génération d'images de bijoux avec GPT-Image 1
 * Version 2 : Utilise GPT-4.1 Nano pour générer les prompts intelligemment
 */
export class GPTImageJewelryServiceV2 {
  /**
   * Génère une image de bijou avec un prompt créé par GPT-4.1 Nano
   */
  static async generateJewelryImage(
    projet: Partial<Projet>,
    options: {
      quality?: 'low' | 'standard' | 'high';
      returnBase64?: boolean;
    } = {}
  ) {
    try {
      // Générer le prompt avec GPT-4.1 Nano
      const prompt = await GPTNanoPromptService.generatePrompt(projet);
      
      console.log('Prompt généré par GPT-4.1 Nano:', prompt);
      console.log('---');
      console.log('Informations du projet utilisées:', {
        typeBijou: projet.typeBijou,
        budget: projet.budget,
        description: projet.description,
        occasion: projet.occasion,
        pourQui: projet.pourQui,
        gravure: projet.gravure
      });

      if (options.returnBase64) {
        const result = await generateBase64WithGPTImage(prompt, {
          quality: options.quality || 'low'
        });
        
        return {
          ...result,
          prompt,
          imageUrl: result.base64,
          generationMethod: 'gpt-4.1-nano'
        };
      } else {
        const result = await generateWithGPTImage(prompt, {
          quality: options.quality || 'low'
        });
        
        // Convertir en base64 si nécessaire
        const base64 = await imageUrlToBase64(result.url);
        
        return {
          ...result,
          prompt,
          imageUrl: result.url,
          base64,
          generationMethod: 'gpt-4.1-nano'
        };
      }
    } catch (error) {
      console.error('Erreur lors de la génération d\'image avec GPT-4.1 Nano:', error);
      throw error;
    }
  }

  /**
   * Génère uniquement le prompt sans créer l'image (pour prévisualisation)
   */
  static async previewPrompt(projet: Partial<Projet>): Promise<string> {
    try {
      const prompt = await GPTNanoPromptService.generatePrompt(projet);
      return prompt;
    } catch (error) {
      console.error('Erreur lors de la génération du prompt:', error);
      throw error;
    }
  }

  /**
   * Compare l'ancien et le nouveau prompt (pour debug/amélioration)
   */
  static async comparePrompts(projet: Partial<Projet>): Promise<{
    oldPrompt: string;
    newPrompt: string;
    improvements: string[];
  }> {
    // Importer l'ancienne méthode pour comparaison
    const { GPTImageJewelryService } = await import('./gpt-image-jewelry-service');
    
    const oldPrompt = GPTImageJewelryService.generatePrompt(projet);
    const newPrompt = await GPTNanoPromptService.generatePrompt(projet);
    
    const improvements: string[] = [];
    
    // Vérifier la présence de la triple vue
    if (newPrompt.toLowerCase().includes('three views') && !oldPrompt.toLowerCase().includes('vue')) {
      improvements.push('✅ Ajout de la triple vue professionnelle');
    }
    
    // Vérifier la langue (anglais pour GPT-Image)
    if (newPrompt.match(/[a-zA-Z]/g)?.length || 0 > oldPrompt.match(/[a-zA-Z]/g)?.length || 0) {
      improvements.push('✅ Meilleure utilisation de l\'anglais technique');
    }
    
    // Vérifier la longueur et la richesse
    if (newPrompt.length > oldPrompt.length) {
      improvements.push('✅ Description plus détaillée et riche');
    }
    
    // Vérifier les termes techniques
    const technicalTerms = ['macro photography', 'studio lighting', 'photorealistic', 'resolution'];
    const hasTechnicalTerms = technicalTerms.some(term => newPrompt.toLowerCase().includes(term));
    if (hasTechnicalTerms) {
      improvements.push('✅ Utilisation de termes techniques de photographie');
    }
    
    return {
      oldPrompt,
      newPrompt,
      improvements
    };
  }
}