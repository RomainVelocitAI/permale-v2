// Test direct du service GPT Image
import dotenv from 'dotenv';
import { GPTImageJewelryServiceV2 } from './lib/gpt-image-jewelry-service-v2';
import { Projet } from './types';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

async function testGPTService() {
  console.log('Test du service GPT Image...');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Défini' : 'Non défini');
  
  const testProjet: Partial<Projet> = {
    nom: 'Test',
    prenom: 'API',
    typeBijou: 'Bague',
    budget: '5000',
    occasion: 'Mariage',
    pourQui: 'Ma future épouse',
    description: 'Une bague de fiançailles élégante avec un diamant central',
    gravure: 'Pour toujours'
  };
  
  try {
    console.log('\nGénération d\'une image...');
    const result = await GPTImageJewelryServiceV2.generateJewelryImage(testProjet, {
      quality: 'standard',
      returnBase64: false
    });
    
    console.log('\n✅ Succès!');
    console.log('Prompt utilisé:', result.prompt);
    console.log('URL de l\'image:', result.imageUrl);
    console.log('Méthode de génération:', result.generationMethod);
    console.log('Coût estimé:', result.estimatedCost);
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testGPTService();