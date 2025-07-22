#!/bin/bash

# Script de test pour créer un projet avec tous les champs

echo "Test de création d'un projet avec tous les champs..."

curl -X POST http://localhost:3000/api/projets \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Marie",
    "email": "marie.dupont@example.com",
    "telephone": "0612345678",
    "typeBijou": "Bague de Fiançailles",
    "description": "Une bague de fiançailles moderne avec un diamant central",
    "aUnModele": false,
    "occasion": "Fiançailles",
    "pourQui": "à offrir",
    "budget": "5000",
    "dateLivraison": "2024-03-15",
    "gravure": "Marie & Pierre - 14.02.2024",
    "photosModele": []
  }' | jq .

echo -e "\n\nRésultat attendu: Le projet doit être créé avec tous les champs sauvegardés dans Airtable."
echo "Vérifiez que les champs suivants sont bien présents dans la réponse :"
echo "- occasion"
echo "- pourQui"
echo "- budget"
echo "- dateLivraison"
echo "- gravure"
echo "- aUnModele (calculé automatiquement)"