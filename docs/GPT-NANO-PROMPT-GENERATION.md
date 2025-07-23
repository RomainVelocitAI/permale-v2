# Génération de Prompts avec GPT-4.1 Nano

## Vue d'ensemble

Le nouveau système utilise GPT-4.1 Nano pour générer intelligemment des prompts pour GPT-Image 1, remplaçant l'ancienne génération manuelle qui produisait des résultats insatisfaisants.

## Changements Clés

### Ancienne Méthode (Problématique)
- Génération manuelle par concaténation de chaînes
- Prompts en français (moins efficace pour GPT-Image)
- Absence de la triple vue essentielle
- Résultats incohérents et de qualité variable

### Nouvelle Méthode (GPT-4.1 Nano)
- Génération intelligente par IA
- Prompts en anglais technique professionnel
- **Triple vue obligatoire** : top-down, side profile, three-quarter angle
- Résultats cohérents et de haute qualité

## La Phrase Fixe Obligatoire

Chaque prompt DOIT commencer par cette structure (adaptée au type de bijou):

```
Professional jewelry photography showcase displaying a luxury [JEWELRY_TYPE] design from multiple angles on dark textured background. Show three views: top-down view, side profile view, and three-quarter angle view
```

Exemples:
- Ring: "...luxury ring design..."
- Necklace: "...luxury necklace design..."
- Bracelet: "...luxury bracelet design..."

## Architecture Technique

### 1. GPTNanoPromptService (`/lib/gpt-nano-prompt-service.ts`)
- Utilise l'API OpenAI avec le modèle `gpt-4.1-nano`
- Génère des prompts basés sur les données du formulaire
- Garantit l'inclusion de la triple vue
- Fallback intelligent en cas d'erreur

### 2. GPTImageJewelryServiceV2 (`/lib/gpt-image-jewelry-service-v2.ts`)
- Remplace l'ancien service
- Intègre GPT-4.1 Nano pour la génération de prompts
- Maintient la compatibilité avec GPT-Image 1
- Ajoute des fonctions de debug et comparaison

## Utilisation

### Configuration Requise
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Exemple d'Utilisation
```typescript
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';

// Générer une image
const result = await GPTImageJewelryServiceV2.generateJewelryImage({
  typeBijou: 'Bague de Fiançailles',
  budget: '2000€',
  description: 'Bague solitaire avec diamant central, style classique',
  occasion: 'Demande en mariage',
  pourQui: 'pour elle',
  gravure: 'Pour toujours'
}, {
  quality: 'high',
  returnBase64: true
});

// Prévisualiser uniquement le prompt
const prompt = await GPTImageJewelryServiceV2.previewPrompt(projet);

// Comparer ancien vs nouveau système
const comparison = await GPTImageJewelryServiceV2.comparePrompts(projet);
console.log('Ancien:', comparison.oldPrompt);
console.log('Nouveau:', comparison.newPrompt);
console.log('Améliorations:', comparison.improvements);
```

## Exemple de Prompt Généré

Entrée:
```json
{
  "typeBijou": "Bague de Fiançailles",
  "budget": "3000€",
  "description": "Solitaire classique avec diamant rond brillant",
  "occasion": "Demande en mariage",
  "gravure": "A & M - 14.02.2024"
}
```

Sortie GPT-4.1 Nano:
```
Professional jewelry photography showcase displaying a luxury engagement ring design from multiple angles on dark textured background. Show three views: top-down view, side profile view, and three-quarter angle view. Classic solitaire setting featuring a brilliant round diamond centerpiece, crafted in 18K white gold with exceptional clarity and fire. The band displays personalized engraving "A & M - 14.02.2024" in elegant script. Ultra-detailed macro photography with studio lighting highlighting the diamond's brilliance and metal's lustrous finish. Photorealistic rendering showcasing intricate prong details and perfect symmetry. 8K resolution capture emphasizing luxury and timeless elegance.
```

## Avantages du Nouveau Système

1. **Qualité Constante**: Les prompts sont toujours bien structurés
2. **Triple Vue Garantie**: La phrase clé est toujours présente
3. **Adaptation Intelligente**: L'IA comprend le contexte et adapte le prompt
4. **Langage Optimisé**: Utilisation de l'anglais technique pour GPT-Image
5. **Détails Enrichis**: Description plus complète et professionnelle

## Migration

Pour migrer de l'ancien système:

1. Remplacer les imports:
```typescript
// Ancien
import { GPTImageJewelryService } from '@/lib/gpt-image-jewelry-service';

// Nouveau
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
```

2. Adapter les appels (l'API reste identique):
```typescript
// L'interface reste la même, seul le nom change
const result = await GPTImageJewelryServiceV2.generateJewelryImage(projet, options);
```

## Coûts

- **GPT-4.1 Nano**: Model payant (voir tarification OpenAI)
- **GPT-Image 1**: 
  - Low: $0.02 per image
  - Standard: $0.05 per image
  - High: $0.10 per image

## Dépannage

### Erreur "Model not found"
- Vérifier que l'API key a accès à GPT-4.1 Nano
- Vérifier l'orthographe du modèle: `gpt-4.1-nano`

### Prompt sans triple vue
- Le système ajoute automatiquement la phrase si elle manque
- Vérifier les logs pour voir le prompt final

### Fallback activé
- En cas d'erreur API, le système utilise une génération améliorée
- Les résultats restent de bonne qualité mais moins personnalisés