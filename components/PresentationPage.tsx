'use client';

import { useState, useEffect, useRef } from 'react';
import { Projet } from '@/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import logoPermale from '@/public/soloo fin blc.png';
import { getTextsForJewelryType } from '@/lib/presentation-texts';

interface PresentationPageProps {
  projet: Projet;
}

export default function PresentationPage({ projet }: PresentationPageProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sections = [
    'intro',
    'univers',
    'demande',
    'essence',
    'porte',
    'ecrin',
    'oeuvre',
    'tarif',
    'engagements',
    'contact'
  ];

  // Navigation avec les flèches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevSection();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isAutoPlaying]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setTimeout(() => {
        if (currentSection < sections.length - 1) {
          setCurrentSection(currentSection + 1);
        } else {
          setIsAutoPlaying(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSection, isAutoPlaying]);

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
    setIsAutoPlaying(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#363d43]">
      <AnimatePresence mode="wait">
        {currentSection === 0 && <IntroSection projet={projet} key="intro" />}
        {currentSection === 1 && <UniversSection key="univers" />}
        {currentSection === 2 && <DemandeSection projet={projet} key="demande" />}
        {currentSection === 3 && <EssenceSection projet={projet} key="essence" />}
        {currentSection === 4 && <PorteSection projet={projet} key="porte" />}
        {currentSection === 5 && <EcrinSection projet={projet} key="ecrin" />}
        {currentSection === 6 && <OeuvreSection projet={projet} key="oeuvre" />}
        {currentSection === 7 && <TarifSection projet={projet} key="tarif" />}
        {currentSection === 8 && <EngagementsSection key="engagements" />}
        {currentSection === 9 && <ContactSection projet={projet} key="contact" />}
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-[#efefef]/10 backdrop-blur-md rounded-full px-6 py-3">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className="text-[#efefef] disabled:opacity-30 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSection(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSection === index ? 'bg-[#acae9f] w-8' : 'bg-[#efefef]/40'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="text-[#efefef] disabled:opacity-30 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Auto-play toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="fixed top-8 right-8 z-50 text-[#efefef]/60 hover:text-[#efefef] transition-colors"
      >
        {isAutoPlaying ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// Section Introduction
function IntroSection({ projet }: { projet: Projet }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        >
          <Image 
            src={logoPermale} 
            alt="PERMALE" 
            width={400} 
            height={100} 
            className="mx-auto mb-12"
            priority
          />
        </motion.div>
        
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-5xl font-light text-[#efefef] tracking-[0.3em] mb-4"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          CRÉATION EXCLUSIVE
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-2xl text-[#efefef]/80 font-light tracking-[0.2em]"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          Pour {projet.prenom} {projet.nom}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Section 1 - Univers PERMALE
function UniversSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl font-light tracking-[0.3em] mb-12"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          L'UNIVERS PERMALE
        </motion.h2>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="space-y-8 text-xl font-light leading-relaxed"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          <p>
            Depuis 25 ans, PERMALE incarne l'excellence de la haute joaillerie française.
          </p>
          <p>
            Chaque création est une œuvre unique, façonnée par les mains expertes 
            de nos maîtres artisans dans notre atelier parisien.
          </p>
          <p className="text-2xl text-[#acae9f] italic">
            « Un bijou PERMALE n'est pas seulement un ornement, 
            c'est une histoire gravée dans le temps »
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 2 - Demande du client avec image sélectionnée
function DemandeSection({ projet }: { projet: Projet }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-6xl mx-auto px-8">
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-16 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          VOTRE VISION
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-[#acae9f] text-sm tracking-[0.2em] mb-2 uppercase">Type de création</h3>
              <p className="text-2xl font-light">{projet.typeBijou}</p>
            </div>
            
            <div>
              <h3 className="text-[#acae9f] text-sm tracking-[0.2em] mb-2 uppercase">Occasion</h3>
              <p className="text-2xl font-light">{projet.occasion}</p>
            </div>
            
            <div>
              <h3 className="text-[#acae9f] text-sm tracking-[0.2em] mb-2 uppercase">Destinataire</h3>
              <p className="text-2xl font-light">{projet.pourQui}</p>
            </div>
            
            <div className="bg-[#efefef]/5 backdrop-blur-sm p-6 rounded-lg mt-6">
              <h3 className="text-[#acae9f] text-sm tracking-[0.2em] mb-4 uppercase">Votre inspiration</h3>
              <p className="text-lg leading-relaxed italic">
                "{projet.description}"
              </p>
              
              {projet.gravure && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="text-[#acae9f] text-sm tracking-[0.2em] mb-2 uppercase">Gravure souhaitée</h3>
                  <p className="text-xl font-light">"{projet.gravure}"</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {projet.imageSelectionnee && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={projet.imageSelectionnee}
                alt="Vision du bijou"
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


// Section 3 - L'Essence du Bijou (Photo couchée)
function EssenceSection({ projet }: { projet: Projet }) {
  const texts = getTextsForJewelryType(projet.typeBijou);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-12 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          L'ESSENCE DU BIJOU
        </motion.h2>
        
        {projet.imagePres1 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8"
          >
            <Image
              src={projet.imagePres1}
              alt="Essence du bijou"
              fill
              className="object-cover"
            />
          </motion.div>
        )}
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-xl text-center font-light leading-relaxed italic"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          {texts.slide1}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Section 4 - Porté avec Élégance (Bijou porté)
function PorteSection({ projet }: { projet: Projet }) {
  const texts = getTextsForJewelryType(projet.typeBijou);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-12 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          PORTÉ AVEC ÉLÉGANCE
        </motion.h2>
        
        {projet.imagePres2 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative aspect-[4/3] overflow-hidden rounded-lg mb-8 max-w-3xl mx-auto"
          >
            <Image
              src={projet.imagePres2}
              alt="Bijou porté"
              fill
              className="object-cover"
            />
          </motion.div>
        )}
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-xl text-center font-light leading-relaxed italic"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          {texts.slide2}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Section 5 - Dans son Écrin
function EcrinSection({ projet }: { projet: Projet }) {
  const texts = getTextsForJewelryType(projet.typeBijou);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-12 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          DANS SON ÉCRIN
        </motion.h2>
        
        {projet.imagePres3 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative aspect-square overflow-hidden rounded-lg mb-8 max-w-2xl mx-auto"
          >
            <Image
              src={projet.imagePres3}
              alt="Bijou dans son écrin"
              fill
              className="object-cover"
            />
          </motion.div>
        )}
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-xl text-center font-light leading-relaxed italic"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          {texts.slide3}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Section 6 - Œuvre d'Art (Bijou sur support)
function OeuvreSection({ projet }: { projet: Projet }) {
  const texts = getTextsForJewelryType(projet.typeBijou);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-5xl mx-auto px-8 w-full">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-12 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          ŒUVRE D'ART
        </motion.h2>
        
        {projet.imagePres4 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative aspect-[4/3] overflow-hidden rounded-lg mb-8 max-w-3xl mx-auto"
          >
            <Image
              src={projet.imagePres4}
              alt="Œuvre d'art"
              fill
              className="object-cover"
            />
          </motion.div>
        )}
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-xl text-center font-light leading-relaxed italic"
          style={{ fontFamily: 'Roboto Condensed, sans-serif' }}
        >
          {texts.slide4}
        </motion.p>
      </div>
    </motion.div>
  );
}

// Section 7 - Proposition tarifaire
function TarifSection({ projet }: { projet: Projet }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-16"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          INVESTISSEMENT
        </motion.h2>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-[#efefef]/5 backdrop-blur-sm p-12 rounded-lg"
        >
          {projet.budget ? (
            <>
              <p className="text-6xl font-light mb-4">{projet.budget} €</p>
              <p className="text-xl text-[#efefef]/60 mb-8">Budget estimé</p>
            </>
          ) : (
            <p className="text-2xl text-[#efefef]/60 mb-8">
              Un devis personnalisé vous sera proposé
            </p>
          )}
          
          <div className="space-y-4 text-lg text-left max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-[#acae9f] mt-1">✓</span>
              <span>Conception sur-mesure par nos maîtres joailliers</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#acae9f] mt-1">✓</span>
              <span>Matériaux nobles certifiés (or 18 carats, diamants certifiés)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#acae9f] mt-1">✓</span>
              <span>Finitions à la main dans notre atelier parisien</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#acae9f] mt-1">✓</span>
              <span>Écrin de luxe et certificat d'authenticité</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 8 - Engagements et garanties
function EngagementsSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-5xl mx-auto px-8">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-16 text-center"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          NOS ENGAGEMENTS
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="bg-[#efefef]/5 backdrop-blur-sm p-8 rounded-lg"
          >
            <h3 className="text-2xl font-light tracking-[0.2em] mb-6 text-[#acae9f]">QUALITÉ</h3>
            <ul className="space-y-3 text-lg">
              <li>• Garantie à vie sur la fabrication</li>
              <li>• Certificats GIA pour tous nos diamants</li>
              <li>• Or 18 carats poinçonné</li>
              <li>• Contrôle qualité à chaque étape</li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="bg-[#efefef]/5 backdrop-blur-sm p-8 rounded-lg"
          >
            <h3 className="text-2xl font-light tracking-[0.2em] mb-6 text-[#acae9f]">SERVICE</h3>
            <ul className="space-y-3 text-lg">
              <li>• Suivi personnalisé de votre projet</li>
              <li>• Modifications possibles jusqu'à validation</li>
              <li>• Livraison sécurisée offerte</li>
              <li>• Service après-vente premium</li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-2xl font-light italic text-[#acae9f]">
            "Votre satisfaction est notre plus belle réussite"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Section 9 - Confirmation et contact
function ContactSection({ projet }: { projet: Projet }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex items-center justify-center text-[#efefef]"
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-light tracking-[0.3em] mb-12"
          style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial, sans-serif' }}
        >
          PROCHAINE ÉTAPE
        </motion.h2>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="space-y-8"
        >
          <p className="text-2xl font-light leading-relaxed">
            Merci {projet.prenom} pour votre confiance.
            Notre équipe va étudier votre projet en détail.
          </p>
          
          <div className="bg-[#efefef]/10 backdrop-blur-sm p-8 rounded-lg inline-block">
            <p className="text-xl mb-6">Nous vous contacterons sous 48h pour :</p>
            <ul className="text-lg space-y-2 text-left">
              <li>• Affiner ensemble votre vision</li>
              <li>• Discuter des détails techniques</li>
              <li>• Planifier un rendez-vous à l'atelier</li>
              <li>• Finaliser votre commande</li>
            </ul>
          </div>
          
          <div className="pt-8">
            <p className="text-sm text-[#efefef]/60 mb-4">Pour toute question immédiate</p>
            <a 
              href="tel:+33123456789" 
              className="text-2xl text-[#acae9f] hover:text-[#efefef] transition-colors"
            >
              +33 1 23 45 67 89
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16"
        >
          <Image 
            src={logoPermale} 
            alt="PERMALE" 
            width={200} 
            height={50} 
            className="mx-auto opacity-50"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}