# Comprendre le Système de Prompts GPT-Image

## Introduction

Le système GPT-Image utilise des prompts adaptatifs pour générer des images de bijoux personnalisées. Ces prompts sont construits automatiquement à partir des données du formulaire client.

## Comment fonctionne la génération de prompts ?

### 1. Structure de base

Chaque prompt suit une structure en plusieurs parties :

```
Photographie professionnelle haute qualité
+ Type de bijou
+ Matériaux et pierres
+ Matériau principal (selon budget)
+ Style (selon occasion)
+ Gravure (si présente)
+ Design genré (selon destinataire)
+ Paramètres techniques de rendu
```

### 2. Analyse des données du formulaire

Le système analyse chaque champ du formulaire pour extraire des informations pertinentes :

#### Type de bijou
- "Alliance" → "une alliance"
- "Bague de Fiançailles" → "une bague de fiançailles"
- "Chevalière" → "une chevalière"
- etc.

#### Budget → Matériau principal
- < 500€ → "argent 925"
- 500-1000€ → "or 9 carats"
- 1000-2000€ → "or 14 carats"
- 2000-5000€ → "or 18 carats"
- > 5000€ → "or 18 carats avec pierres précieuses"

#### Description → Extraction de matériaux
Le système recherche des mots-clés dans la description :
- "diamant" → ajoute "avec diamant"
- "saphir" → ajoute "avec saphir"
- "perle" → ajoute "avec perles"
- etc.

#### Occasion → Style
- "Mariage" → "style classique"
- "Fiançailles" → "style romantique"
- "Anniversaire" → "style élégant"
- "Quotidien" → "style délicat"

#### Pour qui → Design genré
- "Femme" → "design féminin élégant"
- "Homme" → "design masculin raffiné"
- "Enfant" → "design délicat pour enfant"

### 3. Exemple concret étape par étape

**Données du formulaire :**
```json
{
  "typeBijou": "Bague de Fiançailles",
  "budget": "3500€",
  "description": "Solitaire moderne avec diamant central",
  "occasion": "Fiançailles",
  "pourQui": "Femme",
  "gravure": "Pour toujours"
}
```

**Construction du prompt :**

1. **Base** : "Photographie professionnelle haute qualité"

2. **Type** : Analyse "Bague de Fiançailles"
   - Résultat : "d'une bague de fiançailles"

3. **Extraction matériaux** : Analyse "Solitaire moderne avec diamant central"
   - Trouve : "diamant"
   - Résultat : "avec diamant"

4. **Budget** : 3500€
   - Entre 2000€ et 5000€
   - Résultat : "en or 18 carats"

5. **Style occasion** : "Fiançailles"
   - Résultat : "style romantique"

6. **Style description** : "moderne"
   - Résultat : "moderne"

7. **Gravure** : "Pour toujours"
   - Résultat : "avec gravure personnalisée \"Pour toujours\""

8. **Pour qui** : "Femme"
   - Résultat : "design féminin élégant"

9. **Paramètres techniques** (toujours ajoutés) :
   - "sur fond neutre élégant"
   - "éclairage studio professionnel mettant en valeur les détails"
   - "haute définition"
   - "rendu photoréaliste"

**Prompt final généré :**
```
Photographie professionnelle haute qualité d'une bague de fiançailles 
avec diamant, en or 18 carats, style romantique et moderne, 
avec gravure personnalisée "Pour toujours", design féminin élégant, 
sur fond neutre élégant, éclairage studio professionnel mettant en valeur 
les détails, haute définition, rendu photoréaliste
```

## Logique d'adaptation intelligente

### Détection automatique de style

Le système analyse la description pour détecter des styles spécifiques :
- "moderne" → ajoute "moderne" au style
- "vintage" → ajoute "vintage" au style
- "minimaliste" → ajoute "minimaliste" au style
- "luxe" ou "luxueux" → ajoute "luxueux" au style

### Combinaison de styles

Si plusieurs styles sont détectés, ils sont combinés :
- Occasion "Mariage" + description "moderne" = "style classique et moderne"
- Occasion "Anniversaire" + description "vintage" = "style élégant et vintage"

