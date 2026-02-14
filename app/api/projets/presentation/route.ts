import { NextRequest, NextResponse } from 'next/server';
import { getProjetByPresentationUrl } from '@/lib/airtable';
import { extractIdFromPresentationUrl } from '@/lib/utils';

// Cache en mémoire pour éviter les appels Airtable répétés
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

    // Vérifier le cache
    const cached = cache.get(uniqueId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Récupérer uniquement le projet correspondant (1 seul appel API)
    const projet = await getProjetByPresentationUrl(uniqueId);
    
    if (!projet) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Mettre en cache
    cache.set(uniqueId, { data: projet, timestamp: Date.now() });

    return NextResponse.json(projet);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet par URL:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du projet' },
      { status: 500 }
    );
  }
}
