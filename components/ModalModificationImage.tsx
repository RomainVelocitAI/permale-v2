'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalModificationImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageIndex: number;
  projetId: string;
  projetData: {
    nom: string;
    prenom: string;
    typeBijou: string;
    description: string;
  };
}

export default function ModalModificationImage({ 
  isOpen, 
  onClose, 
  imageIndex, 
  projetId,
  projetData 
}: ModalModificationImageProps) {
  const [modification, setModification] = useState('');
  const [sending, setSending] = useState(false);

  // Réinitialiser le champ de modification quand le modal s'ouvre ou quand l'image change
  useEffect(() => {
    console.log('Modal state change - isOpen:', isOpen, 'imageIndex:', imageIndex);
    if (isOpen) {
      setModification('');
      setSending(false);
      console.log('Modal reset - cleared modification text');
    }
  }, [isOpen, imageIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission - modification:', modification, 'imageIndex:', imageIndex, 'projetId:', projetId);
    
    if (!modification.trim()) {
      alert('Veuillez décrire les modifications souhaitées');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/modification-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recordId: projetId, // ID du record Airtable
          projetId,
          imageNumber: imageIndex + 1, // 1, 2, 3 ou 4
          modification: modification.trim(),
          projetInfo: {
            nom: projetData.nom,
            prenom: projetData.prenom,
            typeBijou: projetData.typeBijou,
            descriptionOriginal: projetData.description
          },
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Response from API:', result);
        alert(`Demande de modification pour l'image ${imageIndex + 1} envoyée avec succès`);
        setModification('');
        setSending(false);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.details || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la demande de modification');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white w-full max-w-2xl shadow-xl">
              {/* Header */}
              <div className="border-b-2 border-[#acae9f] p-6">
                <div className="flex justify-between items-center">
                  <h2 
                    className="text-2xl font-light tracking-[0.2em] text-[#363d43]" 
                    style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
                  >
                    MODIFIER L'IMAGE {imageIndex + 1}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-[#363d43] hover:text-[#acae9f] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label 
                    htmlFor="modification"
                    className="block text-sm font-medium tracking-[0.15em] text-[#363d43] mb-3 uppercase"
                    style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                  >
                    Décrivez les modifications souhaitées
                  </label>
                  <textarea
                    id="modification"
                    value={modification}
                    onChange={(e) => setModification(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-[#acae9f] focus:border-[#363d43] focus:outline-none resize-none transition-colors text-[#363d43] text-base placeholder-[#363d43]/40 bg-gray-50"
                    placeholder="Ex: Je souhaiterais que le bijou soit plus moderne, avec des lignes plus épurées..."
                    style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                  />
                </div>

                <div className="text-sm text-[#363d43]/60 mb-6" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                  <p>Cette demande sera envoyée à notre équipe de création pour générer une nouvelle version de l'image {imageIndex + 1}.</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 border-2 border-[#363d43] text-[#363d43] text-sm font-medium tracking-[0.15em] hover:bg-[#363d43] hover:text-[#efefef] transition-all duration-200 uppercase"
                    style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                  >
                    Annuler
                  </button>
                  
                  <button
                    type="submit"
                    disabled={sending || !modification.trim()}
                    className={`px-8 py-3 border-2 text-sm font-medium tracking-[0.15em] transition-all duration-200 uppercase ${
                      sending || !modification.trim()
                        ? 'border-[#acae9f]/50 bg-[#acae9f]/50 text-[#363d43]/50 cursor-not-allowed'
                        : 'border-[#acae9f] bg-[#acae9f] text-[#363d43] hover:bg-[#363d43] hover:text-[#efefef] hover:border-[#363d43]'
                    }`}
                    style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                  >
                    {sending ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}