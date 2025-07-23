'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Projet } from '@/types';
import PresentationPageComponent from '@/components/PresentationPage';

export default function PresentationPage() {
  const params = useParams();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjet = async () => {
      try {
        const currentUrl = window.location.href;
        const response = await fetch(`/api/projets/presentation?url=${encodeURIComponent(currentUrl)}`);
        
        if (!response.ok) {
          throw new Error('Projet non trouvé');
        }
        
        const data = await response.json();
        setProjet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProjet();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#363d43]">
        <div className="text-lg text-[#efefef]">Chargement...</div>
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#363d43]">
        <div className="text-[#efefef]">Projet non trouvé</div>
      </div>
    );
  }

  // Utiliser le composant de présentation magnifique
  return <PresentationPageComponent projet={projet} />;
}