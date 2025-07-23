// Test de l'upload GitHub
require('dotenv').config({ path: '.env.local' });
const { createUploadService } = require('./lib/upload-service.ts');

async function testUpload() {
  console.log('Test de l\'upload GitHub...');
  console.log('Provider:', process.env.UPLOAD_PROVIDER);
  console.log('GitHub Owner:', process.env.GITHUB_OWNER);
  console.log('GitHub Repo:', process.env.GITHUB_REPO);
  console.log('GitHub Token:', process.env.GITHUB_TOKEN ? 'Défini' : 'Non défini');
  
  try {
    const uploadService = createUploadService();
    
    // Créer une image de test base64
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    console.log('\nTentative d\'upload...');
    const url = await uploadService.uploadImage(testImage, 'test-upload.png');
    console.log('✅ Upload réussi!');
    console.log('URL:', url);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testUpload();