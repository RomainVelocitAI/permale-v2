# Guide de Migration vers GPT-4.1 Nano

## Vue d'ensemble de la Migration

Ce guide explique comment migrer de l'ancien système de génération de prompts (manuel) vers le nouveau système utilisant GPT-4.1 Nano.

## Étapes de Migration

### 1. Configuration de l'Environnement

Ajouter la clé API OpenAI dans `.env.local`:
```env
OPENAI_API_KEY=sk-...votre_clé_ici...
```

**Important**: La clé doit avoir accès à GPT-4.1 Nano (modèle payant).

### 2. Installation des Dépendances

Le projet utilise déjà `openai` v4.77.0, aucune mise à jour nécessaire.

### 3. Mise à jour des Imports

#### Ancien Code
```typescript
import { GPTImageJewelryService } from '@/lib/gpt-image-jewelry-service';

// Utilisation
const prompt = GPTImageJewelryService.generatePrompt(projet);
const result = await GPTImageJewelryService.generateJewelryImage(projet, options);
```

#### Nouveau Code
```typescript
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';

// Utilisation (API identique mais asynchrone pour le prompt)
const prompt = await GPTImageJewelryServiceV2.previewPrompt(projet);
const result = await GPTImageJewelryServiceV2.generateJewelryImage(projet, options);
```

### 4. Mise à jour des Routes API

#### Option A: Remplacer l'ancienne route
Remplacer le contenu de `/app/api/generate-image/route.ts` par le nouveau code.

#### Option B: Créer une nouvelle route (recommandé pour tests)
1. Conserver l'ancienne route à `/api/generate-image`
2. Utiliser la nouvelle route à `/api/generate-image-v2`
3. Basculer progressivement après validation

### 5. Mise à jour du Frontend

Si vous appelez directement l'API:
```typescript
// Ancien
const response = await fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projet })
});

// Nouveau (si nouvelle route)
const response = await fetch('/api/generate-image-v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projet })
});
```

## Nouvelles Fonctionnalités

### 1. Prévisualisation du Prompt
```typescript
// Voir le prompt sans générer l'image (économise des coûts)
const response = await fetch('/api/generate-image-v2/preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projet })
});
```

### 2. Comparaison des Systèmes
```typescript
// Comparer ancien vs nouveau prompt
const response = await fetch('/api/generate-image-v2/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projet })
});
```

## Tests de Validation

### 1. Test Manuel Rapide
```bash
# Configurer la clé API
export OPENAI_API_KEY=sk-...

# Lancer le test
npx tsx scripts/test-gpt-nano-generation.ts
```

### 2. Vérifications Critiques
- [ ] La triple vue est présente dans tous les prompts
- [ ] Les prompts sont en anglais
- [ ] La gravure personnalisée apparaît correctement
- [ ] Le type de bijou est correctement traduit
- [ ] Les matériaux correspondent au budget

### 3. Test A/B Recommandé
1. Garder les deux routes actives temporairement
2. Comparer les résultats sur 10-20 générations
3. Valider la qualité supérieure du nouveau système
4. Basculer définitivement

## Gestion des Erreurs

### Erreur "Model not found"
```typescript
// Vérifier le nom exact du modèle
model: 'gpt-4.1-nano' // Correct
model: 'gpt-4.1-nano' // Incorrect: gpt-4.1-nano
```

### Erreur API Key
```typescript
// Vérifier que la clé a accès à GPT-4.1 Nano
// Tester avec un appel simple:
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const test = await openai.chat.completions.create({
  model: 'gpt-4.1-nano',
  messages: [{ role: 'user', content: 'test' }],
  max_tokens: 10
});
```

### Fallback Automatique
Le système a un fallback intégré qui génère un prompt de qualité même si GPT-4.1 Nano échoue.

## Optimisations de Coût

### 1. Utiliser la Prévisualisation
- Coût: 0.001€ (GPT-4.1 Nano seul)
- Permet de valider le prompt avant de générer l'image

### 2. Cache des Prompts
Pour des projets similaires, envisager de cacher les prompts:
```typescript
const promptCache = new Map<string, string>();
const cacheKey = JSON.stringify(projet);

if (promptCache.has(cacheKey)) {
  return promptCache.get(cacheKey);
}

const prompt = await GPTNanoPromptService.generatePrompt(projet);
promptCache.set(cacheKey, prompt);
```

### 3. Mode Batch
Pour plusieurs générations, utiliser un seul appel GPT-4.1 Nano:
```typescript
// Générer plusieurs prompts en une fois
const prompts = await Promise.all(
  projets.map(p => GPTNanoPromptService.generatePrompt(p))
);
```

## Rollback d'Urgence

Si besoin de revenir en arrière rapidement:

1. **Route API**: Rediriger vers l'ancienne route
```typescript
// Dans next.config.js
async redirects() {
  return [
    {
      source: '/api/generate-image-v2',
      destination: '/api/generate-image',
      permanent: false,
    },
  ]
}
```

2. **Service**: Utiliser l'ancien service
```typescript
// Remplacer temporairement
import { GPTImageJewelryService as GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service';
```

## Checklist de Migration

- [ ] Clé API OpenAI configurée avec accès GPT-4.1 Nano
- [ ] Nouveaux fichiers créés et testés
- [ ] Routes API mises à jour ou nouvelles créées
- [ ] Tests de validation exécutés avec succès
- [ ] Frontend mis à jour pour utiliser les nouvelles routes
- [ ] Documentation mise à jour
- [ ] Monitoring des coûts en place
- [ ] Plan de rollback préparé

## Support

En cas de problème:
1. Vérifier les logs de la console
2. Tester avec le script de test fourni
3. Utiliser la route de comparaison pour diagnostiquer
4. Vérifier l'accès API à GPT-4.1 Nano

## Résultats Attendus

Après migration, vous devriez observer:
- ✅ Prompts toujours avec triple vue
- ✅ Qualité d'image nettement supérieure
- ✅ Descriptions plus riches et détaillées
- ✅ Meilleure adaptation au contexte
- ✅ Résultats plus constants