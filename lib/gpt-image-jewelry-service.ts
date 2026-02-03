import { generateWithGPTImage, generateBase64WithGPTImage, imageUrlToBase64 } from './gpt-image-service';
import { Projet } from '@/types';

/**
 * Service de génération d'images de bijoux avec GPT-Image 1
 */
export class GPTImageJewelryService {
  /**
   * Génère un prompt adaptatif basé sur les données du formulaire
   */
  static generatePrompt(projet: Partial<Projet>): string {
    const parts: string[] = ['Photographie professionnelle haute qualité'];

    // Type de bijou
    const jewelryType = this.getJewelryTypeFrench(projet.typeBijou);
    parts.push(`d'${this.getArticle(jewelryType)}${jewelryType}`);

    // Pierres et matériaux basés sur la description
    if (projet.description) {
      const materials = this.extractMaterials(projet.description);
      if (materials.length > 0) {
        parts.push(`avec ${materials.join(', ')}`);
      }
    }

    // Matériau principal basé sur le budget
    const material = this.getMaterialFromBudget(projet.budget);
    parts.push(`en ${material}`);

    // Style basé sur l'occasion et la description
    const style = this.getStyle(projet.occasion, projet.description);
    parts.push(`style ${style}`);

    // Gravure si présente
    if (projet.gravure) {
      parts.push(`avec gravure personnalisée "${projet.gravure}"`);
    }

    // Pour qui
    if (projet.pourQui) {
      const targetStyle = projet.pourQui === 'pour moi' ? 'personnel' : 'cadeau';
      parts.push(`design ${this.getGenderStyle(projet.description)} ${targetStyle}`);
    }

    // Paramètres de rendu professionnels
    parts.push(
      'sur fond neutre élégant',
      'éclairage studio professionnel mettant en valeur les détails',
      'haute définition',
      'rendu photoréaliste'
    );

    return parts.join(', ');
  }

  /**
   * Détermine l'article approprié
   */
  private static getArticle(word: string): string {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'h'];
    return vowels.includes(word.charAt(0).toLowerCase()) ? 'un ' : 'une ';
  }

  /**
   * Traduit le type de bijou
   */
  private static getJewelryTypeFrench(type?: string): string {
    const types: Record<string, string> = {
      'Alliance': 'alliance',
      'Bague de Fiançailles': 'bague de fiançailles',
      'Chevalière': 'chevalière',
      'Bague autre': 'bague',
      'Collier': 'collier',
      'Pendentif': 'pendentif',
      'Boucle d\'oreille': 'boucles d\'oreilles',
      'Bracelet': 'bracelet',
      'Percing': 'piercing',
      'Bijoux autre': 'bijou'
    };
    return types[type || ''] || 'bijou';
  }

  /**
   * Extrait les matériaux de la description
   */
  private static extractMaterials(description: string): string[] {
    const materials: string[] = [];
    const desc = description.toLowerCase();

    // Pierres précieuses
    if (desc.includes('diamant')) materials.push('diamant');
    if (desc.includes('saphir')) materials.push('saphir');
    if (desc.includes('rubis')) materials.push('rubis');
    if (desc.includes('émeraude')) materials.push('émeraude');
    if (desc.includes('perle')) materials.push('perles');

    // Pierres semi-précieuses
    if (desc.includes('améthyste')) materials.push('améthyste');
    if (desc.includes('topaze')) materials.push('topaze');
    if (desc.includes('quartz')) materials.push('quartz');

    return materials;
  }

  /**
   * Détermine le matériau principal selon le budget
   */
  private static getMaterialFromBudget(budget?: string): string {
    if (!budget) return 'or 18 carats';
    
    const amount = parseInt(budget.replace(/[^\d]/g, ''));
    
    if (amount < 500) return 'argent 925';
    if (amount < 1000) return 'or 9 carats';
    if (amount < 2000) return 'or 14 carats';
    if (amount < 5000) return 'or 18 carats';
    return 'or 18 carats avec pierres précieuses';
  }

  /**
   * Détermine le style du bijou
   */
  private static getStyle(occasion?: string, description?: string): string {
    const styles: string[] = [];
    
    // Basé sur l'occasion
    if (occasion) {
      const occ = occasion.toLowerCase();
      if (occ.includes('mariage')) styles.push('classique');
      if (occ.includes('fiançailles')) styles.push('romantique');
      if (occ.includes('anniversaire')) styles.push('élégant');
      if (occ.includes('quotidien')) styles.push('délicat');
    }

    // Basé sur la description
    if (description) {
      const desc = description.toLowerCase();
      if (desc.includes('moderne')) styles.push('moderne');
      if (desc.includes('vintage')) styles.push('vintage');
      if (desc.includes('minimaliste')) styles.push('minimaliste');
      if (desc.includes('luxe') || desc.includes('luxueux')) styles.push('luxueux');
    }

    return styles.length > 0 ? styles.join(' et ') : 'classique et intemporel';
  }

  /**
   * Détermine le style genré
   */
  private static getGenderStyle(description?: string): string {
    if (!description) return 'élégant';
    
    const desc = description.toLowerCase();
    if (desc.includes('féminin') || desc.includes('femme')) return 'féminin élégant';
    if (desc.includes('masculin') || desc.includes('homme')) return 'masculin raffiné';
    if (desc.includes('enfant')) return 'délicat pour enfant';
    
    return 'élégant';
  }

  /**
   * Génère une image de bijou avec GPT-Image
   */
  static async generateJewelryImage(
    projet: Partial<Projet>,
    options: {
      quality?: 'standard' | 'hd';
      returnBase64?: boolean;
    } = {}
  ) {
    const prompt = this.generatePrompt(projet);
    
    console.log('Prompt GPT-Image généré:', prompt);

    if (options.returnBase64) {
      const results = await generateBase64WithGPTImage(prompt, {
        quality: options.quality || 'standard'
      }, 1);
      
      const result = results[0];
      return {
        ...result,
        prompt,
        imageUrl: result.base64
      };
    } else {
      const results = await generateWithGPTImage(prompt, {
        quality: options.quality || 'standard'
      }, 1);
      
      const result = results[0];
      // Convertir en base64 si nécessaire
      const base64 = await imageUrlToBase64(result.url);
      
      return {
        ...result,
        prompt,
        imageUrl: result.url,
        base64
      };
    }
  }
}