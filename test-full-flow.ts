// Test complet : génération d'image + upload GitHub
import dotenv from 'dotenv';
import { GPTImageJewelryServiceV2 } from './lib/gpt-image-jewelry-service-v2';
import { createUploadService } from './lib/upload-service';
import { Projet } from './types';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

async function testFullFlow() {
  console.log('Test complet : Génération + Upload GitHub...');
  
  const testProjet: Partial<Projet> = {
    nom: 'Test',
    prenom: 'Complet',
    typeBijou: 'Bague',
    budget: '5000',
    occasion: 'Mariage',
    pourQui: 'Ma future épouse',
    description: 'Une bague de fiançailles élégante avec un diamant central',
    gravure: 'Pour toujours'
  };
  
  try {
    // 1. Générer l'image
    console.log('\n1. Génération de l\'image...');
    const result = await GPTImageJewelryServiceV2.generateJewelryImage(testProjet, {
      quality: 'standard',
      returnBase64: false
    });
    
    console.log('✅ Image générée avec succès');
    console.log('URL OpenAI:', result.imageUrl);
    
    // 2. Convertir en base64
    console.log('\n2. Conversion en base64...');
    const response = await fetch(result.imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
    
    console.log('✅ Image convertie en base64');
    
    // 3. Upload vers GitHub
    console.log('\n3. Upload vers GitHub...');
    const uploadService = createUploadService();
    const publicUrl = await uploadService.uploadImage(base64, 'test-generation-complete.png');
    
    console.log('✅ Image uploadée vers GitHub');
    console.log('URL publique permanente:', publicUrl);
    
    console.log('\n🎉 Test complet réussi !');
    console.log('L\'image a été générée et uploadée avec succès.');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testFullFlow();