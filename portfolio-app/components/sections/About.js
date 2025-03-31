'use client';

import { useAboutMe } from '@/features/aboutme/hooks/useAboutMe';
import Loader from '@/components/common/Loader';
import AboutMeEditModal from '@/components/modals/form/AboutMeEditModal';
import EditBtn from '@/components/common/EditBtn';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useEffect, useRef } from 'react';

const About = ({ onOpenModal, activeModal }) => {
    const { text, isLoading, error, refreshContent } = useAboutMe();
    const { isAdmin } = useAuth();
    const prevModalRef = useRef(null);
  
  // Rafraîchir les données uniquement quand le modal passe de 'about' à un autre état
  useEffect(() => {
    if (prevModalRef.current === 'about' && activeModal !== 'about') {
      // Rafraîchir les données quand le modal est fermé
      refreshContent();
    }
    
    // Sauvegarder l'état actuel pour la prochaine comparaison
    prevModalRef.current = activeModal;
  }, [activeModal, refreshContent]);

  if (isLoading) {
    return (
      <section id="about" className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" aria-label="À propos de moi - Chargement">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center" aria-label="À propos de moi - Erreur">
        <div className="text-red-500 text-center" role="alert">Une erreur est survenue lors du chargement des données.</div>
      </section>
    );
  }

  return (
    <section id="whoami" className="w-full flex flex-col gap-[10px] px-0 md:px-[20px] lg:px-[40px] py-[16px]" aria-labelledby="about-heading">
      {isAdmin && (
          <div className="w-full flex justify-center mb-2 md:mb-[40px]">
            <EditBtn onOpenModal={onOpenModal} section="about" />
          </div>
      )}
      <div className="w-full px-2 py-4">
        <div className="relative w-full md:max-w-4xl lg:max-w-6xl mx-auto">
          <h2 id="about-heading" className="text-xl md:text-[32px] lg:text-[48px] font-medium font-montserrat text-white mb-6 md:mb-[40px] lg:mb-[60px] text-center">Qui suis-je ?</h2>
          <div className="text-base md:text-[20px] lg:text-[28px] font-montserrat leading-tight whitespace-pre-wrap" aria-label="Présentation personnelle">
            {text}
          </div>
        </div>
      </div>

      <AboutMeEditModal
        isOpen={activeModal === 'about'}
        onClose={() => onOpenModal(null)}
      />
    </section>
  );
};

export default About; 