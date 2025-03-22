'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import EditBtn from '@/components/common/EditBtn';
import ProjectsEditModal from '@/components/modals/form/ProjectsEditModal';
import Loader from '@/components/common/Loader';

const Projects = ({ onOpenModal, activeModal }) => {
  const { isAdmin } = useAuth();
  const { projects, isLoading } = useProjects();
  const [visibleProjects, setVisibleProjects] = useState(2);
  const [projectsPerLoad, setProjectsPerLoad] = useState(2);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Références aux icônes
  const githubIconRefs = useRef({});
  const demoIconRefs = useRef({});

  // Vérifier la taille de l'écran et définir les valeurs appropriées
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // Déterminer le type d'appareil
      if (width >= 1024) { // Desktop
        setIsDesktop(true);
        setIsTablet(false);
        setProjectsPerLoad(3);
        setVisibleProjects(prevVisible => {
          // Si on vient de passer en desktop, régler à 6 projets
          if (!isDesktop) return 6;
          return prevVisible;
        });
      } else if (width >= 768) { // Tablette
        setIsDesktop(false);
        setIsTablet(true);
        setProjectsPerLoad(2);
        setVisibleProjects(prevVisible => {
          // Si on vient de passer en tablette, régler à 4 projets
          if (!isTablet) return 4;
          return prevVisible;
        });
      } else { // Mobile
        setIsDesktop(false);
        setIsTablet(false);
        setProjectsPerLoad(2);
        setVisibleProjects(prevVisible => {
          // Si on vient de passer en mobile, régler à 2 projets
          if (isTablet || isDesktop) return 2;
          return prevVisible;
        });
      }
    };
    
    // Vérifier au chargement
    handleResize();
    
    // Vérifier à chaque redimensionnement
    window.addEventListener('resize', handleResize);
    
    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', handleResize);
  }, [isTablet, isDesktop]);
  
  // Appliquer les tailles d'icônes en fonction de la taille de l'écran
  useEffect(() => {
    if (!isMounted) return;
    
    // Parcourir toutes les références d'icônes
    Object.entries(githubIconRefs.current).forEach(([key, ref]) => {
      if (ref) {
        let width, height;
        
        // Mobile
        if (windowWidth < 768) {
          width = 40;
          height = 40;
        } 
        // Tablette
        else if (windowWidth >= 768 && windowWidth < 1024) {
          width = 60;
          height = 60;
        } 
        // Desktop
        else {
          width = 80;
          height = 80;
        }
        
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
    
    // Même chose pour les icônes de démo
    Object.entries(demoIconRefs.current).forEach(([key, ref]) => {
      if (ref) {
        let width, height;
        
        // Mobile
        if (windowWidth < 768) {
          width = 60;
          height = 60;
        } 
        // Tablette
        else if (windowWidth >= 768 && windowWidth < 1024) {
          width = 80;
          height = 80;
        } 
        // Desktop
        else {
          width = 120;
          height = 120;
        }
        
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

  // Fonction pour charger plus de projets
  const loadMoreProjects = () => {
    setVisibleProjects(prev => Math.min(prev + projectsPerLoad, projects.length));
  };

  // Déterminer les projets à afficher
  const projectsToDisplay = projects ? projects.slice(0, visibleProjects) : [];

  // Obtenir les dimensions initiales des icônes
  const getIconDimensions = (type) => {
    if (!isMounted) {
      return type === 'github' ? { width: 40, height: 40 } : { width: 60, height: 60 };
    }
    
    if (windowWidth >= 1024) { // Desktop
      return type === 'github' ? { width: 80, height: 80 } : { width: 120, height: 120 };
    } else if (windowWidth >= 768) { // Tablette
      return type === 'github' ? { width: 60, height: 60 } : { width: 80, height: 80 };
    } else { // Mobile
      return type === 'github' ? { width: 40, height: 40 } : { width: 60, height: 60 };
    }
  };

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
      y: 50,
      style: {
        transformOrigin: "center bottom"
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      style: {
        transformOrigin: "center bottom"
      },
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      style: {
        transformOrigin: "center bottom"
      },
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  // Afficher le loader si les données sont en cours de chargement ou le composant n'est pas monté
  if (isLoading || !isMounted || !projects) {
    return (
      <div className="w-full flex flex-col gap-[10px] px-[10px] py-[16px]">
        <div className="flex justify-center items-center h-[300px] md:h-[400px] lg:h-[500px]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-[10px] px-[10px] py-[16px]">
      {isAdmin && (
        <div className="w-full flex justify-center mb-2 md:mb-8 lg:mb-14">
          <EditBtn onOpenModal={onOpenModal} section="projects" />
        </div>
      )}
      <section id="projects" className="w-full flex flex-col items-center gap-8 md:gap-16 lg:gap-24 md:mb-8 lg:mb-12">
        <h2 className="font-medium text-[24px] md:text-[40px] lg:text-[64px] leading-[16px] text-center text-white font-montserrat">
          Mes Projets
        </h2>
        
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 md:px-10 lg:px-20"
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
                className={`w-full h-full flex flex-col header-bg rounded-lg overflow-hidden ${isAdmin ? '[filter:drop-shadow(0_4px_10px_#EED40B)]' : '[filter:drop-shadow(0_4px_10px_#0B61EE)]'}`}
              >
                <div className="w-full h-40 relative">
                  <Image 
                    src={project.image_url} 
                    alt={project.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Image du projet: {project.title}
                  </div>
                </div>
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-white mb-4 md:mb-6 lg:mb-8" id={`project-title-${project.id}`}>{project.title}</h3>
                    <h4 className="text-sm md:text-[16px] lg:text-[24px] font-montserrat text-white mb-6 md:mb-8 lg:mb-10 leading-relaxed" id={`project-description-${project.id}`} aria-describedby={`project-title-${project.id}`}>{project.description}</h4>
                  </div>
                  
                  <div className="mt-auto pt-4 md:pt-6 lg:pt-8">
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6 lg:mb-8" aria-label="Technologies utilisées">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="text-xs md:text-[16px] lg:text-[24px] font-montserrat text-white bg-primary-dark px-2 py-1 border border-primary rounded-xl" role="listitem">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <a 
                        href={project.github_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex flex-col justify-center items-center"
                        aria-label={`Voir le code source de ${project.title} sur GitHub (s'ouvre dans un nouvel onglet)`}
                      >
                        <Image 
                          ref={el => { githubIconRefs.current[project.id] = el }}
                          src="/images/github-logo.svg" 
                          alt="" 
                          width={getIconDimensions('github').width}
                          height={getIconDimensions('github').height}
                          className="w-auto h-auto"
                          unoptimized={true}
                          style={{}}
                          aria-hidden="true"
                        />
                      </a>
                      <a 
                        href={project.demo_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`Voir la démo de ${project.title} (s'ouvre dans un nouvel onglet)`}
                      >
                        <Image 
                          ref={el => { demoIconRefs.current[project.id] = el }}
                          src="/images/arrow.svg" 
                          alt="" 
                          width={getIconDimensions('demo').width}
                          height={getIconDimensions('demo').height}
                          className="w-auto h-auto"
                          unoptimized={true}
                          style={{}}
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Afficher le bouton "Voir plus" s'il reste des projets à afficher */}
        {visibleProjects < projects.length && (
          <motion.button 
            onClick={loadMoreProjects}
            className={`h-12 md:h-18 lg:h-20 w-[143px] md:w-[280px] lg:w-[320px] flex flex-col justify-center items-center gap-2 rounded-lg cursor-pointer header-bg ${isAdmin ? '[filter:drop-shadow(0_2px_4px_#EED40B)]' : '[filter:drop-shadow(0_2px_4px_#0B61EE)]'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="self-stretch grow px-2 py-2.5 flex flex-col justify-center items-center">
              <span className="font-medium text-xs md:text-[20px] lg:text-[24px] text-center text-white font-inter">
                Voir plus de projets
                {isDesktop && <span className="hidden lg:inline"> (+3)</span>}
                {isTablet && <span className="hidden md:inline lg:hidden"> (+2)</span>}
                {!isTablet && !isDesktop && <span className="inline md:hidden"> (+2)</span>}
              </span>
            </div>
          </motion.button>
        )}
      </section>

      <ProjectsEditModal
        isOpen={activeModal === 'projects'}
        onClose={() => onOpenModal(null)}
      />
    </div>
  );
};

export default Projects; 