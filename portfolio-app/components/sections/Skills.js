"use client";

import React, { useState, useEffect } from 'react';
import FanCards from '@/components/common/FanCards';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import EditBtn from '@/components/common/EditBtn';
import SkillsEditModal from '@/components/modals/form/SkillsEditModal';
import { useSkills } from '@/features/skills/hooks/useSkills';
import Loader from '@/components/common/Loader';

const Skills = ({ onOpenModal, activeModal }) => {
    const { isLoading, error } = useSkills();
    const { isAdmin } = useAuth();
    // État local pour suivre si le composant est réellement prêt
    const [isComponentReady, setIsComponentReady] = useState(false);
    
    // Vérifier si les données sont chargées
    useEffect(() => {
      if (!isLoading) {
        // Ajouter un petit délai pour s'assurer que tout est prêt
        const timer = setTimeout(() => {
          setIsComponentReady(true);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }, [isLoading]);

  // Afficher uniquement le loader pendant le chargement
  if (isLoading || !isComponentReady) {
    return (
      <section id="skills" className="w-full min-h-[400px] md:min-h-[600px] lg:min-h-[800px] flex items-center justify-center" aria-label="Compétences - Chargement">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="w-full min-h-[400px] md:min-h-[600px] lg:min-h-[800px] flex items-center justify-center" aria-label="Compétences - Erreur">
        <div className="text-red-500 text-center" role="alert">Une erreur est survenue lors du chargement des données.</div>
      </section>
    );
  }
  
  return (
    <section id="skills" className="w-full flex flex-col gap-[10px] px-[10px] md:px-[20px] lg:px-[40px] py-[16px]" aria-labelledby="skills-heading">
      {isAdmin && (
        <div className="w-full flex justify-center mb-2 md:mb-[40px]">
          <EditBtn onOpenModal={onOpenModal} section="skills" />
        </div>
      )}
      <div className="w-full flex flex-col items-center gap-8 md:gap-20 lg:gap-30">
        <h2 id="skills-heading" className="font-medium text-[24px] md:text-[40px] lg:text-[64px] text-center text-white font-montserrat">
          Mes Compétences
        </h2>
        <div className="w-full">
          <FanCards />
        </div>
      </div>

      <SkillsEditModal
        isOpen={activeModal === 'skills'}
        onClose={() => onOpenModal(null)}
      />
    </section>
  );
};

export default Skills; 