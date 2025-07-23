'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Projet } from '@/types';
import Image from 'next/image';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Projet non trouvé</div>
      </div>
    );
  }

  // Collecter toutes les images IA disponibles
  const imagesIA = [
    projet.imageIA1,
    projet.imageIA2,
    projet.imageIA3,
    projet.imageIA4,
    projet.imageIA5
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projet de {projet.prenom} {projet.nom}
          </h1>
          <p className="text-gray-600">
            {projet.typeBijou} - {projet.occasion}
          </p>
        </div>

        {/* Informations du projet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Détails du projet</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type de bijou</dt>
                <dd className="mt-1 text-sm text-gray-900">{projet.typeBijou}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 text-sm text-gray-900">{projet.budget}€</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Pour qui</dt>
                <dd className="mt-1 text-sm text-gray-900">{projet.pourQui}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de livraison souhaitée</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {projet.dateLivraison ? new Date(projet.dateLivraison).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </dd>
              </div>
              {projet.gravure && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Gravure</dt>
                  <dd className="mt-1 text-sm text-gray-900">{projet.gravure}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{projet.description || 'Aucune description fournie'}</p>
          </div>
        </div>

        {/* Photos de référence */}
        {projet.photosModele && projet.photosModele.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Photos de référence</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projet.photosModele.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={photo}
                    alt={`Photo de référence ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images générées par IA */}
        {imagesIA.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Propositions de design</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imagesIA.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Proposition ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                    Proposition {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si pas encore d'images */}
        {imagesIA.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              Les propositions de design sont en cours de création. Revenez bientôt pour les découvrir !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}