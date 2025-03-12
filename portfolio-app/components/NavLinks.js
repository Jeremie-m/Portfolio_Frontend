"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const NavLinks = ({ onClick, isModal }) => {
  const { isAdmin } = useAuth();
  
  const menuItems = [
    { id: 'whoami', label: 'Qui suis-je ?', href: '#whoami' },
    { id: 'skills', label: 'Mes compétences', href: '#skills' },
    { id: 'projects', label: 'Mes projets', href: '#projects' },
    { id: 'contact', label: 'Me contacter', href: '#contact' },
  ];

  // Styles différents selon le contexte (modal ou desktop)
  const navClassName = isModal 
    ? "flex flex-col space-y-3 mb-5" // Espacement entre les liens et marge en bas
    : "hidden md:flex space-x-8"; // Style pour le desktop

  const linkClassName = isModal
    ? "text-white text-2xl font-montserrat hover:opacity-80 transition-opacity duration-200"
    : "text-white hover:text-primary transition-colors duration-200";

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
    <div className={isModal ? "flex flex-col" : ""}>
      <nav className={navClassName}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={linkClassName}
            onClick={(e) => handleClick(e, item.href)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {isModal && (
        <Link
          href="/cv.pdf"
          target="_blank"
          onClick={(e) => handleClick(e, '#cv')}
          className={`w-full bg-white rounded-lg py-2 text-center text-[28px] font-semibold font-montserrat ${isAdmin ? 'text-[#C8B20C]' : 'text-primary'} hover:opacity-90 transition-opacity duration-200`}
        >
          Voir mon CV
        </Link>
      )}
    </div>
  );
};

export default NavLinks; 