import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Envoyer la requête vers le webhook n8n depuis le serveur (pas de CORS)
    const response = await fetch('https://n8n.srv765302.hstgr.cloud/webhook-test/15858794-d642-449a-9fba-5f8616fe7ba9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    const data = await response.text();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Modification envoyée avec succès',
      data 
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi au webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de l\'envoi de la demande de modification' 
      },
      { status: 500 }
    );
  }
}