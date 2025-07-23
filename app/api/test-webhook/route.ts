import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('[test-webhook] Test du webhook n8n');
  
  try {
    // Données de test
    const testData = {
      projetId: 'test-' + Date.now(),
      nom: 'Test',
      prenom: 'Webhook',
      email: 'test@example.com',
      telephone: '0123456789',
      typeDeBijou: 'Bague',
      budget: '2000',
      description: 'Test de webhook',
      occasion: 'Test',
      pourQui: 'Test',
      timestamp: new Date().toISOString(),
      source: 'test-webhook'
    };
    
    console.log('[test-webhook] Données de test:', JSON.stringify(testData, null, 2));
    console.log('[test-webhook] URL:', 'https://n8n.srv765302.hstgr.cloud/webhook-test/009df7aa-4fa9-4e60-b0e1-b7bf2bc3d3bd');
    
    // Appel webhook
    const response = await fetch('https://n8n.srv765302.hstgr.cloud/webhook-test/009df7aa-4fa9-4e60-b0e1-b7bf2bc3d3bd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('[test-webhook] Response status:', response.status);
    console.log('[test-webhook] Response statusText:', response.statusText);
    console.log('[test-webhook] Response headers:', Array.from(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('[test-webhook] Response body:', responseText);
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      sentData: testData
    });
    
  } catch (error: any) {
    console.error('[test-webhook] Erreur:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}