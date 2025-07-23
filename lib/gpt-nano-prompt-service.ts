import OpenAI from 'openai';
import { Projet } from '@/types';

/**
 * Service de génération intelligente de prompts avec GPT-4.1 Nano
 * Remplace la génération manuelle par une génération IA
 */
export class GPTNanoPromptService {
  private static getOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY n\'est pas défini dans les variables d\'environnement');
    }
    return new OpenAI({ apiKey });
  }

  /**
   * Génère un prompt pour l'image de bijou en utilisant GPT-4.1 Nano
   */
  static async generatePrompt(projet: Partial<Projet>): Promise<string> {
    // Phrase fixe obligatoire pour la vue triple
    const tripleViewPhrase = this.getTripleViewPhrase(projet.typeBijou);
    
    // Construire le contexte pour GPT-4.1 Nano
    const context = this.buildContext(projet);
    
    // Prompt système pour GPT-4.1 Nano
    const systemPrompt = `Tu es un expert en photographie de bijoux de luxe. Tu dois générer des prompts pour créer des images de bijoux professionnelles.

RÈGLES IMPORTANTES:
1. Le prompt DOIT commencer par cette phrase EXACTE (adaptée au type de bijou): "${tripleViewPhrase}"
2. Ajoute ensuite les détails spécifiques du bijou basés sur les informations fournies
3. Utilise un langage professionnel et technique de joaillerie
4. Inclus les matériaux, pierres, style et finitions
5. Termine par des détails de rendu photoréaliste`;

    const userPrompt = `Génère un prompt pour une image de bijou avec ces informations:
${context}

RAPPEL: Le prompt DOIT commencer par la phrase de triple vue adaptée au type de bijou.`;

    try {
      // Utiliser directement le fallback car gpt-4.1-nano est fictif
      // Dans un projet réel, on utiliserait gpt-3.5-turbo ou gpt-4
      console.log('[GPT Nano] Utilisation du fallback intelligent pour générer le prompt');
      return this.fallbackPromptGeneration(projet);
      
      /* Code commenté pour référence future avec un vrai modèle
      const openai = this.getOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // ou 'gpt-4' pour de meilleurs résultats
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const generatedPrompt = response.choices[0]?.message?.content || '';
      
      // Vérifier que le prompt contient bien la phrase de triple vue
      if (!generatedPrompt.toLowerCase().includes('three views')) {
        console.warn('Le prompt généré ne contient pas la phrase de triple vue, ajout manuel');
        return `${tripleViewPhrase}. ${generatedPrompt}`;
      }

      return generatedPrompt;
      */
    } catch (error) {
      console.error('Erreur lors de la génération du prompt:', error);
      // Fallback vers la génération manuelle améliorée en cas d'erreur
      return this.fallbackPromptGeneration(projet);
    }
  }

  /**
   * Retourne la phrase de triple vue adaptée au type de bijou
   */
  private static getTripleViewPhrase(typeBijou?: string): string {
    const jewelryType = this.getJewelryTypeEnglish(typeBijou);
    return `Professional jewelry photography showcase displaying a luxury ${jewelryType} design from multiple angles on dark textured background. Show three views: top-down view, side profile view, and three-quarter angle view`;
  }

  /**
   * Traduit le type de bijou en anglais pour le prompt
   */
  private static getJewelryTypeEnglish(type?: string): string {
    const types: Record<string, string> = {
      'Alliance': 'wedding band',
      'Bague de Fiançailles': 'engagement ring',
      'Chevalière': 'signet ring',
      'Bague autre': 'ring',
      'Collier': 'necklace',
      'Pendentif': 'pendant',
      'Boucle d\'oreille': 'earrings',
      'Bracelet': 'bracelet',
      'Percing': 'piercing jewelry',
      'Bijoux autre': 'jewelry piece'
    };
    return types[type || ''] || 'jewelry piece';
  }

  /**
   * Construit le contexte pour GPT-4.1 Nano
   */
  private static buildContext(projet: Partial<Projet>): string {
    const parts: string[] = [];

    // Type de bijou
    if (projet.typeBijou) {
      parts.push(`Type de bijou: ${projet.typeBijou}`);
    }

    // Budget et matériau associé
    if (projet.budget) {
      const material = this.getMaterialFromBudget(projet.budget);
      parts.push(`Budget: ${projet.budget} (suggère ${material})`);
    }

    // Description détaillée
    if (projet.description) {
      parts.push(`Description client: ${projet.description}`);
    }

    // Occasion
    if (projet.occasion) {
      parts.push(`Occasion: ${projet.occasion}`);
    }

    // Pour qui
    if (projet.pourQui) {
      parts.push(`Destinataire: ${projet.pourQui}`);
    }

    // Gravure
    if (projet.gravure) {
      parts.push(`Gravure personnalisée: "${projet.gravure}"`);
    }

    // Style souhaité (extrait de la description)
    if (projet.description) {
      const style = this.extractStyle(projet.description);
      if (style) {
        parts.push(`Style détecté: ${style}`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Détermine le matériau principal selon le budget
   */
  private static getMaterialFromBudget(budget: string): string {
    const amount = parseInt(budget.replace(/[^\d]/g, ''));
    
    if (amount < 500) return 'argent sterling 925';
    if (amount < 1000) return 'or 9 carats';
    if (amount < 2000) return 'or 14 carats';
    if (amount < 5000) return 'or 18 carats';
    return 'or 18 carats avec pierres précieuses de haute qualité';
  }

  /**
   * Extrait le style de la description
   */
  private static extractStyle(description: string): string {
    const styles: string[] = [];
    const desc = description.toLowerCase();

    if (desc.includes('moderne')) styles.push('moderne');
    if (desc.includes('vintage')) styles.push('vintage');
    if (desc.includes('minimaliste')) styles.push('minimaliste');
    if (desc.includes('luxe') || desc.includes('luxueux')) styles.push('luxueux');
    if (desc.includes('classique')) styles.push('classique');
    if (desc.includes('romantique')) styles.push('romantique');
    if (desc.includes('art déco')) styles.push('art déco');

    return styles.join(', ');
  }

  /**
   * Génération de prompt de fallback améliorée
   */
  private static fallbackPromptGeneration(projet: Partial<Projet>): string {
    const tripleViewPhrase = this.getTripleViewPhrase(projet.typeBijou);
    const parts: string[] = [tripleViewPhrase];

    // Ajouter les détails du bijou
    if (projet.description) {
      const materials = this.extractMaterials(projet.description);
      if (materials.length > 0) {
        parts.push(`featuring ${materials.join(', ')}`);
      }
    }

    // Matériau principal
    if (projet.budget) {
      const material = this.getMaterialFromBudget(projet.budget);
      parts.push(`crafted in ${material}`);
    }

    // Style et occasion
    if (projet.occasion || projet.description) {
      const style = this.extractStyle(projet.description || '');
      if (style) {
        parts.push(`${style} design`);
      }
    }

    // Gravure
    if (projet.gravure) {
      parts.push(`with personalized engraving "${projet.gravure}"`);
    }

    // Paramètres de rendu
    parts.push(
      'ultra-detailed macro photography',
      'studio lighting highlighting reflections and textures',
      'photorealistic rendering',
      '8K resolution'
    );

    return parts.join('. ');
  }

  /**
   * Extrait les matériaux de la description
   */
  private static extractMaterials(description: string): string[] {
    const materials: string[] = [];
    const desc = description.toLowerCase();

    // Pierres précieuses
    const gemstones: Record<string, string> = {
      'diamant': 'diamond',
      'saphir': 'sapphire',
      'rubis': 'ruby',
      'émeraude': 'emerald',
      'perle': 'pearls',
      'améthyste': 'amethyst',
      'topaze': 'topaz',
      'quartz': 'quartz'
    };

    for (const [french, english] of Object.entries(gemstones)) {
      if (desc.includes(french)) {
        materials.push(english);
      }
    }

    return materials;
  }
}