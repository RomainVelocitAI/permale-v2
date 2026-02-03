# Configuration de l'Upload GitHub pour Permale

## 1. Créer un Personal Access Token GitHub

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur "Generate new token" → "Generate new token (classic)"
3. Donnez un nom au token : "Permale Images Upload"
4. Sélectionnez la durée (90 jours ou plus)
5. Cochez les permissions suivantes :
   - ✅ **repo** (Full control of private repositories)
   - C'est la seule permission nécessaire
6. Cliquez sur "Generate token"
7. **IMPORTANT** : Copiez le token immédiatement (vous ne pourrez plus le voir)

## 2. Configurer les variables d'environnement

Créez ou modifiez le fichier `.env.local` :

```bash
# Airtable Configuration
AIRTABLE_API_KEY=votre_cle_airtable
AIRTABLE_BASE_ID=votre_base_id
AIRTABLE_TABLE_NAME=Projets

# Upload Provider Configuration
UPLOAD_PROVIDER=github

# GitHub Provider
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx  # Le token que vous venez de créer
GITHUB_OWNER=RomainVelocitAI
GITHUB_REPO=permale-images
GITHUB_BRANCH=main
```

## 3. Structure des URLs

Les images seront accessibles via :
```
https://raw.githubusercontent.com/RomainVelocitAI/permale-images/main/projets/2025/01/1234567890-photo.jpg
```

## 4. Test de l'upload

1. Lancez le serveur : `npm run dev`
2. Allez sur http://localhost:3000/nouveau-client
3. Remplissez le formulaire avec des images
4. Vérifiez que les images apparaissent dans le repository GitHub

## 5. Avantages de cette solution

- ✅ **Gratuit** : Pas de limite pour un repo public
- ✅ **Fiable** : GitHub a une excellente disponibilité
- ✅ **Versionné** : Historique complet des images
- ✅ **CDN** : GitHub sert les images via un CDN global
- ✅ **Compatible Netlify** : Fonctionne directement sans modification

## 6. Limitations

- Taille max par fichier : 100 MB
- Taille max du repo : 5 GB (recommandé)
- Rate limit : 5000 requêtes/heure avec token

## 7. Sécurité

- Ne commitez JAMAIS le token dans le code
- Utilisez uniquement les permissions nécessaires
- Renouvelez le token régulièrement

## 8. Structure du repository d'images

```
permale-images/
├── projets/
│   └── 2025/
│       └── 01/
│           ├── 1234567890-bague.jpg
│           └── 1234567891-collier.jpg
└── assets/
    └── logo.png
```

## 9. Migration future

Si vous souhaitez migrer vers un autre service :
1. Les URLs dans Airtable devront être mises à jour
2. Les images peuvent être facilement téléchargées depuis GitHub
3. Le code est modulaire (changez juste le provider)