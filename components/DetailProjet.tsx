'use client';

import { useState, useEffect } from 'react';
import { Projet } from '@/types';
import Image from 'next/image';
import LuxuryImageGrid from './LuxuryImageGrid';
import ModalModificationImage from './ModalModificationImage';
import ImageLightbox from './ImageLightbox';

interface DetailProjetProps {
  projet: Projet;
  onClose: () => void;
}

export default function DetailProjet({ projet, onClose }: DetailProjetProps) {
  const [imageSelectionnee, setImageSelectionnee] = useState(projet.imageSelectionnee || '');
  const [imageTemporaire, setImageTemporaire] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [checkingImages, setCheckingImages] = useState(false);
  const [localGeneratedImages, setLocalGeneratedImages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);
  const [showPresentationNotification, setShowPresentationNotification] = useState(false);

  // Récupérer l'image depuis le champ imageIA1
  const imagesIA = projet.imageIA1 ? [projet.imageIA1] : [];
  
  // Utiliser les images du champ images ou les imagesIA
  const generatedImages = localGeneratedImages.length > 0 
    ? localGeneratedImages 
    : (projet.images && projet.images.length > 0) 
      ? projet.images.slice(0, 4) 
      : imagesIA;

  // Vérifier périodiquement si les images ont été générées
  // Max 20 tentatives (= ~10 minutes), intervalle de 30 secondes
  const [pollCount, setPollCount] = useState(0);
  const MAX_POLL_ATTEMPTS = 20;
  const POLL_INTERVAL = 30000; // 30 secondes

  useEffect(() => {
    // Si on a déjà des images, pas d'ID, ou max atteint, on arrête
    if (generatedImages.length > 0 || !projet.id || pollCount >= MAX_POLL_ATTEMPTS) return;

    const checkForImages = async () => {
      if (checkingImages || !projet.id) return;
      
      setCheckingImages(true);
      try {
        const response = await fetch(`/api/projets?id=${projet.id}`);
        if (response.ok) {
          const updatedProjet = await response.json();
          
          // Vérifier l'image IA
          const newImagesIA = updatedProjet.imageIA1 ? [updatedProjet.imageIA1] : [];
          
          // Vérifier le champ images
          const newImages = updatedProjet.images || [];
          
          if (newImagesIA.length > 0 || newImages.length > 0) {
            setLocalGeneratedImages(newImages.length > 0 ? newImages.slice(0, 4) : newImagesIA);
          } else {
            setPollCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des images:', error);
        setPollCount(prev => prev + 1);
      } finally {
        setCheckingImages(false);
      }
    };

    // Vérifier immédiatement puis toutes les 30 secondes
    checkForImages();
    const interval = setInterval(checkForImages, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [projet.id, generatedImages.length, checkingImages, pollCount]);

  const handleSelectImage = (imageUrl: string) => {
    setImageTemporaire(imageUrl);
  };

  const handleValidateSelection = async () => {
    if (!imageTemporaire) return;
    
    setSaving(true);
    setImageSelectionnee(imageTemporaire);

    try {
      // Sauvegarder la sélection
      const response = await fetch('/api/projets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: projet.id,
          imageSelectionnee: imageTemporaire,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      // Déclencher la génération des 4 images de présentation
      const presentationResponse = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projetId: projet.id,
          imageSelectionnee: imageTemporaire,
          typeBijou: projet.typeBijou,
          description: projet.description,
        }),
      });

      if (!presentationResponse.ok) {
        console.error('Erreur lors du déclenchement de la génération des images de présentation');
      } else {
        console.log('Génération des images de présentation déclenchée avec succès');
        // Afficher la notification de présentation
        setShowPresentationNotification(true);
        setTimeout(() => {
          setShowPresentationNotification(false);
        }, 5000);
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde de la sélection');
      setImageSelectionnee(projet.imageSelectionnee || '');
    } finally {
      setSaving(false);
    }
  };

  const handleEditImage = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setModalOpen(true);
  };

  const handleOpenLightbox = (imageIndex: number) => {
    setLightboxImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#efefef] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with logo */}
        <div className="mb-8">
          <div className="flex justify-center mb-8">
            <Image 
              src="/solo fin noir.png" 
              alt="PERMALE" 
              width={300} 
              height={50} 
              className="h-10 w-auto"
            />
          </div>
          
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-[#363d43] hover:text-[#000000] transition-colors group"
            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium tracking-[0.15em] uppercase">Retour aux projets</span>
          </button>
        </div>

        <div className="bg-white shadow-sm">
          <div className="p-10">
            {/* Project header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-light tracking-[0.2em] text-[#363d43] mb-3" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                PROJET {projet.typeBijou.toUpperCase()}
              </h1>
              <div className="w-24 h-0.5 bg-[#acae9f] mx-auto mb-6"></div>
              <p className="text-lg text-[#363d43] font-light" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                {projet.prenom} {projet.nom}
              </p>
            </div>
          
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Contact
                </h3>
                <p className="text-[#363d43]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>{projet.email}</p>
                <p className="text-[#363d43] mt-1" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>{projet.telephone}</p>
              </div>
              <div className="text-center">
                <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Date de création
                </h3>
                <p className="text-[#363d43]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  {projet.dateCreation
                    ? new Date(projet.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Date inconnue'}
                </p>
              </div>
            </div>

            {/* URL de présentation */}
            {projet.urlPresentation && (
              <div className="mb-12 max-w-4xl mx-auto text-center">
                <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Lien de présentation client
                </h3>
                <div className="bg-[#efefef] p-4 rounded">
                  <p className="text-[#363d43] text-sm mb-3" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    {projet.urlPresentation}
                  </p>
                  {/* Vérifier si les 4 images de présentation sont remplies */}
                  {projet.imagePres1 && projet.imagePres2 && projet.imagePres3 && projet.imagePres4 ? (
                    <button
                      onClick={() => {
                        window.open(projet.urlPresentation!, '_blank');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[#acae9f] text-[#363d43] text-xs font-medium tracking-[0.15em] hover:bg-[#363d43] hover:text-[#efefef] hover:border-[#363d43] transition-all duration-200 uppercase"
                      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ouvrir
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#acae9f] text-[#acae9f] text-xs font-medium tracking-[0.15em] opacity-50 cursor-not-allowed uppercase"
                      style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Présentation non disponible
                    </div>
                  )}
                </div>
              </div>
            )}
          
            {/* Description */}
            <div className="mb-12 max-w-4xl mx-auto">
              <h3 className="text-sm font-medium text-[#363d43] mb-4 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                Description du projet
              </h3>
              <div className="bg-[#efefef] p-6">
                <p className="text-[#363d43] leading-relaxed text-center" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  {projet.description}
                </p>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto">
              {projet.occasion && (
                <div className="text-center">
                  <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    Occasion
                  </h3>
                  <p className="text-[#363d43] font-light" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                    {projet.occasion}
                  </p>
                </div>
              )}
              
              {projet.pourQui && (
                <div className="text-center">
                  <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    Destinataire
                  </h3>
                  <p className="text-[#363d43] font-light uppercase" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                    {projet.pourQui}
                  </p>
                </div>
              )}
              
              {projet.budget && (
                <div className="text-center">
                  <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    Budget
                  </h3>
                  <p className="text-[#363d43] font-light" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                    {projet.budget} EUR
                  </p>
                </div>
              )}
              
              {projet.dateLivraison && (
                <div className="text-center">
                  <h3 className="text-xs font-medium text-[#acae9f] mb-2 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                    Livraison
                  </h3>
                  <p className="text-[#363d43] font-light" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                    {new Date(projet.dateLivraison).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
            
            {/* Gravure */}
            {projet.gravure && (
              <div className="mb-12 max-w-2xl mx-auto text-center">
                <h3 className="text-xs font-medium text-[#acae9f] mb-3 tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Gravure demandée
                </h3>
                <div className="bg-[#efefef] px-8 py-4 inline-block">
                  <p className="text-[#363d43] italic text-lg" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                    "{projet.gravure}"
                  </p>
                </div>
              </div>
            )}

            {/* Model Photos - Photos de référence uploadées par le client */}
            {projet.aUnModele && projet.photosModele && projet.photosModele.length > 0 && (
              <LuxuryImageGrid 
                images={projet.photosModele || []}
                title="Photos de référence fournies"
                emptyMessage="Aucune photo de référence fournie"
              />
            )}
          </div>

          {/* Generated Images Section */}
          <div className="border-t border-[#acae9f] opacity-30"></div>
          
          <div className="p-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-light tracking-[0.2em] text-[#363d43] mb-3" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                CRÉATIONS VISUELLES
              </h2>
              <div className="w-24 h-0.5 bg-[#acae9f] mx-auto"></div>
            </div>
          
            {generatedImages.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#acae9f]/10">
                    <svg className="w-8 h-8 text-[#acae9f] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#363d43] text-lg mb-2 font-light" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}>
                  Génération des visuels en cours...
                </p>
                <p className="text-[#363d43]/60 text-sm mb-4" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Notre IA créative est en train de concevoir une visualisation unique de votre bijou
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-[#acae9f] uppercase tracking-[0.15em]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Traitement en cours</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center max-w-md mx-auto">
                {generatedImages.map((image, index) => (
                  <div key={index} className="group">
                    <div 
                      className="aspect-square bg-[#efefef] border-2 border-[#acae9f] overflow-hidden transition-all duration-300 group-hover:border-[#363d43] cursor-pointer"
                      onClick={() => handleOpenLightbox(index)}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image}
                          alt={`Création ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        {/* Overlay avec icône de zoom au hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <svg 
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={() => handleEditImage(index)}
                        className="w-full py-3 border-2 border-[#acae9f] text-[#363d43] text-sm font-medium tracking-[0.15em] hover:border-[#363d43] hover:bg-[#363d43] hover:text-[#efefef] transition-all duration-200 uppercase"
                        style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                      >
                        Modifier
                      </button>
                      
                      <button
                        onClick={() => handleSelectImage(image)}
                        className={`w-full py-3 border-2 text-sm font-medium tracking-[0.15em] transition-all duration-200 uppercase ${
                          imageTemporaire === image
                            ? 'border-[#363d43] bg-[#363d43] text-[#efefef]'
                            : 'border-[#363d43] text-[#363d43] hover:bg-[#363d43] hover:text-[#efefef]'
                        }`}
                        style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                      >
                        {imageTemporaire === image ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bouton de validation */}
            {imageTemporaire && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleValidateSelection}
                  disabled={saving}
                  className={`px-12 py-4 border-2 text-sm font-medium tracking-[0.15em] transition-all duration-200 uppercase ${
                    saving
                      ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] opacity-50 cursor-not-allowed'
                      : 'border-[#acae9f] bg-[#acae9f] text-[#363d43] hover:bg-[#363d43] hover:text-[#efefef] hover:border-[#363d43]'
                  }`}
                  style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                >
                  {saving ? 'Validation en cours...' : 'Valider la sélection'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-24 text-center pb-8">
          <p className="text-xs text-[#acae9f] tracking-[0.2em] uppercase" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Permale - Haute Joaillerie depuis 1875
          </p>
          <p className="text-xs text-[#acae9f]/60 tracking-[0.15em] mt-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            Entreprise familiale • La Réunion
          </p>
        </div>
      </div>
      
      {/* Modal de modification */}
      <ModalModificationImage
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedImageIndex(0);  // Réinitialiser l'index lors de la fermeture
        }}
        imageIndex={selectedImageIndex}
        projetId={projet.id || ''}
        projetData={{
          nom: projet.nom,
          prenom: projet.prenom,
          typeBijou: projet.typeBijou,
          description: projet.description
        }}
      />
      
      {/* Lightbox pour afficher les images en grand */}
      <ImageLightbox
        images={generatedImages}
        initialIndex={lightboxImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Notification de présentation en cours */}
      {showPresentationNotification && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in-right">
          <div className="bg-white shadow-2xl border border-[#acae9f] p-6 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#acae9f]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#acae9f] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#363d43] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Présentation en préparation
                </h3>
                <p className="text-xs text-[#363d43]/70 leading-relaxed" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  Votre présentation exclusive sera disponible dans quelques instants. 
                  4 visuels personnalisés sont en cours de création.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 bg-[#acae9f]/20 flex-1 rounded-full overflow-hidden">
                    <div className="h-full bg-[#acae9f] animate-progress-bar rounded-full"></div>
                  </div>
                  <span className="text-xs text-[#acae9f]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>30s</span>
                </div>
              </div>
              <button
                onClick={() => setShowPresentationNotification(false)}
                className="flex-shrink-0 text-[#363d43]/40 hover:text-[#363d43] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-progress-bar {
          animation: progress-bar 5s ease-out;
        }
      `}</style>
    </div>
  );
}