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
    
    // 3. Tester l'upload GitHub avec l'image générée
    const uploadService = createUploadService();
    console.log('[TEST API] Test upload GitHub avec image générée...');
    
    // Télécharger l'image générée et la convertir correctement
    const imageResponse = await fetch(result.imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Erreur téléchargement image: ${imageResponse.status}`);
    }
    
    const contentType = imageResponse.headers.get('content-type');
    console.log('[TEST API] Type de contenu:', contentType);
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Vérifier que l'image n'est pas vide
    if (buffer.length === 0) {
      throw new Error('Buffer vide reçu');
    }
    
    console.log('[TEST API] Taille image téléchargée:', buffer.length, 'bytes');
    console.log('[TEST API] Premiers bytes:', buffer.slice(0, 20).toString('hex'));
    
    // Vérifier la signature PNG
    const pngSignature = buffer.slice(0, 8).toString('hex');
    const isPNG = pngSignature === '89504e470d0a1a0a';
    console.log('[TEST API] Signature PNG valide:', isPNG, 'Signature:', pngSignature);
    
    // Créer la data URL avec le bon format
    const base64String = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64String}`;
    
    // Upload vers GitHub
    const uploadUrl = await uploadService.uploadImage(dataUrl, 'test-api-generated.png');
    
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