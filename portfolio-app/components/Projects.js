'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../mocks/projects';

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  // Vérifier si l'écran est en mode mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Vérifier à chaque redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fonction pour charger plus de projets
  const loadMoreProjects = () => {
    setVisibleProjects(prev => Math.min(prev + 2, projects.length));
  };

  // Déterminer les projets à afficher
  const projectsToDisplay = isMobile 
    ? projects.slice(0, visibleProjects) 
    : projects;

  // Variants pour l'animation des projets
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    }
  };

  const projectVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section id="projects" className="w-full flex flex-col items-center gap-8">
      <h2 className="font-medium text-[24px] leading-[16px] text-center text-white font-montserrat">
        Mes Projets
      </h2>
      
      <motion.div 
        className="w-full flex flex-col gap-8 px-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {projectsToDisplay.map((project) => (
            <motion.div 
              key={project.id}
              variants={projectVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full header-bg rounded-lg overflow-hidden [filter:drop-shadow(0_4px_8px_#0B61EE)]"
            >
              <div className="w-full h-40 relative">
                <Image src={project.image_url} alt={project.title} layout="fill" objectFit="cover" />
                <div className="w-full h-full flex items-center justify-center text-white">
                  Image du projet: {project.title}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-[24px] font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm font-montserrat text-white mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="text-xs font-montserrat text-white bg-primary-dark px-2 py-1 border border-primary rounded-xl">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                    <Image src="/images/github-logo.svg" alt="GitHub" width={40} height={40} />
                  </a>
                  <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                    <Image src="/images/arrow.svg" alt="Voir Démo" width={40} height={40} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Afficher le bouton "Voir plus" uniquement en mode mobile et s'il reste des projets à afficher */}
      {isMobile && visibleProjects < projects.length ? (
        <motion.button 
          onClick={loadMoreProjects}
          className="h-12 w-[143px] flex flex-col justify-center items-center gap-2 rounded-lg cursor-pointer header-bg [filter:drop-shadow(0_2px_4px_#0B61EE)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="self-stretch grow px-2 py-2.5">
            <span className="font-medium text-xs text-center text-white font-inter">Voir plus de projets</span>
          </div>
        </motion.button>
      ) : null}
    </section>
  );
};

export default Projects; 