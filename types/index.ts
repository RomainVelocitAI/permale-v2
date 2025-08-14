export interface Projet {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeBijou: TypeBijou;
  description: string;
  aUnModele: boolean;
  photosModele?: string[];
  occasion: string;
  pourQui: string;
  budget?: string;
  dateLivraison?: string;
  gravure?: string;
  images?: string[];
  imageSelectionnee?: string;
  imageIA1?: string;
  imageIA2?: string;
  imageIA3?: string;
  imageIA4?: string;
  imageIA5?: string;
  imagePres1?: string;
  imagePres2?: string;
  imagePres3?: string;
  imagePres4?: string;
  urlPresentation?: string;
  dateCreation?: string;
}

export type TypeBijou = 
  | 'Alliance'
  | 'Bague de Fiançailles'
  | 'Chevalière'
  | 'Bague autre'
  | 'Collier'
  | 'Pendentif'
  | 'Boucle d\'oreille'
  | 'Bracelet'
  | 'Percing'
  | 'Bijoux autre';