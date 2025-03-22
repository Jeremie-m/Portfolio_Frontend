"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Card from "./Card"
import Image from "next/image"
import { useSkills } from "@/features/skills/hooks/useSkills"

export default function FanCards() {
  const { skills } = useSkills();
  const [activeIndex, setActiveIndex] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isRendered, setIsRendered] = useState(false)
  const totalAngleRange = 70
  const startAngle = -30
  
  // État pour suivre si le composant est monté côté client
  const [isMounted, setIsMounted] = useState(false)
  
  // Référence à l'image de la main
  const handRef = useRef(null)
  
  // S'assurer que le code s'exécute uniquement côté client
  useEffect(() => {
    setIsMounted(true)
    setWindowWidth(window.innerWidth)
    
    // Fonction pour mettre à jour la largeur lors du redimensionnement
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    // Ajouter l'écouteur d'événement
    window.addEventListener('resize', handleResize)
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Utiliser un effet pour appliquer manuellement les styles selon la taille d'écran
  useEffect(() => {
    if (!isMounted || !handRef.current) return;

    // Mobile
    let width = 90
    let height = 108
    let marginBottom = -250
    let marginTop = 140
    
    // Tablette
    if (windowWidth >= 768 && windowWidth < 1024) {
      width = 210
      height = 252
      marginBottom = -540
      marginTop = 320
    } 
    // Desktop
    else if (windowWidth >= 1024) {
      width = 406
      height = 486
      marginBottom = -940
      marginTop = 520
    }
    
    // Appliquer les styles de manière explicite et avec force
    handRef.current.style.cssText = `
      width: ${width}px !important;
      height: ${height}px !important;
      margin-top: ${marginTop}px;
      margin-bottom: ${marginBottom}px;
      object-fit: contain;
      min-width: ${width}px;
      min-height: ${height}px;
    `;
    
    // Indiquer que le rendu est terminé après un court délai
    setTimeout(() => {
      setIsRendered(true);
    }, 200);
    
  }, [windowWidth, handRef, isMounted])

  useEffect(() => {
    if (!isMounted) return;
    
    const handleWheel = (e) => {
      // Si on défile vers le bas
      if (e.deltaY > 0) {
        // Si on n'est pas à la dernière carte, on prévient le comportement par défaut
        if (activeIndex < skills.length - 1) {
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, skills.length - 1));
        }
        // Sinon, on laisse le scroll de la page se faire normalement
      } 
      // Si on défile vers le haut
      else {
        // Si on n'est pas à la première carte, on prévient le comportement par défaut
        if (activeIndex > 0) {
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
        // Sinon, on laisse le scroll de la page se faire normalement
      }
    }

    const container = document.getElementById("fan-container")
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [skills.length, isMounted, activeIndex])

  const getBrightness = (index) => {
    const distance = Math.abs(index - activeIndex)

    if (distance === 0) return 1 // Carte active : luminosité normale
    if (distance > 3) return 0 // Au-delà de 3 cartes : noir complet

    // Pour les 3 cartes avant et après : dégradé progressif vers le noir
    return 1 - distance * 0.33
  }

  const calculateCardStyle = (index) => {
    const totalCards = skills.length
    const angleIncrement = totalAngleRange / (totalCards - 1)
    const baseAngle = startAngle + index * angleIncrement
    const zIndex = totalCards - Math.abs(index - activeIndex)
    
    // Valeurs de base pour mobile
    let translateX = Math.sin((baseAngle * Math.PI) / 180) * 30
    let translateY = index === activeIndex ? -20 : 0
    
    // Ajustements pour tablette et desktop
    if (windowWidth >= 1024) { // Desktop
      translateX = Math.sin((baseAngle * Math.PI) / 180) * 120
      translateY = index === activeIndex ? -80 : 0
    } else if (windowWidth >= 744) { // Tablette
      translateX = Math.sin((baseAngle * Math.PI) / 180) * 60
      translateY = index === activeIndex ? -40 : 0
    }
    
    const brightness = getBrightness(index)

    return {
      transform: `rotate(${baseAngle}deg) translate(${translateX}px, ${translateY}px)`,
      filter: `brightness(${brightness})`,
      zIndex,
      transformOrigin: "bottom center",
    };
  }

  const handleCardClick = (index) => {
    setActiveIndex(index)
  }
  
  // Si les skills ne sont pas encore chargés ou que le composant n'est pas monté,
  // on ne rend rien pour éviter un affichage partiel
  if (!skills || skills.length === 0 || !isMounted) {
    return null;
  }
  
  // Détermination des dimensions à utiliser pour le rendu initial
  const getHandDimensions = () => {
    if (!isMounted) return { width: 190, height: 190, marginBottom: -220 };
    
    if (windowWidth >= 1024) {
      return { width: 406, height: 486, marginBottom: -320 };
    } else if (windowWidth >= 744) {
      return { width: 210, height: 252, marginBottom: -240 };
    } else {
      return { width: 190, height: 190, marginBottom: -220 };
    }
  };
  
  const handDimensions = getHandDimensions();

  return (
    <div id="fan-container" className="flex flex-col h-[280px] md:h-[600px] lg:h-[1000px] w-full max-w-full">
      <div className="relative w-24 md:w-[397.5px] lg:w-[768px] mx-auto">
        <AnimatePresence>
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 1, y: 20 }}
              animate={{
                ...calculateCardStyle(index),
              }}
              exit={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleCardClick(index)}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            >
              <Card skill={skill} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Main */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 z-[99]">
          <Image 
            ref={handRef}
            src="/images/hand.svg" 
            alt="Hand" 
            width={handDimensions.width}
            height={handDimensions.height}
            priority={true}
            unoptimized={true}
            style={{}}
          />
        </div>
      </div>
    </div>
  )
}
