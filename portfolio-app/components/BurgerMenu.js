"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavLinks from './NavLinks';

const BurgerMenu = ({ onOpenModal, activeModal }) => {
  // Variants pour les animations
  const overlayVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 0.7,
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
    <div className="md:hidden"> {/* Visible uniquement sur mobile */}
      {/* Bouton hamburger */}
      <button 
        onClick={() => onOpenModal('menu')}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
        aria-label="Menu"
      >
        <span className="block w-6 h-0.5 bg-white transition-transform duration-300"></span>
        <span className="block w-6 h-0.5 bg-white transition-opacity duration-300"></span>
        <span className="block w-6 h-0.5 bg-white transition-transform duration-300"></span>
      </button>

      <AnimatePresence>
        {activeModal === 'menu' && (
          <>
            {/* Overlay sombre */}
            <motion.div 
              className="fixed inset-0 bg-black z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => onOpenModal(null)}
            />

            {/* Modal du menu */}
            <motion.div 
              id="burger-menu-modal"
              className="fixed top-[10px] inset-x-0 mx-[10px] header-bg rounded-[10px] z-9999 p-[10px]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Bouton fermer */}
              <button 
                onClick={() => onOpenModal(null)}
                className="absolute top-[10px] right-[10px] text-white focus:outline-none transition-colors duration-200"
                aria-label="Fermer le menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation */}
              <div className="flex flex-col">
                <NavLinks onClick={() => onOpenModal(null)} isModal={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BurgerMenu; 