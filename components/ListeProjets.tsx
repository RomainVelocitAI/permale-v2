'use client';

import { useState, useEffect } from 'react';
import { Projet } from '@/types';
import DetailProjet from './DetailProjet';
import { motion, AnimatePresence } from 'framer-motion';

export default function ListeProjets() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [projetSelectionne, setProjetSelectionne] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const response = await fetch('/api/projets');
      if (!response.ok) throw new Error('Erreur lors du chargement des projets');
      const data = await response.json();
      setProjets(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleProjetClick = async (projet: Projet) => {
    if (projet.id) {
      try {
        const response = await fetch(`/api/projets?id=${projet.id}`);
        if (!response.ok) throw new Error('Erreur lors du chargement du projet');
        const data = await response.json();
        setProjetSelectionne(data);
      } catch (error) {
        }
    }
  };

  const handleCloseDetail = () => {
    setProjetSelectionne(null);
    fetchProjets(); // Recharger la liste au cas où des modifications ont été faites
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#acae9f]"></div>
      </div>
    );
  }

  if (projetSelectionne) {
    return <DetailProjet projet={projetSelectionne} onClose={handleCloseDetail} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {projets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#363d43]/10"
        >
          <p className="text-[#363d43]/60 text-xl font-light">Aucun projet créé pour le moment.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {projets.map((projet, index) => (
              <motion.div
                key={projet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleProjetClick(projet)}
                className="group cursor-pointer h-full"
              >
                {/* Card with fixed aspect ratio */}
                <div className="relative h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#363d43]/5 flex flex-col">
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #363d43 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Top accent gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#acae9f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card Content with flex growth */}
                  <div className="relative p-8 flex flex-col flex-1">
                    {/* Type Badge - Fixed height */}
                    <div className="mb-6 h-7">
                      <span 
                        className="inline-block px-4 py-1.5 text-xs font-light tracking-[0.15em] uppercase text-[#363d43] bg-[#acae9f]/10 border border-[#acae9f]/20 rounded-full"
                        style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                      >
                        {projet.typeBijou}
                      </span>
                    </div>
                    
                    {/* Client Info - Fixed height */}
                    <div className="mb-6 h-20">
                      <h3 
                        className="text-2xl font-light text-[#363d43] tracking-wider mb-2 line-clamp-1" 
                        style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
                      >
                        {projet.prenom} {projet.nom}
                      </h3>
                      <p 
                        className="text-sm text-[#363d43]/60 font-light line-clamp-2" 
                        style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                      >
                        {projet.email}
                      </p>
                    </div>
                    
                    {/* Project Details - Flexible middle section */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <span 
                            className="text-xs text-[#363d43]/40 uppercase tracking-[0.15em]" 
                            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                          >
                            Créé le
                          </span>
                          <span 
                            className="text-sm font-light text-[#363d43]" 
                            style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                          >
                            {formatDate(projet.dateCreation)}
                          </span>
                        </div>
                        
                        {projet.budget && (
                          <div className="flex justify-between items-baseline">
                            <span 
                              className="text-xs text-[#363d43]/40 uppercase tracking-[0.15em]" 
                              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                            >
                              Budget
                            </span>
                            <span 
                              className="text-lg font-light text-[#363d43]" 
                              style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
                            >
                              {projet.budget} €
                            </span>
                          </div>
                        )}

                        {projet.dateLivraison && (
                          <div className="flex justify-between items-baseline">
                            <span 
                              className="text-xs text-[#363d43]/40 uppercase tracking-[0.15em]" 
                              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                            >
                              Livraison
                            </span>
                            <span 
                              className="text-sm font-light text-[#363d43]" 
                              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                            >
                              {new Date(projet.dateLivraison).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#363d43]/10 to-transparent" />
                    
                    {/* Action Button - Fixed at bottom */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs text-[#363d43]/40 uppercase tracking-[0.15em] group-hover:text-[#acae9f] transition-colors duration-300" 
                        style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
                      >
                        Voir le projet
                      </span>
                      <motion.div
                        className="w-9 h-9 rounded-full bg-[#acae9f]/10 group-hover:bg-[#acae9f]/20 flex items-center justify-center transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-4 h-4 text-[#363d43] group-hover:text-[#acae9f] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}