import { notFound } from 'next/navigation';
import { getProjetById } from '@/lib/airtable';
import PresentationPage from '@/components/PresentationPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Extraire l'ID Airtable du slug (format: nom-prenom-IDrecordairtable)
  const parts = slug.split('-');
  if (parts.length < 3) {
    notFound();
  }
  
  // L'ID Airtable est la dernière partie
  const id = parts[parts.length - 1];
  
  try {
    const projet = await getProjetById(id);
    
    if (!projet) {
      notFound();
    }
    
    // Vérifier que le slug correspond bien au projet
    const expectedSlug = `${projet.nom.toLowerCase()}-${projet.prenom.toLowerCase()}-${id}`;
    if (slug.toLowerCase() !== expectedSlug.toLowerCase()) {
      notFound();
    }
    
    return <PresentationPage projet={projet} />;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const parts = slug.split('-');
  
  if (parts.length < 3) {
    return {
      title: 'PERMALE - Haute Joaillerie',
      description: 'Création de bijoux sur mesure',
    };
  }
  
  const id = parts[parts.length - 1];
  
  try {
    const projet = await getProjetById(id);
    
    if (!projet) {
      return {
        title: 'PERMALE - Haute Joaillerie',
        description: 'Création de bijoux sur mesure',
      };
    }
    
    return {
      title: `PERMALE - Projet ${projet.typeBijou} pour ${projet.prenom} ${projet.nom}`,
      description: `Découvrez la création personnalisée de ${projet.typeBijou} pour ${projet.prenom} ${projet.nom}`,
    };
  } catch (error) {
    return {
      title: 'PERMALE - Haute Joaillerie',
      description: 'Création de bijoux sur mesure',
    };
  }
}