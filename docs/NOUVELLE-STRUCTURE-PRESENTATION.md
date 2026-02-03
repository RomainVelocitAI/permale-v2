# Nouvelle Structure de la Page de Présentation

## Modifications demandées

### ❌ À SUPPRIMER
- **Slide "Nos créations exclusives"** (Section 3 actuelle) - Cette slide sera complètement supprimée

### ✏️ SLIDES À MODIFIER

#### Slide 2 : "Votre Vision" 
- **Modification** : Ajouter l'image du champ `imageSelectionnee` (l'image choisie par le client)
- **Disposition** : L'image sera affichée à côté ou en arrière-plan des informations du projet

### ✅ NOUVELLES SLIDES À AJOUTER

#### Nouvelle Slide 3 : "L'Essence du Bijou" (Photo couchée)
- **Image** : `imagePres1` - Photo du bijou posé à plat
- **Texte poétique selon le type de bijou** :
  - **Alliance** : "Deux âmes qui s'entrelacent dans l'or éternel, un cercle sans fin où l'amour trouve son sanctuaire."
  - **Bague de Fiançailles** : "Une promesse scintillante, capturant la lumière comme votre cœur capture l'amour."
  - **Collier** : "Tel un ruisseau d'or et de lumière, il serpente avec grâce, prêt à sublimer votre décolleté."
  - **Bracelet** : "Un cercle de lumière qui enlacera votre poignet, témoin silencieux de vos gestes quotidiens."
  - **Boucles d'oreilles** : "Deux étoiles jumelles prêtes à danser au gré de vos mouvements et illuminer votre visage."

#### Nouvelle Slide 4 : "Porté avec Élégance" (Bijou porté)
- **Image** : `imagePres2` - Photo du bijou porté
- **Texte poétique selon le type de bijou** :
  - **Alliance** : "Sur votre main, elle raconte déjà votre histoire. Chaque reflet capture un moment de bonheur partagé."
  - **Bague de Fiançailles** : "À votre doigt, elle devient le témoin lumineux d'un engagement unique et précieux."
  - **Collier** : "Contre votre peau, il épouse vos courbes et illumine votre beauté naturelle."
  - **Bracelet** : "À votre poignet, il danse et scintille, accompagnant chacun de vos mouvements avec élégance."
  - **Boucles d'oreilles** : "Encadrant votre visage avec grâce, elles captent la lumière à chaque sourire."

#### Nouvelle Slide 5 : "Dans son Écrin" (Bijou dans son écrin)
- **Image** : `imagePres3` - Photo du bijou dans son écrin
- **Texte poétique selon le type de bijou** :
  - **Alliance** : "Dans son écrin de velours, votre promesse attend son moment. Le début d'une histoire qui durera toujours."
  - **Bague de Fiançailles** : "Nichée dans son écrin, elle attend le moment magique où le 'oui' illuminera deux vies."
  - **Collier** : "Dans son écrin soyeux, un trésor de finesse attend de parer votre cou avec élégance."
  - **Bracelet** : "Dans son écrin protecteur, un lien précieux attend de devenir partie intégrante de votre style."
  - **Boucles d'oreilles** : "Dans leur écrin, deux complices attendent de sublimer votre beauté naturelle."

#### Nouvelle Slide 6 : "Œuvre d'Art" (Bijou sur support élégant)
- **Image** : `imagePres4` - Photo du bijou sur un joli support
- **Texte poétique selon le type de bijou** :
  - **Alliance** : "Posée délicatement, elle irradie de mille feux. Un symbole d'union façonné avec passion et savoir-faire."
  - **Bague de Fiançailles** : "Sous chaque angle, elle révèle sa beauté. Un chef-d'œuvre créé pour célébrer votre amour."
  - **Collier** : "Délicatement disposé, il révèle l'harmonie parfaite de ses maillons et l'éclat de ses pierres."
  - **Bracelet** : "Délicatement présenté, il dévoile la complexité de ses maillons et la perfection de ses finitions."
  - **Boucles d'oreilles** : "Posées avec délicatesse, elles révèlent l'équilibre parfait entre audace et raffinement."

## Ordre final des slides

1. **Introduction** (inchangée) - Logo PERMALE + nom du client
2. **L'univers PERMALE** (inchangée) - Présentation de la maison
3. **Votre Vision** (modifiée) - Infos projet + `imageSelectionnee`
4. **L'Essence du Bijou** (nouvelle) - `imagePres1` + texte poétique
5. **Porté avec Élégance** (nouvelle) - `imagePres2` + texte poétique
6. **Dans son Écrin** (nouvelle) - `imagePres3` + texte poétique
7. **Œuvre d'Art** (nouvelle) - `imagePres4` + texte poétique
8. **Investissement** (inchangée) - Tarif et détails
9. **Nos Engagements** (inchangée) - Qualité et service
10. **Prochaine Étape** (inchangée) - Contact et suite

## Structure des données nécessaires

### Champs Airtable utilisés
- `imageSelectionnee` : Image choisie par le client (slide 3)
- `imagePres1` : Photo du bijou couché (slide 4)
- `imagePres2` : Photo du bijou porté (slide 5)
- `imagePres3` : Photo du bijou dans son écrin (slide 6)
- `imagePres4` : Photo du bijou sur support (slide 7)
- `typeBijou` : Type de bijou pour sélectionner les bons textes

### Logique de sélection des textes
Les textes sont sélectionnés automatiquement selon le `typeBijou` du projet. Un fichier `presentation-texts.ts` contient tous les textes organisés par type de bijou.

## Design des nouvelles slides

### Style visuel
- **Fond** : Fond sombre #363d43 (cohérent avec le reste)
- **Images** : Grande taille, mise en valeur maximale
- **Texte** : Police élégante, couleur #efefef, positionnement poétique
- **Animation** : Transitions douces avec Framer Motion

### Layout proposé pour les nouvelles slides
```
+----------------------------------+
|                                  |
|         IMAGE (70% hauteur)      |
|                                  |
|                                  |
+----------------------------------+
|                                  |
|     TEXTE POÉTIQUE (30%)         |
|         (centré, élégant)        |
|                                  |
+----------------------------------+
```

## Points d'attention

1. **Vérification des images** : S'assurer que les 4 images de présentation sont bien remplies
2. **Fallback** : Si une image manque, afficher un placeholder élégant
3. **Responsive** : Adapter le layout pour mobile/tablette
4. **Performance** : Optimiser le chargement des images avec Next.js Image

## Validation requise

Merci de confirmer :
- [ ] La suppression de la slide "Nos créations exclusives"
- [ ] L'ajout de l'image sélectionnée dans "Votre Vision"
- [ ] L'ajout des 4 nouvelles slides avec les images de présentation
- [ ] Les textes poétiques pour chaque type de bijou
- [ ] L'ordre final des 10 slides

Une fois validé, je procéderai aux modifications du code.