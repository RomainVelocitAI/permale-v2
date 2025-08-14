import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projetId, imageSelectionnee, typeBijou, description } = body;

    if (!projetId || !imageSelectionnee || !typeBijou) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    console.log('[Generate Presentation] Début génération des 4 images pour projet:', projetId);
    console.log('[Generate Presentation] Type de bijou:', typeBijou);
    console.log('[Generate Presentation] Image sélectionnée:', imageSelectionnee);

    // Préparer les données pour le webhook n8n
    const webhookData = {
      projetId,
      imageSelectionnee,
      typeBijou,
      description: description || '',
      timestamp: new Date().toISOString()
    };

    // URL du webhook n8n pour la génération des images de présentation
    const webhookUrl = process.env.N8N_WEBHOOK_PRESENTATION || 
      'https://n8n.srv765302.hstgr.cloud/webhook/d95d6fdf-5edc-4803-b8f4-4874161e2fee';

    console.log('[Generate Presentation] Envoi webhook n8n:', webhookUrl);
    console.log('[Generate Presentation] Données:', JSON.stringify(webhookData, null, 2));

    // Appel du webhook n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Generate Presentation] Erreur webhook:', response.status, errorText);
      throw new Error(`Erreur webhook: ${response.status}`);
    }

    const result = await response.json().catch(() => ({ success: true }));
    console.log('[Generate Presentation] Réponse webhook:', result);

    return NextResponse.json({
      success: true,
      message: 'Génération des images de présentation lancée',
      projetId
    });

  } catch (error) {
    console.error('[Generate Presentation] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des images de présentation' },
      { status: 500 }
    );
  }
}