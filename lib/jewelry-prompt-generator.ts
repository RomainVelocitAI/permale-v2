import { Projet } from '@/types';

export interface JewelryPromptOptions {
  quality?: 'low' | 'standard' | 'high';
  angles?: number;
  background?: 'dark' | 'light' | 'neutral';
  lighting?: 'studio' | 'natural' | 'dramatic';
  style?: 'catalog' | 'artistic' | 'lifestyle';
}

/**
 * Génère un prompt détaillé pour créer une image de bijou basée sur les données du formulaire
 */
export function generateJewelryPrompt(
  projet: Partial<Projet>,
  options: JewelryPromptOptions = {}
): string {
  const {
    quality = 'low', // Pour les tests à 0.02€
    angles = 3,
    background = 'dark',
    lighting = 'studio',
    style = 'catalog'
  } = options;

  // Déterminer le type de bijou
  const jewelryType = getJewelryTypeDescription(projet.typeBijou);
  
  // Construire la description des matériaux et pierres
  const materialsDescription = getMaterialsDescription(projet);
  
  // Construire la description du style
  const styleDescription = getStyleDescription(projet);
  
  // Construire la description de la gravure si applicable
  const engravingDescription = projet.gravure 
    ? `, featuring elegant engraving "${projet.gravure}"` 
    : '';

  // Prompt de base pour trois angles
  const basePrompt = `Professional jewelry photography showcase displaying a luxury ${jewelryType} design from multiple angles on ${background} textured background. Show three views: top-down view, side profile view, and three-quarter angle view. ${jewelryType} should feature ${materialsDescription}${styleDescription} with ornate metalwork details${engravingDescription}. Clean ${lighting} lighting with subtle shadows, high-end jewelry ${style} style, elegant presentation layout with brand signature at bottom. Photorealistic rendering, commercial jewelry photography aesthetic.`;

  // Ajuster pour la qualité de test (images moins détaillées)
  if (quality === 'low') {
    return `${basePrompt} Simple rendering, basic details, quick preview quality.`;
  }

  return basePrompt;
}

/**
 * Traduit le type de bijou en description anglaise
 */
function getJewelryTypeDescription(typeBijou?: string): string {
  const typeMap: Record<string, string> = {
    'Alliance': 'wedding band',
    'Bague de Fiançailles': 'engagement ring',
    'Chevalière': 'signet ring',
    'Solitaire': 'solitaire ring',
    'Bague': 'ring',
    'Collier': 'necklace',
    'Bracelet': 'bracelet',
    'Boucles d\'oreilles': 'earrings',
    'Pendentif': 'pendant',
    'Broche': 'brooch'
  };

  return typeMap[typeBijou || ''] || 'jewelry piece';
}

/**
 * Génère la description des matériaux basée sur le projet
 */
function getMaterialsDescription(projet: Partial<Projet>): string {
  const materials = [];
  
  // Analyser la description pour extraire les matériaux
  const description = projet.description?.toLowerCase() || '';
  
  if (description.includes('or blanc') || description.includes('white gold')) {
    materials.push('white gold');
  } else if (description.includes('or jaune') || description.includes('yellow gold')) {
    materials.push('yellow gold');
  } else if (description.includes('or rose') || description.includes('rose gold')) {
    materials.push('rose gold');
  } else if (description.includes('platine') || description.includes('platinum')) {
    materials.push('platinum');
  } else if (description.includes('argent') || description.includes('silver')) {
    materials.push('silver');
  } else {
    materials.push('gold'); // Par défaut
  }

  // Analyser pour les pierres
  if (description.includes('diamant') || description.includes('diamond')) {
    materials.push('brilliant cut diamond');
  }
  if (description.includes('saphir') || description.includes('sapphire')) {
    materials.push('sapphire');
  }
  if (description.includes('rubis') || description.includes('ruby')) {
    materials.push('ruby');
  }
  if (description.includes('émeraude') || description.includes('emerald')) {
    materials.push('emerald');
  }

  return materials.join(' with ');
}

/**
 * Génère la description du style basée sur le projet
 */
function getStyleDescription(projet: Partial<Projet>): string {
  const description = projet.description?.toLowerCase() || '';
  const occasion = projet.occasion?.toLowerCase() || '';
  
  const styles = [];
  
  // Analyser le style depuis la description
  if (description.includes('moderne') || description.includes('modern')) {
    styles.push('modern');
  }
  if (description.includes('classique') || description.includes('classic')) {
    styles.push('classic');
  }
  if (description.includes('vintage')) {
    styles.push('vintage-inspired');
  }
  if (description.includes('minimaliste') || description.includes('minimalist')) {
    styles.push('minimalist');
  }
  
  // Ajouter des éléments basés sur l'occasion
  if (occasion.includes('mariage') || occasion.includes('wedding')) {
    styles.push('elegant');
  }
  if (occasion.includes('fiançailles') || occasion.includes('engagement')) {
    styles.push('romantic');
  }
  
  if (styles.length === 0) {
    styles.push('elegant');
  }
  
  return ` in ${styles.join(' ')} style`;
}

/**
 * Génère des prompts pour différentes variations d'un même bijou
 */
export function generateJewelryVariations(
  projet: Partial<Projet>,
  variations: string[] = ['classic view', 'detailed close-up', 'lifestyle shot']
): string[] {
  return variations.map(variation => {
    const basePrompt = generateJewelryPrompt(projet);
    return `${basePrompt} Focus on ${variation}.`;
  });
}

/**
 * Génère un prompt optimisé pour les tests à bas coût
 */
export function generateTestPrompt(projet: Partial<Projet>): string {
  const jewelryType = getJewelryTypeDescription(projet.typeBijou);
  const material = getMaterialsDescription(projet).split(' with ')[0]; // Premier matériau seulement
  
  return `Simple ${jewelryType} made of ${material}, basic jewelry photography, single view, neutral background, standard lighting. Quick preview render.`;
}

/**
 * Génère un prompt pour une image de haute qualité
 */
export function generateHighQualityPrompt(projet: Partial<Projet>): string {
  const basePrompt = generateJewelryPrompt(projet, { quality: 'high' });
  
  return `${basePrompt} Ultra-high resolution, 8K quality, intricate details visible, professional jewelry photography with perfect lighting, multiple angles showcased in elegant layout. Magazine-quality presentation with subtle reflections and shadows. Premium commercial jewelry catalog aesthetic.`;
}