const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Configuration
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID || 'appXBgsSjbSGjAGqA';

if (!apiKey) {
  console.error('❌ AIRTABLE_API_KEY n\'est pas défini dans .env.local');
  process.exit(1);
}

async function createImageFields() {
  console.log('=== Création automatique des champs images dans Airtable ===\n');
  console.log('Base ID:', baseId);
  
  try {
    // D'abord, récupérer les métadonnées de la base pour obtenir l'ID de la table
    const baseMetaResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!baseMetaResponse.ok) {
      const error = await baseMetaResponse.text();
      throw new Error(`Erreur lors de la récupération des métadonnées: ${error}`);
    }

    const baseMeta = await baseMetaResponse.json();
    const projetsTable = baseMeta.tables.find(t => t.name === 'Projets');
    
    if (!projetsTable) {
      throw new Error('Table "Projets" non trouvée');
    }

    const tableId = projetsTable.id;
    console.log('Table trouvée:', projetsTable.name, '(ID:', tableId, ')\n');

    // Vérifier les champs existants
    const existingFields = projetsTable.fields.map(f => f.name);
    console.log('Champs existants:', existingFields.join(', '), '\n');

    // Définir les champs images à créer
    const imageFields = [
      { name: 'imageIA1', description: 'Image IA générée 1' },
      { name: 'imageIA2', description: 'Image IA générée 2' },
      { name: 'imageIA3', description: 'Image IA générée 3' },
      { name: 'imageIA4', description: 'Image IA générée 4' },
      { name: 'imageIA5', description: 'Image IA générée 5' },
      { name: 'Image selectionnee', description: 'Image sélectionnée pour la présentation' }
    ];

    const fieldsToCreate = imageFields.filter(field => !existingFields.includes(field.name));

    if (fieldsToCreate.length === 0) {
      console.log('✅ Tous les champs images sont déjà présents!');
      return;
    }

    console.log('Champs à créer:', fieldsToCreate.map(f => f.name).join(', '), '\n');

    // Créer chaque champ manquant
    for (const field of fieldsToCreate) {
      console.log(`Création du champ "${field.name}"...`);
      
      const createResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: field.name,
          type: 'singleLineText',
          description: field.description
        })
      });

      if (createResponse.ok) {
        const result = await createResponse.json();
        console.log(`✅ Champ "${field.name}" créé avec succès (ID: ${result.id})`);
      } else {
        const error = await createResponse.text();
        console.error(`❌ Erreur lors de la création du champ "${field.name}":`, error);
      }
    }

    console.log('\n✨ Processus terminé!');
    console.log('Les champs images ont été créés dans Airtable.');
    console.log('Vous pouvez maintenant utiliser l\'application pour gérer les images.');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('401')) {
      console.error('\n⚠️ Erreur d\'authentification.');
      console.error('Vérifiez que votre API key a les permissions nécessaires pour modifier le schéma.');
      console.error('Vous devrez peut-être créer les champs manuellement dans l\'interface Airtable.');
    }
  }
}

// Exécuter le script
createImageFields().catch(console.error);