# PERMALE - Application de Gestion de Projets de Joaillerie

Application Next.js pour la gestion des projets de joaillerie personnalisée PERMALE.

## 🚀 Déploiement sur Netlify

### Prérequis

1. Un compte Netlify
2. Un compte Airtable avec la base de données configurée
3. Un repository GitHub pour stocker les images (optionnel)

### Étapes de déploiement

1. **Fork ou clone ce repository**

2. **Connecter à Netlify**
   - Aller sur [app.netlify.com](https://app.netlify.com)
   - Cliquer sur "Add new site" > "Import an existing project"
   - Connecter votre repository GitHub

3. **Configurer les variables d'environnement**
   
   Dans les paramètres Netlify, ajouter ces variables d'environnement :
   
   ```
   AIRTABLE_API_KEY=votre_clé_api_airtable
   AIRTABLE_BASE_ID=appXBgsSjbSGjAGqA
   AIRTABLE_TABLE_NAME=Joaillerie Siva
   UPLOAD_PROVIDER=github
   GITHUB_TOKEN=votre_token_github
   GITHUB_OWNER=RomainVelocitAI
   GITHUB_REPO=permale-images
   ```

4. **Déployer**
   - Netlify détectera automatiquement Next.js
   - Le build se lancera automatiquement
   - L'application sera disponible sur votre URL Netlify

### Configuration recommandée

Le projet est déjà optimisé pour Netlify avec :
- ✅ `netlify.toml` configuré
- ✅ Plugin Next.js de Netlify
- ✅ Headers de sécurité
- ✅ Caching optimisé pour les assets
- ✅ Build optimisé avec standalone output

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Modifier .env.local avec vos vraies clés

# Lancer le serveur de développement
npm run dev
```

## 📝 Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|---------|
| `AIRTABLE_API_KEY` | Clé API Airtable | ✅ |
| `AIRTABLE_BASE_ID` | ID de votre base Airtable | ✅ |
| `AIRTABLE_TABLE_NAME` | Nom de la table | ✅ |
| `UPLOAD_PROVIDER` | Provider d'upload (github/cloudinary/local) | ✅ |
| `GITHUB_TOKEN` | Token GitHub (si provider=github) | ⚠️ |
| `GITHUB_OWNER` | Propriétaire du repo GitHub | ⚠️ |
| `GITHUB_REPO` | Nom du repo pour les images | ⚠️ |

## 🔒 Sécurité

- Ne jamais commiter le fichier `.env.local`
- Utiliser des tokens GitHub avec les permissions minimales
- Restreindre l'accès à votre base Airtable

## 📦 Structure du projet

```
permale/
├── app/              # App Router Next.js
├── components/       # Composants React
├── lib/             # Utilitaires et services
├── public/          # Assets statiques
├── types/           # Types TypeScript
└── netlify.toml     # Configuration Netlify
```

## 🎨 Technologies

- Next.js 15.4
- TypeScript
- Tailwind CSS v4
- Airtable API
- Framer Motion

## 📄 License

Propriété de PERMALE Joaillerie