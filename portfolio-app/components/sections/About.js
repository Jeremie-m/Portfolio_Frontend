'use client';

import { useAboutMe } from '@/hooks/useAboutMe';
import Loader from '@/components/ui/Loader';
import AboutMeEditModal from '@/components/ui/modals/AboutMeEditModal';
import EditBtn from '@/components/ui/EditBtn';
import { useAuth } from '@/contexts/AuthContext';

const About = ({ onOpenModal, activeModal }) => {
    const { content, isLoading, error } = useAboutMe();
    const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <section id="about" className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500">Une erreur est survenue lors du chargement des données.</div>
      </section>
    );
  }

  return (
    <section id="whoami" className="w-full flex flex-col gap-[10px] px-[10px] md:px-[20px] lg:px-[40px] py-[16px]">
      {isAdmin && (
          <div className="w-full flex justify-center mb-2 md:mb-[40px]">
            <EditBtn onOpenModal={onOpenModal} section="about" />
          </div>
      )}
      <div className="w-full px-2 py-4">
        <div className="relative w-full md:max-w-4xl lg:max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-[40px] lg:text-[64px] font-medium font-montserrat text-white mb-8 md:mb-[60px] lg:mb-[100px] text-center">Qui suis-je ?</h2>
          <div className="text-lg md:text-[24px] lg:text-[40px] font-montserrat leading-relaxed whitespace-pre-wrap">
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