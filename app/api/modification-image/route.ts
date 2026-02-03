import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API /modification-image] Received request:', JSON.stringify(body, null, 2));
    
    // Envoyer la requête vers le webhook n8n depuis le serveur (pas de CORS)
    console.log('[API /modification-image] Sending to n8n webhook...');
    
    const response = await fetch('https://n8n.srv765302.hstgr.cloud/webhook/15858794-d642-449a-9fba-5f8616fe7ba9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[API /modification-image] n8n response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API /modification-image] n8n error response:', errorText);
      throw new Error(`Webhook responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.text();
    console.log('[API /modification-image] n8n success response:', data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Modification envoyée avec succès',
      data 
    });
  } catch (error) {
    console.error('[API /modification-image] Error details:', error);
    
    // Renvoyer plus de détails sur l'erreur
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'envoi de la demande de modification',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}