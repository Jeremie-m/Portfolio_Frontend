'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Contact = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Références pour les icônes
  const iconRefs = useRef({});
  
  // Vérifier la taille de l'écran et définir la largeur de la fenêtre
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Vérifier au chargement
    handleResize();
    
    // Vérifier à chaque redimensionnement
    window.addEventListener('resize', handleResize);
    
    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Appliquer les tailles d'icônes en fonction de la taille de l'écran
  useEffect(() => {
    if (!isMounted) return;
    
    // Obtenir les dimensions pour chaque type d'icône
    const getDimensions = (type) => {
      // Mobile
      if (windowWidth < 768) {
        return { width: 25, height: 25 };
      } 
      // Tablette
      else if (windowWidth >= 768) {
        switch(type) {
          case 'email': return { width: 60, height: 60 };
          case 'twitter': return { width: 70, height: 70 };
          case 'discord': return { width: 65, height: 65 };
          case 'github': return { width: 70, height: 70 };
          default: return { width: 60, height: 60 };
        }
      } 
      // Desktop
      else {
        switch(type) {
          case 'email': return { width: 90, height: 90 };
          case 'twitter': return { width: 100, height: 100 };
          case 'discord': return { width: 95, height: 95 };
          case 'github': return { width: 100, height: 100 };
          default: return { width: 90, height: 90 };
        }
      }
    };
    
    // Parcourir toutes les références d'icônes
    Object.entries(iconRefs.current).forEach(([key, ref]) => {
      if (ref) {
        const type = key.split('-')[0]; // Récupérer le type à partir de la clé (email-1, discord-2, etc.)
        const { width, height } = getDimensions(type);
        
        // Appliquer les styles
        ref.style.cssText = `
          width: ${width}px !important;
          height: ${height}px !important;
          min-width: ${width}px;
          min-height: ${height}px;
          object-fit: contain;
        `;
      }
    });
  }, [windowWidth, isMounted]);
  
  // Obtenir les dimensions initiales des icônes
  const getIconDimensions = (type) => {
    if (!isMounted) {
      return { width: 25, height: 25 };
    }
    
    // Mobile
    if (windowWidth < 768) {
      return { width: 25, height: 25 };
    } 
    // Tablette
    else if (windowWidth >= 768 && windowWidth < 1024) {
      switch(type) {
        case 'email': return { width: 60, height: 60 };
        case 'twitter': return { width: 70, height: 70 };
        case 'discord': return { width: 65, height: 65 };
        case 'github': return { width: 70, height: 70 };
        default: return { width: 60, height: 60 };
      }
    } 
    // Desktop
    else {
      switch(type) {
        case 'email': return { width: 90, height: 90 };
        case 'twitter': return { width: 100, height: 100 };
        case 'discord': return { width: 95, height: 95 };
        case 'github': return { width: 100, height: 100 };
        default: return { width: 90, height: 90 };
      }
    }
  };

  const contactInfo = [
    {
      id: 1,
      type: 'email',
      value: 'contact@jeremie-m.dev',
      icon: '/images/contact/mail.svg',
      link: 'mailto:contact@jeremie-m.dev',
    },
    {
      id: 2,
      type: 'discord',
      value: 'jeremie_m_dev',
      icon: '/images/contact/discord.svg',
      link: 'https://discord.com/users/jeremie_m_dev',
    },
    {
      id: 3,
      type: 'twitter',
      value: '@jeremie_m_dev',
      icon: '/images/contact/x.svg',
      link: 'https://twitter.com/jeremie_m_dev',
    },
    {
      id: 4,
      type: 'github',
      value: 'github.com/jeremie-m',
      icon: '/images/contact/github-logo.svg',
      link: 'https://github.com/jeremie-m',
    },
  ];

  return (
    <section id="contact" className="flex flex-col gap-2 md:gap-4 lg:gap-8 items-center self-stretch h-auto min-h-[270px] md:min-h-[400px] lg:min-h-[600px] lg:w-[800px] lg:mx-auto px-5 md:px-10 lg:px-20" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="font-medium text-xl md:text-[32px] lg:text-[48px] font-montserrat text-center text-white mb-6 md:mb-[40px] lg:mb-[60px]">
        Contact
      </h2>
      
      <div className="w-full max-w-[600px] flex flex-col gap-4 md:gap-8 lg:gap-12 self-end" role="list">
        {contactInfo.map((item) => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center w-full max-w-[600px] gap-2 md:gap-4 lg:gap-6"
            aria-label={`Me contacter par ${item.type}: ${item.value} (s'ouvre dans un nouvel onglet)`}
            role="listitem"
          >
            <div className="flex-shrink-0">
              <Image 
                ref={el => { iconRefs.current[`${item.type}-${item.id}`] = el }}
                src={item.icon} 
                alt="" 
                width={getIconDimensions(item.type).width}
                height={getIconDimensions(item.type).height}
                className="w-auto h-auto"
                unoptimized={true}
                style={{}}
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm md:text-base lg:text-xl leading-relaxed font-montserrat text-white block text-right truncate">
                {item.value}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact; 