"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '@/features/skills/hooks/useSkills';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAboutMe } from '@/features/aboutme/hooks/useAboutMe';

const Separation = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { isLoading: skillsLoading } = useSkills();
  const { isLoading: projectsLoading } = useProjects();
  const { isLoading: aboutLoading } = useAboutMe();
  
  useEffect(() => {
    // Vérifier si toutes les sections principales sont chargées
    if (!skillsLoading && !projectsLoading && !aboutLoading) {
      // Ajouter un petit délai pour s'assurer que les composants sont bien rendus
      const timer = setTimeout(() => {
        setIsPageLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [skillsLoading, projectsLoading, aboutLoading]);
  
  // Ne pas afficher le séparateur tant que la page n'est pas chargée
  if (!isPageLoaded) {
    return null;
  }

  // Variantes pour l'animation
  const separationVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="w-full flex justify-center items-center"
      initial="hidden"
      animate="visible"
      variants={separationVariants}
    >
      <motion.div className="w-full max-w-[1200px] mx-auto h-[1px] bg-white"></motion.div>
    </motion.div>
  );
};

export default Separation; 