# Guide d'authentification pour Permale

## Configuration actuelle

J'ai mis en place un système d'authentification simple pour votre application Permale. Voici ce qui a été ajouté :

### 1. Page de connexion (`/login`)
- Interface simple avec email et mot de passe
- Redirection automatique après connexion

### 2. Middleware de protection
- Toutes les routes sont protégées sauf `/login`
- Redirection automatique vers login si non authentifié

### 3. API d'authentification
- Route `/api/auth/login` pour la connexion
- Route `/api/auth/logout` pour la déconnexion
- Utilisation de cookies httpOnly pour la sécurité

### 4. Utilisateur par défaut
```
Email: siva@permale.com
Mot de passe: Azalees2025
```

## Pour déployer sur Netlify

1. **Pusher les changements** sur votre repository GitHub

2. **Variables d'environnement** à ajouter sur Netlify :
   - Gardez vos variables Airtable existantes
   - Optionnel : Ajouter `JWT_SECRET` pour une meilleure sécurité

3. **Redéployer** sur Netlify

## Options d'amélioration

### Option 1 : Netlify Identity (Recommandé)
Pour une solution plus robuste, vous pouvez utiliser Netlify Identity :

1. Dans Netlify Dashboard > Site settings > Identity
2. Activer Identity
3. Installer le plugin : `npm install netlify-identity-widget`
4. Intégrer dans votre app

### Option 2 : Auth0 ou Clerk
Services d'authentification professionnels avec plus de fonctionnalités

### Option 3 : Stockage des utilisateurs dans Airtable
Créer une table "Users" dans Airtable pour gérer les utilisateurs

## Sécurité importante

**Pour la production, vous devez :**

1. **Hasher les mots de passe** (utiliser bcrypt)
2. **Utiliser JWT** pour les tokens (au lieu du token simple actuel)
3. **HTTPS obligatoire** (Netlify le fait automatiquement)
4. **Gérer les sessions** proprement

## Personnalisation

### Modifier les utilisateurs autorisés
Éditer `/app/api/auth/login/route.ts` :
```typescript
const AUTHORIZED_USERS = [
  {
    email: 'votre-email@domain.com',
    password: 'votre-mot-de-passe'
  }
]
```

### Changer le style de la page login
Éditer `/app/login/page.tsx`

### Ajouter un logo ou personnaliser
Modifier les composants selon vos besoins

## Test en local

```bash
npm run dev
# Aller sur http://localhost:3000
# Vous serez redirigé vers /login
```