# URL de Présentation Client

## Vue d'ensemble

Le système génère automatiquement une URL de présentation unique pour chaque projet dès sa création. Cette URL permet au client de visualiser son projet de manière élégante et professionnelle.

## Fonctionnement

### 1. Génération automatique de l'URL

Lors de la création d'un nouveau projet via le formulaire, une URL unique est générée automatiquement avec le format suivant :
```
https://permale.com/presentation/{nom}-{prenom}-{id-unique}
```

Exemple : `https://permale.com/presentation/dupont-jean-rec12345`

### 2. Caractéristiques de l'URL

- **URL-friendly** : Les caractères spéciaux et accents sont supprimés
- **Unique** : Utilise les 8 derniers caractères de l'ID Airtable
- **Permanente** : L'URL reste la même pendant toute la vie du projet
- **Sécurisée** : Impossible de deviner l'URL d'un autre projet

### 3. Stockage dans Airtable

L'URL est stockée dans le champ `URL Presentation` d'Airtable. Le processus est :
1. Création du projet dans Airtable
2. Récupération de l'ID unique du record
3. Génération de l'URL avec cet ID
4. Mise à jour du record avec l'URL

### 4. Accès à l'URL

#### Pour l'administrateur
L'URL est visible dans la fiche projet :
- Section "Lien de présentation client"
- Bouton "Copier le lien" avec confirmation visuelle
- Lien cliquable pour tester

#### Pour le client
Le client reçoit l'URL par email ou message et peut :
- Voir toutes les informations de son projet
- Visualiser les photos de référence uploadées
- Voir les propositions de design générées par IA
- Suivre l'avancement du projet

### 5. Page de présentation client

La page `/presentation/[slug]` affiche :
- En-tête avec nom du client et type de bijou
- Détails du projet (budget, occasion, date de livraison, etc.)
- Description complète
- Photos de référence (si fournies)
- Propositions de design IA (quand disponibles)
- Message d'attente si les designs ne sont pas encore générés

## Aspects techniques

### Fichiers modifiés

1. **`/lib/utils.ts`** : Fonctions utilitaires
   - `generateSlug()` : Crée un slug URL-friendly
   - `generatePresentationUrl()` : Génère l'URL complète
   - `extractIdFromPresentationUrl()` : Extrait l'ID d'une URL

2. **`/lib/airtable.ts`** : Intégration Airtable
   - Modification de `createProjet()` pour générer l'URL automatiquement
   - Import de la fonction `generatePresentationUrl`

3. **`/app/api/projets/presentation/route.ts`** : API endpoint
   - Route GET pour récupérer un projet par son URL de présentation

4. **`/app/presentation/[slug]/page.tsx`** : Page publique
   - Affichage élégant du projet pour le client
   - Responsive design
   - Gestion des erreurs

5. **`/components/DetailProjet.tsx`** : Fiche projet admin
   - Affichage de l'URL de présentation
   - Bouton de copie avec feedback visuel

### Dépendances

- `nanoid` : Pour générer des IDs uniques courts et sécurisés

## Sécurité

- Les URLs sont impossibles à deviner grâce à l'ID unique de 8 caractères
- Pas d'authentification requise (voulu pour le partage facile)
- Les informations sensibles (prix d'achat, notes internes) ne sont pas affichées

## Évolutions futures possibles

1. **Protection par mot de passe** : Optionnel pour certains projets
2. **Expiration des liens** : Après X jours ou livraison
3. **Analytics** : Suivre les visites du client
4. **Commentaires client** : Permettre au client de laisser des retours
5. **Sélection d'image** : Le client pourrait choisir son design préféré
6. **Partage social** : Boutons de partage pour les réseaux sociaux