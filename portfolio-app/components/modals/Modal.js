'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Modal({ isOpen, onClose, title, children, level = 1, id }) {
  // Calcul des z-index en fonction du level
  const baseZIndex = 140;
  const overlayZIndex = baseZIndex + (level - 1) * 2;
  const modalZIndex = overlayZIndex + 1;
  
  // Générer un ID unique pour l'accessibilité si aucun n'est fourni
  const modalId = id || `modal-${Math.random().toString(36).substring(2, 11)}`;
  const titleId = `${modalId}-title`;

  const overlayVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 0.8,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const modalVariants = {
    hidden: { 
      y: -1000,
      scale: 0.5,
      opacity: 0
    },
    visible: { 
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      y: 20,
      scale: 0.9,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sombre */}
          <motion.div 
            key="overlay"
            className="fixed inset-0 bg-black/100"
            style={{ zIndex: overlayZIndex }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            key="modal"
            className="fixed top-[10px] inset-x-0 mx-[10px] md:top-[72px] md:max-w-2xl md:mx-auto lg:top-[88px] lg:max-w-4xl header-bg rounded-[10px] p-[10px] md:p-[16px] lg:p-[20px]"
            style={{ zIndex: modalZIndex }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            id={modalId}
          >
            {/* Header avec titre et bouton fermer */}
            <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-montserrat" id={titleId}>{title}</h2>
              <button 
                onClick={onClose}
                className="text-white focus:outline-none transition-colors duration-200"
                aria-label="Fermer la modale"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Ligne de séparation */}
            <div className="w-full h-[1px] bg-white/20 mb-4 md:mb-5 lg:mb-6" />

            {/* Corps de la modale */}
            <div className="text-white">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Définir explicitement le nom du composant
Modal.displayName = 'Modal';

export default Modal; 