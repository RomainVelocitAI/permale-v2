#!/usr/bin/env node

/**
 * Script de test pour la génération de prompts avec GPT-4.1 Nano
 * Usage: npx tsx scripts/test-gpt-nano-generation.ts
 */

import { GPTImageJewelryServiceV2 } from '../lib/gpt-image-jewelry-service-v2';
import { Projet } from '../types';

// Exemples de projets pour tester
const testProjects: Partial<Projet>[] = [
  {
    typeBijou: 'Bague de Fiançailles',
    budget: '3000€',
    description: 'Solitaire classique avec diamant rond brillant, monture en or blanc',
    occasion: 'Demande en mariage',
    pourQui: 'pour elle',
    gravure: 'A & M - 14.02.2024'
  },
  {
    typeBijou: 'Alliance',
    budget: '1500€',
    description: 'Alliance moderne avec diamants sertis, style épuré',
    occasion: 'Mariage',
    pourQui: 'pour moi',
  },
  {
    typeBijou: 'Collier',
    budget: '2000€',
    description: 'Collier avec pendentif en forme de cœur, saphir central entouré de diamants',
    occasion: 'Anniversaire',
    pourQui: 'pour elle',
    gravure: 'Mon amour éternel'
  },
  {
    typeBijou: 'Bracelet',
    budget: '800€',
    description: 'Bracelet tennis minimaliste en argent avec petits diamants',
    occasion: 'Cadeau quotidien',
    pourQui: 'pour moi'
  }
];

async function testPromptGeneration() {
  console.log('=== Test de Génération de Prompts avec GPT-4.1 Nano ===\n');

  for (let i = 0; i < testProjects.length; i++) {
    const project = testProjects[i];
    console.log(`\n--- Test ${i + 1}: ${project.typeBijou} ---`);
    console.log('Données du projet:', JSON.stringify(project, null, 2));

    try {
      // Test 1: Générer uniquement le prompt
      console.log('\n1. Génération du prompt seul...');
      const prompt = await GPTImageJewelryServiceV2.previewPrompt(project);
      console.log('Prompt généré:', prompt);

      // Vérifier la présence de la triple vue
      const hasTripleView = prompt.toLowerCase().includes('three views');
      console.log('✓ Triple vue présente:', hasTripleView ? 'OUI ✅' : 'NON ❌');

      // Test 2: Comparer avec l'ancien système
      console.log('\n2. Comparaison ancien vs nouveau système...');
      const comparison = await GPTImageJewelryServiceV2.comparePrompts(project);
      
      console.log('\nAncien prompt:', comparison.oldPrompt);
      console.log('\nNouveau prompt:', comparison.newPrompt);
      console.log('\nAméliorations détectées:');
      comparison.improvements.forEach(improvement => {
        console.log(`  ${improvement}`);
      });

      // Test 3: Générer l'image (optionnel - commenté pour économiser les coûts)
      // console.log('\n3. Génération de l\'image...');
      // const imageResult = await GPTImageJewelryServiceV2.generateJewelryImage(project, {
      //   quality: 'low',
      //   returnBase64: false
      // });
      // console.log('Image générée:', imageResult.imageUrl);
      // console.log('Méthode de génération:', imageResult.generationMethod);

    } catch (error) {
      console.error('❌ Erreur:', error);
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Fonction pour tester un cas spécifique
async function testSpecificCase() {
  console.log('\n=== Test Cas Spécifique: Chevalière Luxueuse ===\n');

  const luxuryProject: Partial<Projet> = {
    typeBijou: 'Chevalière',
    budget: '10000€',
    description: 'Chevalière massive en or jaune 18 carats avec onyx noir central, entourage de diamants, gravure familiale complexe, style art déco',
    occasion: 'Héritage familial',
    pourQui: 'pour lui',
    gravure: 'Famille Dupont - Fides et Honor - Est. 1850'
  };

  try {
    const prompt = await GPTImageJewelryServiceV2.previewPrompt(luxuryProject);
    console.log('Prompt généré pour chevalière de luxe:\n');
    console.log(prompt);

    // Analyser le prompt
    console.log('\n--- Analyse du prompt ---');
    console.log('Longueur:', prompt.length, 'caractères');
    console.log('Contient "three views":', prompt.toLowerCase().includes('three views') ? '✅' : '❌');
    console.log('Contient "signet ring":', prompt.toLowerCase().includes('signet ring') ? '✅' : '❌');
    console.log('Contient la gravure:', prompt.includes(luxuryProject.gravure!) ? '✅' : '❌');
    console.log('Langue principale:', prompt.match(/[a-zA-Z]/g)!.length > prompt.length * 0.8 ? 'Anglais ✅' : 'Mixte ⚠️');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter les tests
async function main() {
  // Vérifier la configuration
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERREUR: OPENAI_API_KEY manquant dans l\'environnement');
    console.log('Configurez la clé API avec: export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('Configuration OK ✅');
  console.log('Utilisation du modèle: gpt-4.1-nano\n');

  // Exécuter les tests
  await testPromptGeneration();
  await testSpecificCase();

  console.log('\n✅ Tests terminés!');
}

// Lancer le script
main().catch(console.error);