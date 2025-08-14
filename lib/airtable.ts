import Airtable from 'airtable';
// Import types from the types directory
import { Projet, TypeBijou } from '@/types';
import { generatePresentationUrl } from '@/lib/utils';

// Lazy initialization of Airtable
let base: any;
let projetsTable: any;

// Helper function to extract URLs from Airtable attachment field
function extractPhotosUrls(attachments: any): string[] {
  if (!attachments || !Array.isArray(attachments)) return [];
  
  return attachments.map((attachment: any) => attachment.url || '').filter(Boolean);
}

function initializeAirtable() {
  if (projetsTable) return projetsTable;

  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY is not defined');
  }

  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID is not defined');
  }

  if (!process.env.AIRTABLE_TABLE_NAME) {
    throw new Error('AIRTABLE_TABLE_NAME is not defined');
  }

  try {
    base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );
    projetsTable = base(process.env.AIRTABLE_TABLE_NAME);
    return projetsTable;
  } catch (error) {
    throw error;
  }
}

// Helper functions
export async function createProjet(projet: Omit<Projet, 'id' | 'dateCreation'>): Promise<Projet> {
  try {
    const table = initializeAirtable();
    // Creating project with data
    
    // Build fields object with only provided values
    const fields: any = {};
    if (projet.nom) fields['Nom'] = projet.nom;
    if (projet.prenom) fields['Prenom'] = projet.prenom;
    if (projet.email) fields['Email'] = projet.email;
    if (projet.telephone) fields['Telephone'] = projet.telephone;
    
    // Map TypeBijou to Airtable - Keeping exact values without mapping
    if (projet.typeBijou) {
      // On garde la valeur exacte du formulaire dans Airtable
      fields['Type de bijou (nouveau)'] = projet.typeBijou;
    }
    
    if (projet.description) fields['Description'] = projet.description;
    
    // Map new fields to Airtable
    if (projet.occasion) fields['Occasion'] = projet.occasion;
    if (projet.pourQui) fields['Pour qui'] = projet.pourQui;
    if (projet.budget) fields['Budget'] = parseFloat(projet.budget);
    if (projet.dateLivraison) fields['Date de livraison'] = projet.dateLivraison;
    if (projet.gravure) fields['Gravure'] = projet.gravure;
    
    // Ajouter le champ "A un modèle" pour indiquer si des photos ont été fournies
    if (typeof projet.aUnModele === 'boolean') {
      fields['A un modèle'] = projet.aUnModele;
    }
    
    // Handle uploaded photos - Airtable expects an array of objects with url
    if (projet.photosModele && projet.photosModele.length > 0) {
      fields['Images'] = projet.photosModele.map((url, index) => ({
        url: url,
        filename: `photo-${index + 1}.jpg`
      }));
    }
    
    // Handle AI generated images - save to imageIA1-4 fields
    if (projet.images && projet.images.length > 0) {
      projet.images.forEach((url, index) => {
        if (index < 4) { // Only save first 4 images
          fields[`imageIA${index + 1}`] = url;
        }
      });
      
      // Set the first image as selected by default
      if (!projet.imageSelectionnee && projet.images[0]) {
        fields['Image choisie'] = [{
          url: projet.images[0]
        }];
      }
    }
    
    fields['Date de creation'] = new Date().toISOString();
    
    // Créer d'abord l'enregistrement pour obtenir l'ID
    const record = await table.create(fields);
    
    // Générer l'URL de présentation avec l'ID du record
    const urlPresentation = generatePresentationUrl(
      projet.nom || 'client',
      projet.prenom || 'projet',
      record.id
    );
    
    // Mettre à jour le record avec l'URL de présentation
    await table.update(record.id, {
      'URL Presentation': urlPresentation
    });

    const photosUrls = extractPhotosUrls(record.get('Images'));
    
    return {
      id: record.id,
      nom: record.get('Nom') as string || '',
      prenom: record.get('Prenom') as string || '',
      email: record.get('Email') as string || '',
      telephone: record.get('Telephone') as string || '',
      typeBijou: (record.get('Type de bijou (nouveau)') as TypeBijou) || projet.typeBijou || 'Alliance',
      description: record.get('Description') as string || '',
      aUnModele: record.get('A un modèle') as boolean || photosUrls.length > 0,
      photosModele: photosUrls,
      occasion: record.get('Occasion') as string || '',
      pourQui: record.get('Pour qui') as string || '',
      budget: record.get('Budget') ? record.get('Budget').toString() : '',
      dateLivraison: record.get('Date de livraison') as string || '',
      gravure: record.get('Gravure') as string || '',
      images: [], // Reserved for AI-generated images
      imageSelectionnee: extractPhotosUrls(record.get('Image choisie'))[0] || '',
      imageIA1: extractPhotosUrls(record.get('imageIA1'))[0] || '',
      imageIA2: extractPhotosUrls(record.get('imageIA2'))[0] || '',
      imageIA3: extractPhotosUrls(record.get('imageIA3'))[0] || '',
      imageIA4: extractPhotosUrls(record.get('imageIA4'))[0] || '',
      imageIA5: extractPhotosUrls(record.get('imageIA5'))[0] || '',
      imagePres1: extractPhotosUrls(record.get('ImagePres1'))[0] || '',
      imagePres2: extractPhotosUrls(record.get('ImagePres2'))[0] || '',
      imagePres3: extractPhotosUrls(record.get('ImagePres3'))[0] || '',
      imagePres4: extractPhotosUrls(record.get('ImagePres4'))[0] || '',
      urlPresentation: urlPresentation, // Utiliser l'URL générée
      dateCreation: record.get('Date de creation') as string || new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
}

export async function getAllProjets(): Promise<Projet[]> {
  try {
    const table = initializeAirtable();
    const records = await table.select({
      sort: [{ field: 'Date de creation', direction: 'desc' }],
    }).all();

    return records.map((record: any) => {
      const photosUrls = extractPhotosUrls(record.get('Images'));
      
      return {
        id: record.id,
        nom: record.get('Nom') as string || '',
        prenom: record.get('Prenom') as string || '',
        email: record.get('Email') as string || '',
        telephone: record.get('Telephone') as string || '',
        typeBijou: (record.get('Type de bijou (nouveau)') as TypeBijou) || 'Alliance',
        description: record.get('Description') as string || '',
        aUnModele: record.get('A un modèle') as boolean || photosUrls.length > 0,
        photosModele: photosUrls,
        occasion: record.get('Occasion') as string || '',
        pourQui: record.get('Pour qui') as string || '',
        budget: record.get('Budget') ? record.get('Budget').toString() : '',
        dateLivraison: record.get('Date de livraison') as string || '',
        gravure: record.get('Gravure') as string || '',
        images: [], // Reserved for AI-generated images
        imageSelectionnee: extractPhotosUrls(record.get('Image choisie'))[0] || '',
        imageIA1: record.get('imageIA1') as string || '',
        imageIA2: record.get('imageIA2') as string || '',
        imageIA3: record.get('imageIA3') as string || '',
        imageIA4: record.get('imageIA4') as string || '',
        imageIA5: record.get('imageIA5') as string || '',
        imagePres1: extractPhotosUrls(record.get('ImagePres1'))[0] || '',
        imagePres2: extractPhotosUrls(record.get('ImagePres2'))[0] || '',
        imagePres3: extractPhotosUrls(record.get('ImagePres3'))[0] || '',
        imagePres4: extractPhotosUrls(record.get('ImagePres4'))[0] || '',
        urlPresentation: record.get('URL Presentation') as string || '',
        dateCreation: record.get('Date de creation') as string || new Date().toISOString(),
      };
    });
  } catch (error) {
    throw error;
  }
}

export async function getProjetById(id: string): Promise<Projet | null> {
  try {
    const table = initializeAirtable();
    const record = await table.find(id);
    
    const photosUrls = extractPhotosUrls(record.get('Images'));
    
    return {
      id: record.id,
      nom: record.get('Nom') as string || '',
      prenom: record.get('Prenom') as string || '',
      email: record.get('Email') as string || '',
      telephone: record.get('Telephone') as string || '',
      typeBijou: (record.get('Type de bijou (nouveau)') as TypeBijou) || 'Alliance',
      description: record.get('Description') as string || '',
      aUnModele: record.get('A un modèle') as boolean || photosUrls.length > 0,
      photosModele: photosUrls,
      occasion: record.get('Occasion') as string || '',
      pourQui: record.get('Pour qui') as string || '',
      budget: record.get('Budget') ? record.get('Budget').toString() : '',
      dateLivraison: record.get('Date de livraison') as string || '',
      gravure: record.get('Gravure') as string || '',
      images: [], // Reserved for AI-generated images
      imageSelectionnee: extractPhotosUrls(record.get('Image choisie'))[0] || '',
      imageIA1: extractPhotosUrls(record.get('imageIA1'))[0] || '',
      imageIA2: extractPhotosUrls(record.get('imageIA2'))[0] || '',
      imageIA3: extractPhotosUrls(record.get('imageIA3'))[0] || '',
      imageIA4: extractPhotosUrls(record.get('imageIA4'))[0] || '',
      imageIA5: extractPhotosUrls(record.get('imageIA5'))[0] || '',
      imagePres1: extractPhotosUrls(record.get('ImagePres1'))[0] || '',
      imagePres2: extractPhotosUrls(record.get('ImagePres2'))[0] || '',
      imagePres3: extractPhotosUrls(record.get('ImagePres3'))[0] || '',
      imagePres4: extractPhotosUrls(record.get('ImagePres4'))[0] || '',
      urlPresentation: record.get('URL Presentation') as string || '',
      dateCreation: record.get('Date de creation') as string || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

export async function updateProjet(id: string, updates: Partial<Projet>): Promise<Projet | null> {
  try {
    const table = initializeAirtable();
    const fieldsToUpdate: any = {};
    
    if (updates.images) fieldsToUpdate['Images'] = updates.images;
    if (updates.imageSelectionnee) {
      fieldsToUpdate['Image choisie'] = [{
        url: updates.imageSelectionnee
      }];
    }
    if (updates.imageIA1) fieldsToUpdate['imageIA1'] = updates.imageIA1;
    if (updates.imageIA2) fieldsToUpdate['imageIA2'] = updates.imageIA2;
    if (updates.imageIA3) fieldsToUpdate['imageIA3'] = updates.imageIA3;
    if (updates.imageIA4) fieldsToUpdate['imageIA4'] = updates.imageIA4;
    if (updates.imageIA5) fieldsToUpdate['imageIA5'] = updates.imageIA5;
    if (updates.urlPresentation) fieldsToUpdate['URL Presentation'] = updates.urlPresentation;
    
    // L'URL de présentation est maintenant générée automatiquement à la création
    
    const record = await table.update(id, fieldsToUpdate);
    
    const photosUrls = extractPhotosUrls(record.get('Images'));
    
    return {
      id: record.id,
      nom: record.get('Nom') as string || '',
      prenom: record.get('Prenom') as string || '',
      email: record.get('Email') as string || '',
      telephone: record.get('Telephone') as string || '',
      typeBijou: (record.get('Type de bijou (nouveau)') as TypeBijou) || 'Alliance',
      description: record.get('Description') as string || '',
      aUnModele: record.get('A un modèle') as boolean || photosUrls.length > 0,
      photosModele: photosUrls,
      occasion: record.get('Occasion') as string || '',
      pourQui: record.get('Pour qui') as string || '',
      budget: record.get('Budget') ? record.get('Budget').toString() : '',
      dateLivraison: record.get('Date de livraison') as string || '',
      gravure: record.get('Gravure') as string || '',
      images: [], // Reserved for AI-generated images
      imageSelectionnee: extractPhotosUrls(record.get('Image choisie'))[0] || '',
      imageIA1: extractPhotosUrls(record.get('imageIA1'))[0] || '',
      imageIA2: extractPhotosUrls(record.get('imageIA2'))[0] || '',
      imageIA3: extractPhotosUrls(record.get('imageIA3'))[0] || '',
      imageIA4: extractPhotosUrls(record.get('imageIA4'))[0] || '',
      imageIA5: extractPhotosUrls(record.get('imageIA5'))[0] || '',
      imagePres1: extractPhotosUrls(record.get('ImagePres1'))[0] || '',
      imagePres2: extractPhotosUrls(record.get('ImagePres2'))[0] || '',
      imagePres3: extractPhotosUrls(record.get('ImagePres3'))[0] || '',
      imagePres4: extractPhotosUrls(record.get('ImagePres4'))[0] || '',
      urlPresentation: record.get('URL Presentation') as string || '',
      dateCreation: record.get('Date de creation') as string || new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}