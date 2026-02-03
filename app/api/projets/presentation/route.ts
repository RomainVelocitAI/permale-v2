import { NextRequest, NextResponse } from 'next/server';
import { getAllProjets } from '@/lib/airtable';
import { extractIdFromPresentationUrl } from '@/lib/utils';

// GET - Récupérer un projet par son URL de présentation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL de présentation requise' },
        { status: 400 }
      );
    }

    // Extraire l'ID unique de l'URL
    const uniqueId = extractIdFromPresentationUrl(url);
    
    if (!uniqueId) {
      return NextResponse.json(
        { error: 'URL de présentation invalide' },
        { status: 400 }
      );
    }

    // Récupérer tous les projets et trouver celui avec l'URL correspondante
    const projets = await getAllProjets();
    const projet = projets.find(p => p.urlPresentation && p.urlPresentation.includes(uniqueId));
    
    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(projet);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet par URL:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du projet' },
      { status: 500 }
    );
  }
}