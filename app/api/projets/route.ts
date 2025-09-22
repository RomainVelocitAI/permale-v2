import { NextRequest, NextResponse } from 'next/server';
import { createProjet, getAllProjets, getProjetById, updateProjet } from '@/lib/airtable';
import { createUploadService } from '@/lib/upload-service';

// GET - Récupérer tous les projets ou un projet spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Récupérer un projet spécifique
      const projet = await getProjetById(id);
      if (!projet) {
        return NextResponse.json(
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }
      return NextResponse.json(projet);
    } else {
      // Récupérer tous les projets
      const projets = await getAllProjets();
      return NextResponse.json(projets);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // No validation - all fields are optional

    // Gérer l'upload des images si présentes
    let uploadedPhotosUrls: string[] = [];
    if (body.photosModele && body.photosModele.length > 0) {
      console.log('[POST /api/projets] Photos modèle reçues:', body.photosModele.length);
      const uploadService = createUploadService();

      // Extraire les données et noms de fichiers
      const imagesData = body.photosModele.map((photo: { data: string; filename: string }) => photo.data);
      const filenames = body.photosModele.map((photo: { data: string; filename: string }) => photo.filename);
      console.log('[POST /api/projets] Filenames:', filenames);

      try {
        // Upload les images et récupérer les URLs
        console.log('[POST /api/projets] Début upload des photos modèle...');
        uploadedPhotosUrls = await uploadService.uploadImages(imagesData, filenames);
        console.log('[POST /api/projets] Photos modèle uploadées avec succès:', uploadedPhotosUrls);
      } catch (uploadError) {
        // En cas d'erreur d'upload, on log l'erreur mais on continue
        console.error('[POST /api/projets] Erreur upload photos modèle:', uploadError);
        console.error('[POST /api/projets] Stack trace:', uploadError instanceof Error ? uploadError.stack : '');
      }
    } else {
      console.log('[POST /api/projets] Aucune photo modèle reçue');
    }

    // Gérer l'upload des images générées par IA
    let uploadedGeneratedUrls: string[] = [];
    if (body.imagesGenerated && body.imagesGenerated.length > 0) {
      const uploadService = createUploadService();
      
      // Extraire les données et noms de fichiers
      const imagesData = body.imagesGenerated.map((photo: { data: string; filename: string }) => photo.data);
      const filenames = body.imagesGenerated.map((photo: { data: string; filename: string }) => photo.filename);
      
      try {
        // Upload les images et récupérer les URLs
        uploadedGeneratedUrls = await uploadService.uploadImages(imagesData, filenames);
      } catch (uploadError) {
        // En cas d'erreur d'upload, on continue sans les images
      }
    }

    // Créer le projet dans Airtable
    console.log('[POST /api/projets] Création du projet Airtable avec photos:', uploadedPhotosUrls);
    const nouveauProjet = await createProjet({
      nom: body.nom || '',
      prenom: body.prenom || '',
      email: body.email || '',
      telephone: body.telephone || '',
      typeBijou: body.typeBijou || '',
      description: body.description || '',
      aUnModele: body.aUnModele || false,
      photosModele: uploadedPhotosUrls, // Utiliser les URLs uploadées
      occasion: body.occasion || '',
      pourQui: body.pourQui || '',
      budget: body.budget || '',
      dateLivraison: body.dateLivraison || '',
      gravure: body.gravure || '',
      images: uploadedGeneratedUrls, // Ajouter les images générées par IA
      imageSelectionnee: uploadedGeneratedUrls.length > 0 ? uploadedGeneratedUrls[0] : undefined,
    });

    // Envoi webhook n8n avec toutes les données du projet
    if (nouveauProjet.id) {
      const webhookData = {
        // ID Airtable du projet
        projetId: nouveauProjet.id,
        
        // Données du projet
        nom: body.nom || '',
        prenom: body.prenom || '',
        email: body.email || '',
        telephone: body.telephone || '',
        typeDeBijou: body.typeBijou || '',
        budget: body.budget || '',
        description: body.description || '',
        occasion: body.occasion || '',
        pourQui: body.pourQui || '',
        gravure: body.gravure || '',
        dateDeLivraison: body.dateLivraison || '',
        photosModele: uploadedPhotosUrls,
        
        // Prompts pour la génération d'images
        prompts: {
          system: "Tu es un expert en conception de bijoux personnalisés. Génère un prompt détaillé et professionnel pour DALL-E 3 en te basant sur les informations fournies. Le prompt doit être en français, précis et inspirant, en utilisant un vocabulaire riche de joaillerie.",
          user: `Crée un prompt pour générer une image de bijou avec ces caractéristiques :
- Type : ${body.typeBijou || ''}
- Budget : ${body.budget || ''}€
- Description : ${body.description || ''}
- Occasion : ${body.occasion || ''}
- Pour : ${body.pourQui || ''}
${body.gravure ? `- Gravure : ${body.gravure}` : ''}

Le prompt doit décrire le bijou de manière détaillée et professionnelle pour obtenir un rendu photoréaliste de haute qualité.`,
          
          // Exemples de prompts fallback
          fallbackPrompts: [
            `${body.typeBijou || 'Bijou'} en or de haute joaillerie, ${body.description || 'design élégant'}. Design élégant et raffiné pour ${body.occasion || 'occasion spéciale'}. ${body.gravure ? `Avec gravure personnalisée "${body.gravure}". ` : ''}Vue macro professionnelle sur fond neutre, éclairage studio mettant en valeur les reflets et détails.`,
            
            `Magnifique ${body.typeBijou || 'bijou'} artisanal en or, ${body.description || 'création unique'}. Création unique pour ${body.pourQui || 'personne spéciale'} à l'occasion de ${body.occasion || 'moment important'}. ${body.gravure ? `Gravure élégante "${body.gravure}". ` : ''}Photographie haute définition style catalogue joaillerie.`,
            
            `${body.typeBijou || 'Bijou'} luxueux en or finement travaillé, ${body.description || 'pièce d\'exception'}. Pièce d'exception pour ${body.occasion || 'célébration'}. ${body.gravure ? `Personnalisé avec la gravure "${body.gravure}". ` : ''}Rendu photoréaliste avec focus sur les détails et la brillance.`,
            
            `Sublime ${body.typeBijou || 'bijou'} en or avec finitions soignées, ${body.description || 'bijou personnalisé'}. Bijou personnalisé pour ${body.pourQui || 'être cher'}. ${body.gravure ? `Incluant la gravure "${body.gravure}". ` : ''}Image haute résolution style vitrine de joaillier.`
          ]
        },
        
        // Métadonnées
        timestamp: new Date().toISOString(),
        source: 'permale-form'
      };
      
      // Appel webhook n8n
      console.log('[POST /api/projets] Envoi webhook n8n avec projetId:', nouveauProjet.id);
      console.log('[POST /api/projets] Webhook URL:', 'https://n8n.srv765302.hstgr.cloud/webhook/009df7aa-4fa9-4e60-b0e1-b7bf2bc3d3bd');
      console.log('[POST /api/projets] Photos dans webhook:', webhookData.photosModele);
      console.log('[POST /api/projets] Webhook data complète:', JSON.stringify(webhookData, null, 2));
      
      try {
        const webhookResponse = await fetch('https://n8n.srv765302.hstgr.cloud/webhook/009df7aa-4fa9-4e60-b0e1-b7bf2bc3d3bd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
        });
        
        console.log('[POST /api/projets] Webhook response status:', webhookResponse.status);
        console.log('[POST /api/projets] Webhook response headers:', webhookResponse.headers);
        
        if (!webhookResponse.ok) {
          const responseText = await webhookResponse.text();
          console.error('[POST /api/projets] Webhook response error:', responseText);
        } else {
          const responseData = await webhookResponse.text();
          console.log('[POST /api/projets] Webhook response success:', responseData);
        }
      } catch (err) {
        console.error('[POST /api/projets] Erreur webhook n8n:', err);
      }
    }

    return NextResponse.json(nouveauProjet, { status: 201 });
  } catch (error) {
    
    let errorMessage = 'Erreur inconnue';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un projet (pour les images et la sélection)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du projet requis' },
        { status: 400 }
      );
    }

    const projetMisAJour = await updateProjet(id, updates);
    
    if (!projetMisAJour) {
      return NextResponse.json(
        { error: 'Projet non trouvé ou erreur lors de la mise à jour' },
        { status: 404 }
      );
    }

    return NextResponse.json(projetMisAJour);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet' },
      { status: 500 }
    );
  }
}