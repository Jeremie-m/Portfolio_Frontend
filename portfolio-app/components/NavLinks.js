"use client";

import React from 'react';

const NavLinks = ({ onClick, isModal }) => {
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

  return (
    <div className={isModal ? "flex flex-col" : ""}>
      <nav className={navClassName}>
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={linkClassName}
            onClick={onClick}
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      {isModal && (
        <a
          href="#cv"
          className="w-full bg-white rounded-lg py-2 text-center text-[28px] font-semibold font-montserrat text-[#0A52D0] hover:opacity-90 transition-opacity duration-200"
          onClick={onClick}
        >
          Voir mon CV
        </a>
      )}
    </div>
  );
};

export default NavLinks; 