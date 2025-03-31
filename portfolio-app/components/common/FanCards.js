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
  const totalAngleRange = 80
  const startAngle = -40
  
  // S'assurer que le code s'exécute uniquement côté client
  useEffect(() => {
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
    
    
  }, [windowWidth])

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
    let translateY = index === activeIndex ? -10 : 0
    
    // Ajustements pour tablette et desktop
    if (windowWidth >= 1024) { // Desktop
      translateX = Math.sin((baseAngle * Math.PI) / 180) * 120
      translateY = index === activeIndex ? -40 : 0
    } else if (windowWidth >= 744) { // Tablette
      translateX = Math.sin((baseAngle * Math.PI) / 180) * 60
      translateY = index === activeIndex ? -20 : 0
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

  const handleHover = (index) => {
    setActiveIndex(index)
  }

  return (
    <div id="fan-container" className="flex flex-col h-[126px] md:h-[280px] lg:h-[490px] w-full max-w-full">
      <div className="relative w-16 md:w-[278px] lg:w-[537px] mx-auto">
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
              onMouseEnter={() => handleHover(index)}
              className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
            >
              <Card skill={skill} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
