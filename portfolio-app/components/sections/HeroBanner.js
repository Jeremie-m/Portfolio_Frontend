"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion'; 
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useHeroBanner } from '@/features/herobanner/hooks/useHeroBanner';
import EditBtn from '@/components/common/EditBtn';
import HeroEditModal from '@/components/modals/form/HeroEditModal';
import DynamicTypewriter from '@/components/common/DynamicTypewriter';

const HeroBanner = ({ onOpenModal, activeModal }) => {
  const { isAdmin } = useAuth();
  const { texts, isLoading } = useHeroBanner();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef(null);

  // Fonction pour calculer la distance entre le curseur et le centre de l'image
  const calculateIntensity = (mouseX, mouseY, rect) => {
    if (!rect) return 0;
    
    // Centre de l'image
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance entre le curseur et le centre
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + 
      Math.pow(mouseY - centerY, 2)
    );
    
    // Distance maximale (rayon du cercle entourant l'image)
    const maxDistance = Math.sqrt(
      Math.pow(rect.width / 2, 2) + 
      Math.pow(rect.height / 2, 2)
    );
    
    // Plus la distance est petite, plus l'intensité est grande
    // Inverser la relation distance/intensité
    return 1 - Math.min(distance / maxDistance, 1);
  };

  // Gestionnaire de mouvement de souris avec useCallback
  const handleMouseMove = useCallback((e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const intensity = calculateIntensity(e.clientX, e.clientY, rect);
      setMousePosition({ x: e.clientX, y: e.clientY, intensity });
    }
  }, []);

  // Effet pour ajouter et retirer les écouteurs d'événements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [handleMouseMove]);

  // Calculer la valeur de drop-shadow en fonction de la position de la souris
  const calculateDropShadow = () => {
    if (!isHovering || mousePosition.intensity === undefined) {
      return isAdmin ? 'drop-shadow(0 4px 10px #EED40B)' : 'drop-shadow(0 4px 10px #0B61EE)';
    }
    
    // Intensité maximale du drop-shadow
    const maxBlur = 20;
    const maxSpread = 15;
    
    // Calculer les valeurs en fonction de l'intensité
    const blur = Math.floor(10 + (maxBlur - 10) * mousePosition.intensity);
    const spread = Math.floor(4 + (maxSpread - 4) * mousePosition.intensity);
    
    const color = isAdmin ? '#EED40B' : '#0B61EE';
    
    return `drop-shadow(0 ${spread}px ${blur}px ${color})`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <section className="w-full flex flex-col gap-[10px] px-[20px] md:px-[40px] lg:px-[60px] py-[10px]" aria-label="Présentation personnelle">
        {isAdmin && (
          <div className="w-full flex justify-center mb-[40px]">
            <EditBtn onOpenModal={onOpenModal} section="hero" />
          </div>
        )}
        <div className="w-full flex items-start gap-4 justify-between">
          <h1 className="flex flex-col flex-start md:text-left w-[50%]" id="main-heading">
            <motion.span 
              className="text-white font-noto-sans text-[28px] md:text-[64px] lg:text-[96px] ml-[4px] md:ml-[8px] lg:ml-[10px]"
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                duration: 1,
                bounce: 0.1
              }}
            >
              Je suis
            </motion.span>
            {isAdmin ? (
              <span className="font-jetbrains-mono text-[22px] md:text-[48px] lg:text-[84px] text-white">
                En Mode Admin_
              </span>
            ) : (
              <DynamicTypewriter 
                texts={texts}
                speed={100}
                className="font-jetbrains-mono text-[16px] md:text-[42px] lg:text-[58px] text-white"
                aria-live="polite"
              />
            )}
          </h1>
          
          <motion.div 
            ref={imageRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative w-[130px] h-[130px] min-w-[130px] min-h-[130px] md:w-[284px] md:h-[284px] md:min-w-[284px] md:min-h-[284px] lg:w-[400px] lg:h-[400px] lg:min-w-[400px] lg:min-h-[400px] rounded-full overflow-hidden transition-all duration-300`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 }}}
            style={{
              borderRadius: "50%",
              filter: calculateDropShadow(),
            }}
            aria-hidden="false"
            role="img"
            aria-label="Photo de profil de Jérémie Marie"
          >
            <Image 
              src="/images/profil.webp" 
              alt="Jérémie Marie" 
              fill
              sizes="(max-width: 744px) 130px, 284px"
              className="object-cover"
              priority 
            />
          </motion.div>
        </div>
      </section>

      <HeroEditModal 
        isOpen={activeModal === 'hero'}
        onClose={() => onOpenModal(null)}
      />
    </div>
  );
};

export default HeroBanner; 