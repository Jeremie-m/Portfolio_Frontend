"use client";

import React, { useState, useEffect } from 'react';
import NavLinks from './NavLinks';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Empêcher le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

      {/* Overlay sombre */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}

      {/* Modal du menu */}
      {isOpen && (
        <div className="fixed top-[20px] inset-x-0 mx-[10px] header-bg rounded-[10px] z-50 transform transition-all duration-300 ease-in-out p-[10px]">
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
          <div className="flex flex-col ">
            <NavLinks onClick={() => setIsOpen(false)} isModal={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu; 