import { NextRequest, NextResponse } from 'next/server';
import { createUploadService } from '@/lib/upload-service';

export async function GET(request: NextRequest) {
  console.log('[test-github-upload] Début du test');
  
  try {
    // Créer le service d'upload
    const uploadService = createUploadService();
    
    // Créer une image de test simple (1x1 pixel rouge)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    
    const filename = `test-${Date.now()}.png`;
    console.log('[test-github-upload] Test upload avec filename:', filename);
    
    // Tenter l'upload
    const url = await uploadService.uploadImage(testImageBase64, filename);
    
    console.log('[test-github-upload] Upload réussi:', url);
    
    return NextResponse.json({
      success: true,
      filename,
      url,
      provider: process.env.UPLOAD_PROVIDER
    });
    
  } catch (error: any) {
    console.error('[test-github-upload] Erreur:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      provider: process.env.UPLOAD_PROVIDER
    }, { status: 500 });
  }
}