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
      const uploadService = createUploadService();
      
      // Extraire les données et noms de fichiers
      const imagesData = body.photosModele.map((photo: { data: string; filename: string }) => photo.data);
      const filenames = body.photosModele.map((photo: { data: string; filename: string }) => photo.filename);
      
      try {
        // Upload les images et récupérer les URLs
        uploadedPhotosUrls = await uploadService.uploadImages(imagesData, filenames);
      } catch (uploadError) {
        // En cas d'erreur d'upload, on continue sans les images
      }
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

    // Image generation API will be called here

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