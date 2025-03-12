"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavLinks from './NavLinks';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Empêcher le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Appliquer le flou à tout le contenu principal
      const mainContent = document.getElementById('main-content');
      const burgerModal = document.getElementById('burger-menu-modal');
      
      if (mainContent) {
        mainContent.style.filter = 'blur(10px)';
        mainContent.style.transition = 'filter 0.3s ease';
      }
      
      // Annuler le flou sur la modal
      if (burgerModal) {
        burgerModal.style.filter = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Retirer le flou
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.filter = 'blur(0px)';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.style.filter = 'blur(0px)';
      }
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay sombre */}
            <motion.div 
              className="fixed inset-0 bg-black z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={toggleMenu}
            />

            {/* Modal du menu */}
            <motion.div 
              id="burger-menu-modal"
              className="fixed top-[10px] inset-x-0 mx-[10px] header-bg rounded-[10px] z-50 p-[10px]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Bouton fermer */}
              <button 
                onClick={toggleMenu}
                className="absolute top-[10px] right-[10px] text-white focus:outline-none transition-colors duration-200"
                aria-label="Fermer le menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation */}
              <div className="flex flex-col">
                <NavLinks onClick={() => setIsOpen(false)} isModal={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BurgerMenu; 