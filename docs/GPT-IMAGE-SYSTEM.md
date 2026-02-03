# Système de Génération d'Images avec GPT-Image

## Vue d'ensemble

Le système utilise **GPT-Image 1** (avril 2025), le dernier modèle de génération d'images d'OpenAI, pour créer des visualisations de bijoux basées sur les descriptions fournies dans le formulaire client.

## Caractéristiques de GPT-Image 1

- **Modèle**: `gpt-image-1`
- **Date de sortie**: Avril 2025
- **Capacités**: 
  - Génération photoréaliste
  - Rendu précis du texte
  - Styles variés (photoréaliste à abstrait)
  - Modération automatique du contenu

## Configuration actuelle

### Mode Test (Par défaut)
- **Taille**: 1024x1024 pixels
- **Qualité**: Low (basse)
- **Format**: PNG
- **Modération**: Auto
- **Prix**: 0.02€ par image

## Architecture du système

### 1. Service GPT-Image (`/lib/gpt-image-service.ts`)

Le service principal qui gère:
- La génération de prompts adaptatifs
- L'appel à l'API OpenAI
- La gestion des erreurs
- Le calcul des coûts

#### Génération de prompts adaptatifs

Le système génère automatiquement des prompts détaillés basés sur:
- **Type de bijou**: Alliance, bague, collier, etc.
- **Budget**: Détermine le matériau (argent, or 9/14/18 carats)
- **Occasion**: Influence le style (classique, moderne, délicat)
- **Description**: Extraction de mots-clés (moderne, vintage, minimaliste)
- **Gravure**: Incluse dans le prompt si spécifiée
- **Pour qui**: Adapte le design (féminin, masculin, enfant)

Exemple de prompt généré:
```
Photographie professionnelle haute qualité d'une bague de fiançailles avec diamant, 
en or 18 carats avec pierres précieuses, style classique et romantique, finition luxueuse, 
avec gravure personnalisée "Marie", design féminin élégant, sur fond neutre élégant, 
éclairage studio professionnel mettant en valeur les détails, haute définition, 
rendu photoréaliste
```

### 2. API Route (`/app/api/generate-image/route.ts`)

Endpoints disponibles:
- **POST /api/generate-image**: Génère une image unique
- **GET /api/generate-image**: Obtient les informations et prix

### 3. Intégration Frontend (`/components/FormulaireClient.tsx`)

- Bouton "Générer avec GPT-Image"
- Affichage du prix (0.02€)
- Gestion de l'état de génération
- Conversion en base64 pour l'upload

## Tableau des prix GPT-Image

| Qualité | 1024x1024 | 1536x1024 | 1024x1536 |
|---------|-----------|-----------|-----------|
| Low     | 0.02€     | 0.025€    | 0.025€    |
| Medium  | 0.07€     | 0.08€     | 0.08€     |
| High    | 0.19€     | 0.22€     | 0.22€     |

## Workflow de génération

1. **Utilisateur remplit le formulaire**
   - Description obligatoire pour activer la génération
   - Autres champs enrichissent le prompt

2. **Clic sur "Générer avec GPT-Image"**
   - Appel à l'API `/api/generate-image`
   - Affichage du loader pendant la génération

3. **Génération du prompt**
   - Construction dynamique basée sur les données
   - Ajout automatique de termes techniques

4. **Appel à l'API OpenAI**
   - Modèle: `gpt-image-1`
   - Configuration low quality pour tests
   - Réponse en URL

5. **Affichage de l'image**
   - Conversion en base64 pour upload
   - Options: régénérer ou supprimer

6. **Sauvegarde automatique**
   - Image incluse lors de la soumission du formulaire
   - Stockée dans Airtable via le système d'upload

## Gestion des erreurs

Le système gère plusieurs types d'erreurs:
- **API Key manquante**: Message de configuration
- **Rate limit**: Invite à réessayer plus tard
- **Contenu non conforme**: Erreur de modération
- **Erreur réseau**: Message générique

## Sécurité et limites

- **Modération automatique**: Niveau "auto" par défaut
- **Limite de coût**: Maximum 0.10€ pour les variations multiples
- **Validation côté serveur**: Vérification des données avant génération
- **Pas de stockage local**: Les images sont converties en base64

## Évolutions possibles

1. **Mode Preview** (0.07€)
   - Qualité medium
   - Meilleur rendu des détails

2. **Mode Production** (0.19€)
   - Qualité high
   - Images haute résolution

3. **Variations multiples**
   - Générer 3-4 variations
   - Permettre la sélection

4. **Formats alternatifs**
   - Paysage (1536x1024) pour bannières
   - Portrait (1024x1536) pour catalogues

## Variables d'environnement requises

```env
OPENAI_API_KEY=sk-proj-xxxxx
```

## Commandes de test

```bash
# Tester l'API
curl -X GET http://localhost:3000/api/generate-image

# Générer une image test
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "projet": {
      "typeBijou": "Alliance",
      "description": "Alliance moderne en or blanc",
      "budget": "1500€",
      "occasion": "Mariage"
    }
  }'
```

## Notes importantes

- GPT-Image 1 est le modèle officiel d'OpenAI (pas DALL-E)
- Les prompts sont en français pour de meilleurs résultats
- Le système est optimisé pour les bijoux professionnels
- La modération automatique filtre le contenu inapproprié