"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/contexts/AuthContext';

const NavLinks = ({ onClick, isModal }) => {
  const { isAdmin } = useAuth();
  
  const menuItems = [
    { id: 'whoami', label: 'Qui suis-je ?', href: '#whoami' },
    { id: 'skills', label: 'Compétences', href: '#skills' },
    { id: 'projects', label: 'Projets', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  // Styles différents selon le contexte (modal ou desktop)
  const navClassName = isModal 
    ? "flex flex-col space-y-3 mb-5" // Espacement entre les liens et marge en bas
    : "hidden md:flex space-x-4 lg:space-x-8 items-center"; // Style pour le desktop avec des espacements différents selon la taille

  const linkClassName = isModal
    ? "text-white text-2xl font-montserrat hover:opacity-80 transition-opacity duration-200"
    : "text-white md:text-[16px] lg:text-[18px] font-montserrat hover:text-primary transition-colors duration-200";

  const handleClick = (e, href) => {
    e.preventDefault();
    
    // Fermer la modal si nécessaire
    if (onClick) {
      onClick();
    }

    // Petit délai pour laisser la modal se fermer
    setTimeout(() => {
      // Trouver l'élément cible
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // Scroll vers l'élément avec un offset pour la navbar
        const offset = 80; // Ajustez selon la hauteur de votre navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  return (
    <div className={isModal ? "flex flex-col" : "flex items-center"}>
      <nav className={navClassName} aria-label="Menu principal">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={linkClassName}
            onClick={(e) => handleClick(e, item.href)}
            aria-current={typeof window !== 'undefined' && item.href === `#${window?.location?.hash?.substring(1) || ''}` ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {isModal ? (
        <Link
          href="/cv.pdf"
          target="_blank"
          onClick={(e) => handleClick(e, '#cv')}
          className={`w-full bg-white rounded-lg py-2 text-center text-[28px] font-semibold font-montserrat ${isAdmin ? 'text-[#C8B20C]' : 'text-primary'} hover:opacity-90 transition-opacity duration-200`}
          aria-label="Télécharger mon CV au format PDF"
          rel="noopener noreferrer"
        >
          Voir mon CV <span className="sr-only">(s'ouvre dans un nouvel onglet, format PDF)</span>
        </Link>
      ) : (
        <Link
          href="/cv.pdf"
          target="_blank"
          className={`hidden md:block bg-white rounded-[48px] px-4 py-1 ml-4 text-[16px] lg:text-[20px] font-semibold font-montserrat ${isAdmin ? 'text-[#C8B20C]' : 'text-primary'} hover:opacity-90 transition-opacity duration-200`}
          aria-label="Télécharger mon CV au format PDF"
          rel="noopener noreferrer"
        >
          Voir mon CV <span className="sr-only">(s'ouvre dans un nouvel onglet, format PDF)</span>
        </Link>
      )}
    </div>
  );
};

export default NavLinks; 