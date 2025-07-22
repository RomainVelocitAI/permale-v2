# Résumé des corrections Airtable

## Champs ajoutés dans Airtable

J'ai ajouté les champs manquants suivants dans la base Airtable "Joaillerie Siva" :

1. **Occasion** (text) - L'occasion pour laquelle le bijou est créé
2. **Pour qui** (text) - Le destinataire du bijou (pour moi / à offrir)
3. **Budget** (currency €) - Le budget du client
4. **Date de livraison** (date) - La date de livraison souhaitée
5. **Gravure** (text) - Le texte de gravure demandé

## Modifications du code

### 1. `/lib/airtable.ts`
- Ajout du mapping pour tous les nouveaux champs dans `createProjet()`
- Mise à jour de `getAllProjets()`, `getProjetById()` et `updateProjet()` pour récupérer tous les champs
- Calcul automatique de `aUnModele` basé sur la présence de photos (`photosModele.length > 0`)

### 2. `/components/DetailProjet.tsx`
- Affichage conditionnel des champs (ne pas afficher si vide)
- Les photos de référence ne s'affichent que si `aUnModele` est true

### 3. `/components/Header.tsx`
- Correction du bug d'affichage causé par une syntaxe Tailwind invalide

## Comportement actuel

- **aUnModele** est calculé automatiquement : `true` si des photos sont uploadées, `false` sinon
- Tous les champs du formulaire sont maintenant sauvegardés dans Airtable
- La page de détail du projet affiche uniquement les champs remplis
- Les photos de référence ne s'affichent que si le client en a fourni

## Test

Utilisez le script `test-create-project.sh` pour tester la création d'un projet avec tous les champs :

```bash
bash test-create-project.sh
```

Le script créera un projet test et affichera la réponse JSON pour vérifier que tous les champs sont bien sauvegardés.