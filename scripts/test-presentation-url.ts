#!/usr/bin/env node

/**
 * Script de test pour la génération d'URL de présentation
 * Usage: npx tsx scripts/test-presentation-url.ts
 */

import { generateSlug, generatePresentationUrl, extractIdFromPresentationUrl } from '../lib/utils';

// Tests pour generateSlug
console.log('=== Tests generateSlug ===');
console.log('Jean Dupont:', generateSlug('Dupont', 'Jean'));
console.log('Marie-Claire Lévêque:', generateSlug('Lévêque', 'Marie-Claire'));
console.log('François D\'Arc:', generateSlug('D\'Arc', 'François'));
console.log('Élise Müller:', generateSlug('Müller', 'Élise'));
console.log();

// Tests pour generatePresentationUrl
console.log('=== Tests generatePresentationUrl ===');
const url1 = generatePresentationUrl('Dupont', 'Jean');
console.log('URL sans ID:', url1);

const url2 = generatePresentationUrl('Martin', 'Sophie', 'rec1234567890abcdef');
console.log('URL avec ID Airtable:', url2);
console.log();

// Tests pour extractIdFromPresentationUrl
console.log('=== Tests extractIdFromPresentationUrl ===');
console.log('ID extrait de', url1, ':', extractIdFromPresentationUrl(url1));
console.log('ID extrait de', url2, ':', extractIdFromPresentationUrl(url2));

const testUrls = [
  'https://permale.com/presentation/dupont-jean-90abcdef',
  'https://permale.com/presentation/martin-sophie-rec12345',
  'https://permale.com/presentation/invalide',
  'https://permale.com/autre/page',
];

testUrls.forEach(url => {
  console.log('ID extrait de', url, ':', extractIdFromPresentationUrl(url));
});

console.log('\n✅ Tests terminés!');