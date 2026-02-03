#!/bin/bash

# Script pour créer un projet de test dans Airtable
# Utilise curl pour envoyer une requête POST à l'API

echo "Création d'un projet de test..."

# Les images de test (vous pouvez les remplacer par de vraies URLs d'images)
curl -X POST http://localhost:3000/api/projets \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Marie",
    "email": "marie.dupont@example.com",
    "telephone": "0612345678",
    "typeBijou": "Bague de Fiançailles",
    "description": "Je souhaite une bague de fiançailles unique pour ma demande. Jaime les designs modernes avec une touche vintage. La pierre centrale doit être un diamant rond denviron 1 carat, serti sur un anneau en or blanc. Jaimerais des détails subtils sur la monture, peut-être avec de petits diamants sur les côtés. Le style doit être élégant mais pas trop chargé, quelque chose quelle pourra porter tous les jours.",
    "occasion": "Demande en mariage",
    "pourQui": "Ma fiancée",
    "budget": "8000",
    "dateLivraison": "2024-02-14",
    "gravure": "Pour toujours, Marie & Pierre",
    "photosModele": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800"
    ]
  }'

echo ""
echo "Projet de test créé ! Vérifiez dans Airtable."
echo ""
echo "Pour tester la page de présentation :"
echo "1. Notez l'ID du record dans Airtable (commence par 'rec....')"
echo "2. Visitez : http://localhost:3000/dupont-marie-[ID_RECORD]"
echo ""
echo "Pour ajouter des images IA de test, mettez à jour le record dans Airtable avec :"
echo "- imageIA1: https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
echo "- imageIA2: https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800"
echo "- imageIA3: https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800"
echo "- imageIA4: https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800"
echo "- imageIA5: https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"