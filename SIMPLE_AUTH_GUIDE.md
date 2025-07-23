# Protection par mot de passe - Guide simple

## Ce qui a été mis en place

Votre application Permale est maintenant protégée par un système de connexion simple avec **UN SEUL utilisateur**.

### Identifiants par défaut
- Email : `siva@permale.com`
- Mot de passe : `Azalees2025`

## Comment ça marche

1. Quand quelqu'un accède à votre site, il est automatiquement redirigé vers `/login`
2. Il doit entrer l'email et le mot de passe corrects
3. Une fois connecté, il peut accéder à toute l'application
4. Un bouton "Déconnexion" est disponible en haut de page

## IMPORTANT : Avant de déployer sur Netlify

### 1. Changer les identifiants

Sur Netlify, allez dans :
- **Site settings** → **Environment variables**
- Ajoutez ces 2 variables :

```
ADMIN_EMAIL = votre-email@exemple.com
ADMIN_PASSWORD = un-mot-de-passe-tres-securise
```

⚠️ **TRÈS IMPORTANT** : Utilisez un mot de passe fort et unique !

### 2. Redéployer

Une fois les variables ajoutées, Netlify redéploiera automatiquement votre site.

## Sécurité

- ✅ Le mot de passe n'est jamais visible dans le code
- ✅ La connexion utilise des cookies sécurisés
- ✅ HTTPS est automatique sur Netlify
- ✅ Un seul utilisateur = moins de risques

## Pour changer les identifiants plus tard

1. Allez dans Netlify → Environment variables
2. Modifiez `ADMIN_EMAIL` et/ou `ADMIN_PASSWORD`
3. Cliquez sur "Save"
4. Le site se redéploie automatiquement avec les nouveaux identifiants

## Test en local

Pour tester localement avec des identifiants personnalisés :

1. Créez un fichier `.env.local` dans `/var/www/permale/`
2. Ajoutez :
```
ADMIN_EMAIL=test@test.com
ADMIN_PASSWORD=test123
```
3. Lancez `npm run dev`

## Support

Si vous avez des questions ou des problèmes :
- Vérifiez que les variables d'environnement sont bien définies sur Netlify
- Assurez-vous d'utiliser les bons identifiants
- En cas de problème, supprimez les cookies de votre navigateur et réessayez