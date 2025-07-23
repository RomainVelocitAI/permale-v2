// Test direct de l'API generate-image-v2
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

async function testGenerateAPI() {
  console.log('Test de l\'API generate-image-v2...');
  
  const testProjet = {
    nom: 'Test',
    prenom: 'API',
    email: 'test@test.com',
    telephone: '0123456789',
    typeBijou: 'Bague',
    budget: '5000',
    occasion: 'Mariage',
    pourQui: 'Ma future épouse',
    description: 'Une bague de fiançailles élégante avec un diamant central',
    gravure: 'Pour toujours',
    dateCreation: new Date().toISOString()
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-image-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projetId: 'test-123',
        projet: testProjet,
        mode: 'test',
        generateMultiple: false
      }),
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Succès! Réponse:', JSON.stringify(data, null, 2));
    
    if (data.result && data.result.images) {
      console.log('\nImages générées:');
      data.result.images.forEach((img: any, index: number) => {
        console.log(`Image ${index + 1}:`);
        console.log('- URL OpenAI:', img.url);
        console.log('- URL publique GitHub:', img.publicUrl);
      });
    }
  } catch (error) {
    console.error('Erreur lors du test:', error);
  }
}

testGenerateAPI();