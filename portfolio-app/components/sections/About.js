'use client';

import { useAboutMe } from '@/features/aboutme/hooks/useAboutMe';
import Loader from '@/components/common/Loader';
import AboutMeEditModal from '@/components/modals/form/AboutMeEditModal';
import EditBtn from '@/components/common/EditBtn';
import { useAuth } from '@/features/auth/contexts/AuthContext';

const About = ({ onOpenModal, activeModal }) => {
    const { content, isLoading, error } = useAboutMe();
    const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <section id="about" className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
        <div className="text-red-500 text-center">Une erreur est survenue lors du chargement des données.</div>
      </section>
    );
  }

  return (
    <section id="whoami" className="w-full flex flex-col gap-[10px] px-0 md:px-[20px] lg:px-[40px] py-[16px]">
      {isAdmin && (
          <div className="w-full flex justify-center mb-2 md:mb-[40px]">
            <EditBtn onOpenModal={onOpenModal} section="about" />
          </div>
      )}
      <div className="w-full px-2 py-4">
        <div className="relative w-full md:max-w-4xl lg:max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-[40px] lg:text-[64px] font-medium font-montserrat text-white mb-8 md:mb-[60px] lg:mb-[100px] text-center">Qui suis-je ?</h2>
          <div className="text-lg md:text-[24px] lg:text-[32px] font-montserrat leading-relaxed whitespace-pre-wrap">
            {content}
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