import { NextRequest, NextResponse } from 'next/server';
import { GPTImageJewelryServiceV2 } from '@/lib/gpt-image-jewelry-service-v2';
import { createUploadService } from '@/lib/upload-service';
import { TypeBijou } from '@/types';

export async function GET(request: NextRequest) {
  console.log('[TEST API] Démarrage du test');
  
  const testProjet = {
    typeBijou: 'Bague' as TypeBijou,
    budget: '5000',
    description: 'Test de génération d\'image',
    occasion: 'Test',
    pourQui: 'Test',
  };
  
  try {
    // 1. Vérifier les variables d'environnement
    const envCheck = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'Set' : 'Not set',
      UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER || 'Not set',
    };
    console.log('[TEST API] Env check:', envCheck);
    
    // 2. Tester la génération d'une image
    console.log('[TEST API] Test de génération d\'image...');
    const result = await GPTImageJewelryServiceV2.generateJewelryImage(testProjet, {
      quality: 'standard',
      returnBase64: false
    });
    
    console.log('[TEST API] Image générée:', result.imageUrl);
    
    // 3. Tester l'upload GitHub
    const uploadService = createUploadService();
    console.log('[TEST API] Test upload GitHub...');
    
    // Créer une petite image de test
    const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const uploadUrl = await uploadService.uploadImage(testBase64, 'test-api.png');
    
    console.log('[TEST API] Upload réussi:', uploadUrl);
    
    return NextResponse.json({
      success: true,
      envCheck,
      imageGenerated: result.imageUrl,
      uploadTest: uploadUrl,
      prompt: result.prompt,
    });
    
  } catch (error) {
    console.error('[TEST API] Erreur:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      envCheck: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
        GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'Set' : 'Not set',
        UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER || 'Not set',
      }
    }, { status: 500 });
  }
}