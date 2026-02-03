# Exemples de Prompts GPT-Image

Ce document montre comment le système génère des prompts adaptatifs basés sur les données du formulaire.

## Exemples concrets

### 1. Bague de fiançailles classique

**Données du formulaire:**
```json
{
  "typeBijou": "Bague de Fiançailles",
  "budget": "3500€",
  "occasion": "Mariage",
  "description": "Solitaire classique avec diamant central",
  "pourQui": "Femme",
  "gravure": "Pour toujours"
}
```

**Prompt généré:**
```
Photographie professionnelle haute qualité d'une bague de fiançailles avec diamant, 
en or 18 carats avec pierres précieuses, style classique et romantique, finition luxueuse, 
design féminin élégant, avec gravure personnalisée "Pour toujours", 
sur fond neutre élégant, éclairage studio professionnel mettant en valeur les détails, 
haute définition, rendu photoréaliste
```

### 2. Alliance moderne minimaliste

**Données du formulaire:**
```json
{
  "typeBijou": "Alliance",
  "budget": "800€",
  "occasion": "Mariage",
  "description": "Design moderne et minimaliste, finition mate",
  "pourQui": "Homme"
}
```

**Prompt généré:**
```
Photographie professionnelle haute qualité d'une alliance, en or 9 carats, 
style classique et romantique, finition luxueuse, design moderne, 
design minimaliste épuré, design masculin raffiné, sur fond neutre élégant, 
éclairage studio professionnel mettant en valeur les détails, haute définition, 
rendu photoréaliste
```

### 3. Collier anniversaire avec pendentif

**Données du formulaire:**
```json
{
  "typeBijou": "Collier",
  "budget": "1200€",
  "occasion": "Anniversaire",
  "description": "Collier fin avec pendentif coeur en or rose",
  "pourQui": "Femme",
  "gravure": "18.06.2024"
}
```

**Prompt généré:**
```
Photographie professionnelle haute qualité d'un collier élégant, en or 14 carats, 
design moderne et élégant, design féminin élégant, 
avec gravure personnalisée "18.06.2024", sur fond neutre élégant, 
éclairage studio professionnel mettant en valeur les détails, haute définition, 
rendu photoréaliste
```

### 4. Bracelet enfant personnalisé

**Données du formulaire:**
```json
{
  "typeBijou": "Bracelet",
  "budget": "300€",
  "occasion": "Naissance",
  "description": "Bracelet délicat pour bébé avec plaque gravée",
  "pourQui": "Enfant",
  "gravure": "Emma"
}
```

**Prompt généré:**
```
Photographie professionnelle haute qualité d'un bracelet raffiné, en argent sterling 925, 
style délicat avec touches personnalisées, taille et design adaptés pour enfant, 
avec gravure personnalisée "Emma", sur fond neutre élégant, 
éclairage studio professionnel mettant en valeur les détails, haute définition, 
rendu photoréaliste
```

### 5. Boucles d'oreilles luxe

**Données du formulaire:**
```json
{
  "typeBijou": "Boucles d'oreilles",
  "budget": "5000€",
  "occasion": "Personnel",
  "description": "Boucles d'oreilles pendantes avec diamants, style Art Déco luxueux",
  "pourQui": "Femme"
}
```

**Prompt généré:**
```
Photographie professionnelle haute qualité d'une paire de boucles d'oreilles, 
en or 18 carats avec pierres précieuses, design unique et personnalisé, 
finition luxueuse, design féminin élégant, sur fond neutre élégant, 
éclairage studio professionnel mettant en valeur les détails, haute définition, 
rendu photoréaliste
```

## Logique de génération

### 1. Matériaux selon le budget
- **< 500€**: Argent sterling 925
- **500-1500€**: Or 9 carats
- **1500-3000€**: Or 14 carats
- **> 3000€**: Or 18 carats avec pierres précieuses

### 2. Styles selon l'occasion
- **Mariage**: "style classique et romantique, finition luxueuse"
- **Anniversaire**: "design moderne et élégant"
- **Naissance**: "style délicat avec touches personnalisées"
- **Cadeau**: "présentation soignée dans un écrin"
- **Personnel**: "design unique et personnalisé"

### 3. Mots-clés extraits de la description
Le système détecte et ajoute automatiquement:
- "moderne" → "design moderne"
- "vintage" → "style vintage"
- "minimaliste" → "design minimaliste épuré"
- "luxe/luxueux" → "finition luxueuse"

### 4. Adaptation selon le destinataire
- **Femme**: "design féminin élégant"
- **Homme**: "design masculin raffiné"
- **Enfant**: "taille et design adaptés pour enfant"
- **Couple**: "design harmonieux pour couple"

## Structure standard du prompt

Tous les prompts suivent cette structure:
1. "Photographie professionnelle haute qualité"
2. Type de bijou
3. Matériau (basé sur le budget)
4. Style (basé sur l'occasion)
5. Éléments de la description
6. Design selon le destinataire
7. Gravure si applicable
8. "sur fond neutre élégant"
9. "éclairage studio professionnel mettant en valeur les détails"
10. "haute définition"
11. "rendu photoréaliste"

Cette structure garantit des images cohérentes et professionnelles adaptées à la joaillerie.