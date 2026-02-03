# Mapping des champs Airtable

## Champs actuellement fonctionnels
- `Nom` - Nom du client
- `Prenom` - Prénom du client  
- `Email` - Email du client
- `Telephone` - Téléphone du client
- `Description` - Description du projet
- `Date de creation` - Date de création automatique
- `Photos modele` - Photos de référence (tableau d'attachments)
- `Images` - Images du projet (tableau d'attachments)
- `Image selectionnee` - Image principale sélectionnée

## Champs à vérifier dans Airtable
Les champs suivants doivent être créés ou vérifiés dans votre base Airtable :

### Si ces champs n'existent pas, créez-les dans Airtable :
1. `Type de bijou` - Single select field avec les options :
   - Alliance
   - Bague de Fiançailles
   - Chevalière
   - Bague autre
   - Collier
   - Pendentif
   - Boucle d'oreille
   - Bracelet
   - Percing
   - Bijoux autre

2. `A un modele` - Checkbox field (case à cocher)
3. `Occasion` - Single line text
4. `Pour qui` - Single line text
5. `Budget` - Single line text ou Number
6. `Date de livraison` - Date field
7. `Gravure` - Single line text

## Comment vérifier/créer les champs dans Airtable

1. Allez dans votre base Airtable
2. Cliquez sur le "+" à droite des colonnes existantes
3. Créez chaque champ avec le nom EXACT et le type indiqué
4. Une fois créés, décommentez les lignes correspondantes dans `/lib/airtable.ts`

## Noms de champs sensibles à la casse
Airtable est sensible à la casse et aux espaces. Assurez-vous que :
- Les espaces sont respectés (ex: "Date de creation" et non "Date_de_creation")
- La casse est exacte (ex: "Photos modele" et non "Photos Modele")