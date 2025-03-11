"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { skills } from "@/mocks/skills"
import Card from "./Card"
import Image from "next/image"

export default function FanCards() {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalAngleRange = 80
  const startAngle = -40

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, skills.length - 1))
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0))
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
  }, [])

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
    const translateX = Math.sin((baseAngle * Math.PI) / 180) * 30
    const translateY = index === activeIndex ? -20 : 0
    const brightness = getBrightness(index)

    return {
      transform: `rotate(${baseAngle}deg) translate(${translateX}px, ${translateY}px)`,
      filter: `brightness(${brightness})`,
      zIndex,
      transformOrigin: "bottom center",
    }
  }

  const handleCardClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <div id="fan-container" className="flex flex-col h-[240px] w-screen">
      <div className="relative w-[96px] mx-auto">
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
        <div className="relative w-full">
          <Image 
            src="/images/hand.svg" 
            alt="Hand" 
            width={100} 
            height={100} 
            className="absolute left-1/2 -translate-x-1/2 mt-[120px] z-999"
          />
        </div>
      </div>
    </div>
  )
}
