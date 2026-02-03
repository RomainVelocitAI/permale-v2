'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TypeBijou } from '@/types';
import { SuccessNotification } from './SuccessNotification';

const typesBijoux: TypeBijou[] = [
  'Alliance',
  'Bague de Fiançailles',
  'Chevalière',
  'Bague autre',
  'Collier',
  'Pendentif',
  'Boucle d\'oreille',
  'Bracelet',
  'Percing',
  'Bijoux autre'
];

export default function FormulaireClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photosModele, setPhotosModele] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [veutGravure, setVeutGravure] = useState<boolean | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    typeBijou: 'Alliance' as TypeBijou,
    description: '',
    aUnModele: true,
    occasion: '',
    pourQui: 'pour moi',
    budget: '',
    dateLivraison: '',
    gravure: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setPhotosModele(files);
    }
  };


  // Fonction pour convertir les fichiers en base64
  const convertFilesToBase64 = async (files: File[]): Promise<{ data: string; filename: string }[]> => {
    const promises = files.map((file) => {
      return new Promise<{ data: string; filename: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            data: reader.result as string,
            filename: file.name
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    
    return Promise.all(promises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir les images en base64 si présentes
      let photosModeleData: { data: string; filename: string }[] = [];
      if (photosModele.length > 0) {
        photosModeleData = await convertFilesToBase64(photosModele);
      }

      const response = await fetch('/api/projets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          gravure: veutGravure ? formData.gravure : '',
          photosModele: photosModeleData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Erreur lors de la création du projet');
      }

      const data = await response.json();
      
      // Afficher la notification de succès
      setShowNotification(true);
      
      // Redirection après un délai
      setTimeout(() => {
        router.push('/projets');
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur s\'est produite';
      alert(`Erreur lors de la création du projet: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <>
      <SuccessNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        title="PROJET CRÉÉ"
        message="Votre projet a été enregistré avec succès. Les visualisations 3D sont en cours de génération."
      />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;500;700&display=swap');
        
        @font-face {
          font-family: 'Glacial Indifference';
          src: url('/fonts/GlacialIndifference-Regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
        }
      `}</style>

      <div className="min-h-screen bg-[#efefef] py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Progress bar */}
          <div className="mb-12 pt-8">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-[#363d43]' : 'text-[#363d43]/40'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-light transition-all duration-300 ${
                    currentStep >= 1 ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-lg' : 'border-[#363d43]/20 bg-white'
                  }`} style={{ fontFamily: 'Roboto Condensed' }}>
                    1
                  </div>
                  <span className="ml-3 text-xs tracking-[0.2em] font-light hidden sm:inline uppercase" style={{ fontFamily: 'Roboto Condensed' }}>Informations</span>
                </div>
                
                <div className={`flex items-center ${currentStep >= 2 ? 'text-[#363d43]' : 'text-[#363d43]/40'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-light transition-all duration-300 ${
                    currentStep >= 2 ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-lg' : 'border-[#363d43]/20 bg-white'
                  }`} style={{ fontFamily: 'Roboto Condensed' }}>
                    2
                  </div>
                  <span className="ml-3 text-xs tracking-[0.2em] font-light hidden sm:inline uppercase" style={{ fontFamily: 'Roboto Condensed' }}>Projet</span>
                </div>
                
                <div className={`flex items-center ${currentStep >= 3 ? 'text-[#363d43]' : 'text-[#363d43]/40'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-light transition-all duration-300 ${
                    currentStep >= 3 ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-lg' : 'border-[#363d43]/20 bg-white'
                  }`} style={{ fontFamily: 'Roboto Condensed' }}>
                    3
                  </div>
                  <span className="ml-3 text-xs tracking-[0.2em] font-light hidden sm:inline uppercase" style={{ fontFamily: 'Roboto Condensed' }}>Détails</span>
                </div>
              </div>
              
              <div className="absolute top-5 left-0 w-full h-[2px] bg-[#363d43]/10 -z-10">
                <div 
                  className="bg-gradient-to-r from-[#acae9f] to-[#acae9f]/70 h-[2px] transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl border border-[#363d43]/5">
            {/* Step 1: Informations personnelles */}
            {currentStep === 1 && (
              <div className="p-10 space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light tracking-[0.2em] text-[#363d43] mb-3" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial' }}>
                    INFORMATIONS PERSONNELLES
                  </h2>
                  <div className="w-24 h-0.5 bg-[#acae9f] mx-auto"></div>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                        autoComplete="given-name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Nom
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                        autoComplete="family-name"
                      />
                    </div>

                    <div suppressHydrationWarning>
                      <label htmlFor="email" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                        autoComplete="email"
                        suppressHydrationWarning
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 0);
                    }}
                    className="relative overflow-hidden group px-20 py-4 border border-[#363d43] bg-[#363d43] text-[#efefef] font-light tracking-[0.2em] hover:text-[#363d43] transition-all duration-500 text-sm uppercase"
                    style={{ fontFamily: 'Roboto Condensed' }}
                  >
                    <span className="relative z-10">Suivant</span>
                    <div className="absolute inset-0 bg-[#acae9f] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Le bijou */}
            {currentStep === 2 && (
              <div className="p-10 space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light tracking-[0.2em] text-[#363d43] mb-3" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial' }}>
                    VOTRE PROJET
                  </h2>
                  <div className="w-24 h-0.5 bg-[#acae9f] mx-auto"></div>
                </div>

                <div className="max-w-3xl mx-auto space-y-10">
                  {/* Type de bijou */}
                  <div>
                    <label className="block text-sm font-medium text-[#363d43] mb-6 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed' }}>
                      Type de bijou
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {typesBijoux.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, typeBijou: type })}
                          className={`py-4 px-6 border text-sm tracking-wider transition-all duration-300 rounded-sm ${
                            formData.typeBijou === type
                              ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-md'
                              : 'border-[#363d43]/20 hover:border-[#acae9f]/50 text-[#363d43] bg-white hover:bg-[#acae9f]/5'
                          }`}
                          style={{ fontFamily: 'Roboto Condensed' }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#363d43] mb-4 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed' }}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="w-full p-4 border border-[#363d43]/20 rounded-sm focus:outline-none focus:border-[#acae9f] focus:bg-[#acae9f]/5 transition-all duration-300 bg-white resize-none font-light text-[#363d43]"
                      placeholder="Décrivez votre projet en détail..."
                    />
                  </div>

                  {/* Upload photos de référence (obligatoire) */}
                  <div>
                    <label htmlFor="photosModele" className="block text-sm font-medium text-[#363d43] mb-4 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed' }}>
                      Photos de référence <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="photosModele"
                        name="photosModele"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="photosModele"
                        className={`flex items-center justify-center w-full px-6 py-12 border border-dashed rounded-sm cursor-pointer hover:border-[#acae9f] hover:bg-[#acae9f]/5 transition-all duration-300 bg-white ${
                          photosModele.length === 0 ? 'border-[#363d43]/30' : 'border-[#acae9f]'
                        }`}
                      >
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-[#acae9f] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-[#363d43]" style={{ fontFamily: 'Roboto Condensed' }}>
                            Cliquez pour ajouter vos photos de référence
                          </p>
                          <p className="text-xs text-[#363d43]/50 mt-2" style={{ fontFamily: 'Roboto Condensed' }}>
                            Obligatoire • 5 fichiers maximum • 10 MB par fichier
                          </p>
                        </div>
                      </label>
                    </div>
                    {photosModele.length > 0 && (
                      <div className="mt-4 space-y-1">
                        {photosModele.map((file, index) => (
                          <div key={index} className="text-sm text-[#363d43]" style={{ fontFamily: 'Roboto Condensed' }}>
                            • {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Information sur la génération automatique */}
                  <div className="mt-10 pt-10 border-t border-[#363d43]/10">
                    <div className="bg-[#acae9f]/10 rounded-sm p-6 text-center">
                      <svg className="w-8 h-8 text-[#acae9f] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-[#363d43] font-light" style={{ fontFamily: 'Roboto Condensed' }}>
                        Une visualisation 3D de votre bijou sera générée automatiquement
                        <br />basée sur votre description après validation du formulaire
                      </p>
                      <p className="text-xs text-[#363d43]/50 mt-2" style={{ fontFamily: 'Roboto Condensed' }}>
                        GPT-4.1 + Replicate • 1 image
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 0);
                    }}
                    className="group px-16 py-4 border border-[#363d43] text-[#363d43] font-light tracking-[0.2em] hover:bg-[#363d43]/5 transition-all duration-300 text-sm uppercase"
                    style={{ fontFamily: 'Roboto Condensed' }}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (photosModele.length === 0) {
                        alert('Veuillez ajouter au moins une photo de référence avant de continuer.');
                        return;
                      }
                      setCurrentStep(3);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 0);
                    }}
                    className="relative overflow-hidden group px-16 py-4 border border-[#363d43] bg-[#363d43] text-[#efefef] font-light tracking-[0.2em] hover:text-[#363d43] transition-all duration-500 text-sm uppercase"
                    style={{ fontFamily: 'Roboto Condensed' }}
                  >
                    <span className="relative z-10">Suivant</span>
                    <div className="absolute inset-0 bg-[#acae9f] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Détails du projet */}
            {currentStep === 3 && (
              <div className="p-10 space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-light tracking-[0.2em] text-[#363d43] mb-3" style={{ fontFamily: 'Glacial Indifference, Helvetica Neue, Arial' }}>
                    DÉTAILS
                  </h2>
                  <div className="w-24 h-0.5 bg-[#acae9f] mx-auto"></div>
                </div>

                <div className="max-w-2xl mx-auto space-y-10">
                  {/* Occasion */}
                  <div>
                    <label htmlFor="occasion" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                      Occasion
                    </label>
                    <input
                      type="text"
                      id="occasion"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                    />
                  </div>

                  {/* Pour qui */}
                  <div>
                    <label className="block text-sm font-medium text-[#363d43] mb-6 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed' }}>
                      Destinataire
                    </label>
                    <div className="flex gap-4 max-w-md mx-auto">
                      {[
                        { value: 'pour moi', label: 'POUR MOI' },
                        { value: 'à offrir', label: 'À OFFRIR' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, pourQui: option.value })}
                          className={`flex-1 py-3 border text-sm font-light tracking-[0.15em] transition-all duration-300 rounded-sm ${
                            formData.pourQui === option.value
                              ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-md'
                              : 'border-[#363d43]/20 hover:border-[#acae9f]/50 text-[#363d43] bg-white hover:bg-[#acae9f]/5'
                          }`}
                          style={{ fontFamily: 'Roboto Condensed' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Budget (EUR)
                      </label>
                      <input
                        type="text"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                      />
                    </div>

                    {/* Date de livraison */}
                    <div>
                      <label htmlFor="dateLivraison" className="block text-sm font-medium text-[#363d43] mb-3 tracking-[0.15em] uppercase" style={{ fontFamily: 'Roboto Condensed' }}>
                        Livraison souhaitée
                      </label>
                      <input
                        type="date"
                        id="dateLivraison"
                        name="dateLivraison"
                        value={formData.dateLivraison}
                        onChange={handleChange}
                        className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                      />
                    </div>
                  </div>

                  {/* Gravure */}
                  <div>
                    <label className="block text-sm font-medium text-[#363d43] mb-6 tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'Roboto Condensed' }}>
                      Gravure
                    </label>
                    <div className="flex gap-4 mb-6 max-w-md mx-auto">
                      {[
                        { value: true, label: 'OUI' },
                        { value: false, label: 'NON' }
                      ].map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => setVeutGravure(option.value)}
                          className={`flex-1 py-3 border text-sm font-light tracking-[0.15em] transition-all duration-300 rounded-sm ${
                            veutGravure === option.value
                              ? 'border-[#acae9f] bg-[#acae9f] text-[#363d43] shadow-md'
                              : 'border-[#363d43]/20 hover:border-[#acae9f]/50 text-[#363d43] bg-white hover:bg-[#acae9f]/5'
                          }`}
                          style={{ fontFamily: 'Roboto Condensed' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    
                    {veutGravure === true && (
                      <div>
                        <input
                          type="text"
                          id="gravure"
                          name="gravure"
                          value={formData.gravure}
                          onChange={handleChange}
                          className="w-full px-0 py-3 border-0 border-b-2 border-[#acae9f] focus:outline-none focus:border-[#363d43] transition-colors bg-transparent font-light text-[#363d43]"
                          placeholder="Texte à graver"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(2);
                      // Utiliser setTimeout pour s'assurer que le DOM est mis à jour
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 0);
                    }}
                    className="group px-16 py-4 border border-[#363d43] text-[#363d43] font-light tracking-[0.2em] hover:bg-[#363d43]/5 transition-all duration-300 text-sm uppercase"
                    style={{ fontFamily: 'Roboto Condensed' }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative overflow-hidden group px-16 py-4 border font-light tracking-[0.2em] transition-all duration-500 text-sm uppercase ${
                      loading
                        ? 'border-[#acae9f]/50 bg-[#acae9f]/50 text-[#363d43]/50 cursor-not-allowed'
                        : 'border-[#acae9f] bg-[#acae9f] text-[#363d43] hover:text-[#efefef]'
                    }`}
                    style={{ fontFamily: 'Roboto Condensed' }}
                  >
                    {loading ? (
                      <span className="flex items-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#363d43]/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">Valider</span>
                        <div className="absolute inset-0 bg-[#363d43] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-24 text-center">
            <div className="inline-block">
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#acae9f]/30 to-transparent mb-4" />
              <p className="text-xs text-[#363d43]/40 tracking-[0.3em] uppercase font-light" style={{ fontFamily: 'Roboto Condensed' }}>
                Permale • Haute Joaillerie • La Réunion
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}