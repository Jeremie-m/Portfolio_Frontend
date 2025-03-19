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
        return { width: 40, height: 40 };
      } 
      // Tablette
      else if (windowWidth >= 768 && windowWidth < 1024) {
        switch(type) {
          case 'email': return { width: 109, height: 109 };
          case 'twitter': return { width: 127, height: 127 };
          case 'discord': return { width: 112, height: 112 };
          case 'github': return { width: 129, height: 129 };
          default: return { width: 109, height: 109 };
        }
      } 
      // Desktop
      else {
        switch(type) {
          case 'email': return { width: 208, height: 208 };
          case 'twitter': return { width: 239, height: 239 };
          case 'discord': return { width: 209, height: 209 };
          case 'github': return { width: 250, height: 250 };
          default: return { width: 208, height: 208 };
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
      return { width: 40, height: 40 };
    }
    
    // Mobile
    if (windowWidth < 768) {
      return { width: 40, height: 40 };
    } 
    // Tablette
    else if (windowWidth >= 768 && windowWidth < 1024) {
      switch(type) {
        case 'email': return { width: 109, height: 109 };
        case 'twitter': return { width: 127, height: 127 };
        case 'discord': return { width: 112, height: 112 };
        case 'github': return { width: 129, height: 129 };
        default: return { width: 109, height: 109 };
      }
    } 
    // Desktop
    else {
      switch(type) {
        case 'email': return { width: 208, height: 208 };
        case 'twitter': return { width: 239, height: 239 };
        case 'discord': return { width: 209, height: 209 };
        case 'github': return { width: 250, height: 250 };
        default: return { width: 208, height: 208 };
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
      value: 'wpzputre',
      icon: '/images/contact/discord.svg',
      link: 'https://discord.com/users/wpzputre',
    },
    {
      id: 3,
      type: 'twitter',
      value: '@__Putre__',
      icon: '/images/contact/x.svg',
      link: 'https://twitter.com/__Putre__',
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
    <section id="contact" className="flex flex-col gap-2 md:gap-4 lg:gap-8 items-center self-stretch h-auto min-h-[270px] md:min-h-[400px] lg:min-h-[600px] px-5 md:px-10 lg:px-20">
      <h2 className="font-medium text-[24px] md:text-[40px] lg:text-[64px] font-montserrat text-center text-white mb-8 md:mb-12 lg:mb-16">
        Contact
      </h2>
      
      <div className="w-full max-w-full flex flex-col gap-4 md:gap-8 lg:gap-12">
        {contactInfo.map((item) => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center w-full max-w-full gap-4 md:gap-8 lg:gap-12"
          >
            <div className="flex-shrink-0">
              <Image 
                ref={el => { iconRefs.current[`${item.type}-${item.id}`] = el }}
                src={item.icon} 
                alt={item.type} 
                width={getIconDimensions(item.type).width}
                height={getIconDimensions(item.type).height}
                className="w-auto h-auto"
                unoptimized={true}
                style={{}}
              />
            </div>
            <div className="flex-grow overflow-hidden">
              <span className="text-[14px] md:text-[24px] lg:text-[36px] leading-[16px] md:leading-[32px] lg:leading-[48px] font-montserrat text-right text-white block truncate float-right w-full">
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