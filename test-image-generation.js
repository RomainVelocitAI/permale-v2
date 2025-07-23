#!/usr/bin/env node

// Script de test pour la génération d'images
async function testImageGeneration() {
  console.log('🧪 Test de génération d\'images...\n');
  
  const testProjet = {
    typeBijou: 'Bague de Fiançailles',
    description: 'Une magnifique bague en or blanc avec un diamant solitaire',
    gravure: 'Pour toujours',
    occasion: 'Demande en mariage',
    pourQui: 'Ma fiancée',
    budget: '5000'
  };
  
  try {
    // D'abord, se connecter pour obtenir le cookie d'authentification
    console.log('🔐 Connexion en cours...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'siva@permale.com',
        password: 'Azalees2025'
      }),
    });
    
    const authCookie = loginResponse.headers.get('set-cookie');
    console.log('✅ Authentifié avec succès');
    
    console.log('\n📡 Appel de l\'API de génération d\'images...');
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie || ''
      },
      body: JSON.stringify({
        projet: testProjet,
        projetId: null, // Test sans ID de projet pour le moment
        mode: 'test',
        generateMultiple: false
      }),
    });
    
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    console.log('\n📊 Réponse de l\'API:');
    console.log('Status:', response.status);
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(text);
      
      if (response.ok) {
        console.log('\n✅ Génération réussie !');
        console.log('- Modèle utilisé:', data.result.model);
        console.log('- Nombre d\'images:', data.result.count);
        console.log('- Coût estimé:', data.estimatedCost, '€');
        console.log('- Prompt généré:', data.result.prompt);
        
        if (data.result.images && data.result.images.length > 0) {
          console.log('\n🖼️  URLs des images générées:');
          data.result.images.forEach((img, index) => {
            console.log(`  ${index + 1}. URL OpenAI: ${img.url.substring(0, 50)}...`);
            if (img.publicUrl) {
              console.log(`     URL GitHub: ${img.publicUrl}`);
            }
          });
        }
      } else {
        console.error('\n❌ Erreur lors de la génération:');
        console.error('Message:', data.error);
        if (data.details) {
          console.error('Détails:', data.details);
        }
      }
    } else {
      console.error('\n❌ Réponse non-JSON:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
  }
}

// Lancer le test
testImageGeneration();