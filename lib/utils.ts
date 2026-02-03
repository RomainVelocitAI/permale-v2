import { customAlphabet } from 'nanoid';

// Créer un générateur d'ID unique avec un alphabet personnalisé
const nanoid = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 8);

/**
 * Génère un slug URL-friendly à partir du nom et prénom
 */
export function generateSlug(nom: string, prenom: string): string {
  const cleanNom = nom.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]/g, '-') // Remplace les caractères spéciaux par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprime les tirets au début et à la fin
  
  const cleanPrenom = prenom.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${cleanNom}-${cleanPrenom}`;
}

/**
 * Génère une URL de présentation unique pour un projet
 */
export function generatePresentationUrl(nom: string, prenom: string, projectId?: string): string {
  const slug = generateSlug(nom, prenom);
  const uniqueId = projectId ? projectId.slice(-8).toLowerCase() : nanoid();
  
  // Utiliser l'URL Vercel en production
  let baseUrl = 'https://permale-v2.vercel.app';
  
  // En développement local, utiliser l'URL locale
  if (process.env.NODE_ENV === 'development') {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  
  return `${baseUrl}/presentation/${slug}-${uniqueId}`;
}

/**
 * Extrait l'ID unique d'une URL de présentation
 */
export function extractIdFromPresentationUrl(url: string): string | null {
  const match = url.match(/presentation\/[^\/]+-([a-z0-9]{8})$/);
  return match ? match[1] : null;
}