### Adaptation contextuelle

Le système s'adapte au contexte :
- Pour un enfant : utilise "délicat" au lieu de "élégant"
- Pour un homme : utilise "raffiné" au lieu de "élégant"
- Budget élevé : ajoute automatiquement "finition luxueuse"

## Optimisation pour GPT-Image

### Mots-clés efficaces

GPT-Image répond mieux à certains termes :
- "Photographie professionnelle" plutôt que "Image"
- "Haute qualité" pour la précision des détails
- "Rendu photoréaliste" pour le réalisme
- "Éclairage studio professionnel" pour les reflets métalliques

### Structure optimale

L'ordre des éléments est important :
1. Type d'image (photographie)
2. Objet principal (bijou)
3. Matériaux visibles
4. Style et design
5. Détails personnalisés
6. Environnement et éclairage

### Paramètres techniques

- **Modèle** : gpt-image-1
- **Taille** : 1024x1024 (carré, idéal pour les bijoux)
- **Qualité** : "low" pour tests (0.02€)
- **Format** : PNG (meilleure qualité pour les détails)

## Exemples de prompts générés

### Alliance simple
**Entrée** : Alliance budget 800€ pour homme
**Prompt** : "Photographie professionnelle haute qualité d'une alliance, en or 9 carats, style classique et intemporel, design masculin raffiné, sur fond neutre élégant, éclairage studio professionnel mettant en valeur les détails, haute définition, rendu photoréaliste"

### Collier luxueux
**Entrée** : Collier 5000€ avec émeraudes pour anniversaire
**Prompt** : "Photographie professionnelle haute qualité d'un collier avec émeraude, en or 18 carats avec pierres précieuses, style élégant et luxueux, design féminin élégant, sur fond neutre élégant, éclairage studio professionnel mettant en valeur les détails, haute définition, rendu photoréaliste"

### Bracelet enfant
**Entrée** : Bracelet 300€ pour bébé avec gravure "Emma"
**Prompt** : "Photographie professionnelle haute qualité d'un bracelet, en argent 925, style délicat, avec gravure personnalisée \"Emma\", design délicat pour enfant, sur fond neutre élégant, éclairage studio professionnel mettant en valeur les détails, haute définition, rendu photoréaliste"

## Conseils pour améliorer les résultats

### Dans la description

Pour obtenir de meilleurs résultats, incluez dans la description :
- **Pierres spécifiques** : "diamant", "saphir", "rubis"
- **Style souhaité** : "moderne", "vintage", "art déco"
- **Détails de conception** : "torsadé", "pavé", "serti"
- **Finition** : "poli", "mat", "brossé"

### Mots-clés magiques

Certains termes améliorent significativement la qualité :
- "détails fins" → meilleur rendu des gravures
- "reflets brillants" → meilleur rendu métallique
- "mise au point nette" → meilleure netteté
- "lumière douce" → ombres plus naturelles

## Résolution de problèmes

### Image trop sombre
Ajouter dans la description : "bien éclairé" ou "lumineux"

### Manque de détails
Ajouter : "gros plan" ou "vue détaillée"

### Métal peu réaliste
Ajouter : "finition métallique réaliste" ou spécifier "poli miroir"

### Pierres peu visibles
Mentionner : "pierres brillantes" ou "gemmes étincelantes"

## Coûts et optimisation

### Mode test (actuel)
- **Qualité** : Low
- **Prix** : 0.02€ par image
- **Usage** : Tests et prévisualisations rapides

### Mode preview (futur)
- **Qualité** : Standard
- **Prix** : 0.05€ par image
- **Usage** : Présentations clients

### Mode production (futur)
- **Qualité** : High
- **Prix** : 0.10€ par image
- **Usage** : Images finales haute résolution

## Conclusion

Le système de prompts GPT-Image est conçu pour transformer automatiquement les données du formulaire en descriptions visuelles précises. L'adaptation intelligente garantit que chaque image générée reflète fidèlement les souhaits du client tout en maintenant une qualité professionnelle constante.