/**
 * Prompts pour la génération des 4 images de présentation
 * Ces prompts décrivent uniquement la scène/contexte, pas le bijou lui-même
 * Le bijou est fourni via l'image d'inspiration dans l'API OpenAI
 */

export interface PresentationPrompts {
  esquisse: string;
  porte: string;
  ecrin: string;
  surface: string;
}

export const PRESENTATION_PROMPTS: Record<string, PresentationPrompts> = {
  // BAGUES (Alliance, Bague de Fiançailles, Chevalière, Bague autre)
  bague: {
    esquisse: "Artistic watercolor sketch on textured paper, soft gouache painting style, delicate brushstrokes, cream background with subtle color washes, artistic jewelry illustration style",
    porte: "Elegant woman's hand wearing the ring, manicured nails with nude polish, soft natural lighting, luxurious setting, close-up shot, shallow depth of field, professional jewelry photography",
    ecrin: "Luxury jewelry box interior, deep navy velvet cushion, premium presentation case with gold accents, soft lighting highlighting the jewelry, opened box at perfect angle",
    surface: "Jewelry on polished white marble surface with subtle gold veining, elegant composition, natural light creating beautiful reflections and shadows, minimalist luxury aesthetic"
  },

  // COLLIERS ET PENDENTIFS
  collier: {
    esquisse: "Artistic watercolor sketch on textured paper, soft gouache painting style with gold accents, delicate brushstrokes, ivory background with subtle color washes, haute couture jewelry illustration",
    porte: "Elegant woman wearing the necklace, graceful neckline, sophisticated black dress, soft studio lighting, luxurious ambiance, professional portrait style, focus on neck area",
    ecrin: "Premium jewelry presentation box, champagne silk lining, elegant display case with LED lighting, sophisticated presentation setup, luxury packaging",
    surface: "Necklace displayed on dark walnut wood surface, artistic arrangement with soft curves, dramatic lighting creating depth and luxury feel, rich textures"
  },

  pendentif: {
    esquisse: "Delicate watercolor illustration on fine art paper, soft gouache technique, subtle gradient washes, pearl white background, refined jewelry sketch style",
    porte: "Close-up of elegant décolletage wearing the pendant, soft skin tones, natural lighting, minimalist styling, professional fashion photography angle",
    ecrin: "Luxury pendant presentation box, cream velvet interior, compact elegant case, soft spotlight on the jewelry, premium packaging design",
    surface: "Pendant on brushed gold surface, artistic composition with chain elegantly arranged, warm lighting creating soft shadows, luxurious presentation"
  },

  // BRACELETS
  bracelet: {
    esquisse: "Artistic watercolor sketch on textured paper, flowing gouache strokes, cream and gold color palette, elegant jewelry illustration with movement",
    porte: "Elegant wrist wearing the bracelet, refined pose with hand resting gracefully, soft natural lighting, luxurious setting, close-up detail shot, professional styling",
    ecrin: "Luxury bracelet presentation box, taupe suede cushioning, elongated elegant case interior, sophisticated display lighting, premium presentation",
    surface: "Bracelet on white marble surface with rose gold veining, curved elegant composition, natural light creating beautiful reflections, luxury minimalism"
  },

  // BOUCLES D'OREILLES ET PERCINGS
  boucles: {
    esquisse: "Delicate watercolor illustration showing pair symmetry, soft gouache on textured paper, blush and gold tones, elegant fashion illustration style",
    porte: "Elegant woman wearing the earrings, profile view showing one ear, sophisticated updo hairstyle, soft studio lighting, luxurious ambiance, beauty photography style",
    ecrin: "Premium earring presentation box, dual velvet compartments in burgundy, elegant display case with mirror, refined lighting setup, luxury packaging",
    surface: "Earrings on reflective black glass surface, symmetrical arrangement, soft lighting creating elegant shadows and highlights, modern luxury aesthetic"
  },

  percing: {
    esquisse: "Modern watercolor sketch on textured paper, contemporary gouache style, subtle metallic accents, minimalist artistic approach",
    porte: "Close-up of ear with the piercing, modern styling, natural skin tones, soft focused lighting, contemporary fashion photography",
    ecrin: "Modern jewelry presentation box, sleek black interior, minimalist case design, focused LED lighting, contemporary packaging",
    surface: "Piercing on matte black slate, artistic minimalist composition, directional lighting for dramatic effect, modern aesthetic"
  },

  // AUTRES BIJOUX
  autre: {
    esquisse: "Artistic watercolor sketch on textured paper, versatile gouache painting style, neutral elegant tones, classic jewelry illustration approach",
    porte: "Elegant presentation of the jewelry piece being worn, sophisticated styling, professional photography lighting, adaptable to jewelry type",
    ecrin: "Luxury jewelry presentation box, premium materials in neutral tones, elegant case design, sophisticated display lighting, universal luxury packaging",
    surface: "Jewelry on luxury surface mixing marble and wood, artistic composition, dramatic lighting creating depth and elegance, versatile presentation"
  }
};

/**
 * Obtenir les prompts pour un type de bijou donné
 */
export function getPromptsForType(typeBijou: string): PresentationPrompts {
  // Normaliser le type de bijou
  const typeNormalized = typeBijou.toLowerCase();
  
  // Mapping des types spécifiques vers les catégories de prompts
  if (typeNormalized.includes('alliance') || 
      typeNormalized.includes('fiançailles') || 
      typeNormalized.includes('chevalière') || 
      typeNormalized.includes('bague')) {
    return PRESENTATION_PROMPTS.bague;
  }
  
  if (typeNormalized.includes('collier')) {
    return PRESENTATION_PROMPTS.collier;
  }
  
  if (typeNormalized.includes('pendentif')) {
    return PRESENTATION_PROMPTS.pendentif;
  }
  
  if (typeNormalized.includes('bracelet')) {
    return PRESENTATION_PROMPTS.bracelet;
  }
  
  if (typeNormalized.includes('boucle') || typeNormalized.includes('oreille')) {
    return PRESENTATION_PROMPTS.boucles;
  }
  
  if (typeNormalized.includes('percing') || typeNormalized.includes('piercing')) {
    return PRESENTATION_PROMPTS.percing;
  }
  
  // Par défaut, retourner les prompts "autre"
  return PRESENTATION_PROMPTS.autre;
}

/**
 * Types d'images de présentation
 */
export const IMAGE_TYPES = {
  ESQUISSE: 'esquisse',
  PORTE: 'porte',
  ECRIN: 'ecrin',
  SURFACE: 'surface'
} as const;

/**
 * Descriptions des types d'images pour l'interface utilisateur
 */
export const IMAGE_TYPE_LABELS = {
  esquisse: "Esquisse artistique",
  porte: "Bijou porté",
  ecrin: "Dans son écrin",
  surface: "Présentation surface"
} as const;