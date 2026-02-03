'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryImageGridProps {
  images: string[];
  title: string;
  emptyMessage?: string;
}

export default function LuxuryImageGrid({ images, title, emptyMessage = "Aucune image" }: LuxuryImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayImages = images.length > 0 ? images : [];

  const handleImageClick = (photo: string, index: number) => {
    setSelectedImage(photo);
    setSelectedIndex(index);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = selectedIndex > 0 ? selectedIndex - 1 : displayImages.length - 1;
      setSelectedIndex(newIndex);
      setSelectedImage(displayImages[newIndex]);
    } else {
      const newIndex = selectedIndex < displayImages.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(newIndex);
      setSelectedImage(displayImages[newIndex]);
    }
  };

  // Grid uniformisé pour des miniatures plus petites
  const getGridItemClass = () => {
    return "aspect-square";
  };

  return (
    <>
      <div className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-sm font-medium text-[#363d43] mb-4 tracking-[0.15em] uppercase" 
              style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
            {title}
          </h3>
          <div className="w-24 h-0.5 bg-[#acae9f] mx-auto"></div>
        </div>
        
        {displayImages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-px bg-[#acae9f] opacity-30 mx-auto mb-8"></div>
            <p className="text-[#acae9f] text-sm font-light tracking-wider" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
              {emptyMessage}
            </p>
            <div className="w-32 h-px bg-[#acae9f] opacity-30 mx-auto mt-8"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-w-6xl mx-auto px-4">
            {displayImages.map((photo, index) => (
              <motion.div 
                key={index} 
                className="relative group cursor-pointer overflow-hidden bg-[#f8f8f8] border border-[#acae9f]/20 aspect-square shadow-md hover:shadow-2xl transition-shadow duration-300"
                style={{ transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => handleImageClick(photo, index)}
                whileHover={{ 
                  scale: 1.15,
                  zIndex: 10,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                <div className="relative w-full h-full">
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
                  
                  {/* Border glow animation on hover */}
                  <motion.div
                    className="absolute inset-0 border-2 border-[#acae9f] shadow-lg shadow-[#acae9f]/30"
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      scale: hoveredIndex === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  
                  {/* Image container with zoom effect */}
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Image
                      src={photo}
                      alt={`Référence ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                      quality={90}
                    />
                  </motion.div>
                  
                  {/* Hover overlay simplifié */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    initial={false}
                  >
                    <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full">
                      <svg className="w-5 h-5 text-[#363d43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Lightbox with navigation */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <motion.button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Image counter */}
            <motion.div
              className="absolute top-6 left-6 text-white/80"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-light tracking-[0.15em]" style={{ fontFamily: 'Roboto Condensed, sans-serif' }}>
                {selectedIndex + 1} / {displayImages.length}
              </p>
            </motion.div>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
            
            {/* Main image container */}
            <motion.div 
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center px-20"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1],
                scale: { type: "spring", damping: 25, stiffness: 300 }
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage}
                  alt={`Vue agrandie - Photo ${selectedIndex + 1}`}
                  width={1600}
                  height={1600}
                  className="object-contain w-full h-full drop-shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  quality={95}
                  priority
                />
              </div>
            </motion.div>

            {/* Thumbnail strip at bottom */}
            {displayImages.length > 1 && (
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[600px] overflow-x-auto py-2 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {displayImages.map((photo, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(photo, index);
                    }}
                    className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                      index === selectedIndex 
                        ? 'border-[#acae9f] opacity-100' 
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image
                      src={photo}
                      alt={`Miniature ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}