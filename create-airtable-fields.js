const Airtable = require('airtable');
require('dotenv').config({ path: '.env.local' });

// Configuration
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID || 'appXBgsSjbSGjAGqA';

if (!apiKey) {
  console.error('❌ AIRTABLE_API_KEY n\'est pas défini dans .env.local');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

async function checkAndCreateImageFields() {
  console.log('=== Vérification des champs images dans Airtable ===\n');
  console.log('Base ID:', baseId);
  console.log('Table: Projets\n');

  try {
    // Récupérer tous les enregistrements pour analyser les champs existants
    const records = await base('Projets').select({
      maxRecords: 3
    }).firstPage();

    if (records.length === 0) {
      console.log('⚠️ Aucun enregistrement trouvé dans la table Projets');
      console.log('Créez d\'abord un projet depuis l\'application.\n');
      return;
    }

    console.log(`✅ ${records.length} enregistrement(s) trouvé(s)\n`);

    // Analyser les champs existants
    const firstRecord = records[0];
    const existingFields = Object.keys(firstRecord.fields);
    
    console.log('Champs existants dans la table:');
    existingFields.forEach(field => {
      console.log(`  - ${field}`);
    });
    console.log();

    // Vérifier la présence des champs images requis
    const requiredImageFields = [
      'imageIA1',
      'imageIA2', 
      'imageIA3',
      'imageIA4',
      'imageIA5',
      'Image selectionnee'
    ];

    const missingFields = [];
    const existingImageFields = [];

    requiredImageFields.forEach(field => {
      if (existingFields.includes(field)) {
        existingImageFields.push(field);
      } else {
        missingFields.push(field);
      }
    });

    if (existingImageFields.length > 0) {
      console.log('✅ Champs images déjà présents:');
      existingImageFields.forEach(field => {
        const value = firstRecord.get(field);
        console.log(`  - ${field}: ${value || '(vide)'}`);
      });
      console.log();
    }

    if (missingFields.length > 0) {
      console.log('❌ Champs images manquants:');
      missingFields.forEach(field => {
        console.log(`  - ${field}`);
      });
      console.log('\n' + '='.repeat(60));
      console.log('INSTRUCTIONS POUR CRÉER LES CHAMPS MANQUANTS:');
      console.log('='.repeat(60) + '\n');
      console.log('1. Connectez-vous sur https://airtable.com');
      console.log('2. Ouvrez la base "Joaillerie Siva"');
      console.log('3. Allez dans la table "Projets"');
      console.log('4. Pour chaque champ manquant ci-dessus:');
      console.log('   a. Cliquez sur "+ Add field" ou "+ Ajouter un champ"');
      console.log('   b. Nom du champ: copiez exactement le nom (ex: imageIA1)');
      console.log('   c. Type de champ: choisissez "Single line text" ou "URL"');
      console.log('   d. Cliquez sur "Create field" ou "Créer le champ"');
      console.log('\n5. Une fois tous les champs créés, relancez ce script pour vérifier');
      console.log('   ou testez directement depuis l\'application web.\n');
    } else {
      console.log('✨ Tous les champs images sont présents!\n');
      
      // Tester l'ajout d'une image dans un champ
      console.log('Test d\'ajout d\'une image...');
      const testImageUrl = 'https://raw.githubusercontent.com/RomainVelocitAI/permale-images/main/test-jewelry.jpg';
      
      try {
        await base('Projets').update(firstRecord.id, {
          'imageIA1': testImageUrl
        });
        console.log('✅ Test réussi! Les champs sont fonctionnels.');
        console.log('   L\'image test a été ajoutée dans imageIA1.');
        console.log('   Vous pouvez maintenant utiliser l\'application normalement.\n');
      } catch (updateError) {
        console.error('❌ Erreur lors du test:', updateError.message);
      }
    }

    // Afficher les valeurs actuelles des champs images
    if (existingImageFields.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('VALEURS ACTUELLES DES CHAMPS IMAGES:');
      console.log('='.repeat(60) + '\n');
      
      records.forEach((record, index) => {
        const nom = record.get('Nom') || 'Sans nom';
        const prenom = record.get('Prenom') || '';
        console.log(`Projet ${index + 1}: ${prenom} ${nom} (ID: ${record.id})`);
        
        existingImageFields.forEach(field => {
          const value = record.get(field);
          if (value) {
            console.log(`  ${field}: ${value.substring(0, 50)}...`);
          }
        });
        console.log();
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.statusCode === 401) {
      console.error('\n⚠️ Erreur d\'authentification. Vérifiez votre AIRTABLE_API_KEY dans .env.local');
    } else if (error.statusCode === 404) {
      console.error('\n⚠️ Base ou table non trouvée. Vérifiez:');
      console.error('   - AIRTABLE_BASE_ID dans .env.local');
      console.error('   - Que la table "Projets" existe bien');
    }
  }
}

// Exécuter le script
checkAndCreateImageFields().catch(console.error);