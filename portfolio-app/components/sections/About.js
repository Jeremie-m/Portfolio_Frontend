'use client';

import { useAboutMe } from '@/hooks/useAboutMe';
import Loader from '@/components/ui/Loader';
import AboutMeEditModal from '@/components/ui/modals/AboutMeEditModal';
import EditBtn from '@/components/EditBtn';
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
    <section id="about" className="w-full flex flex-col gap-[10px] px-[10px] py-[16px]">
      {isAdmin && (
          <div className="w-full flex justify-center mb-2">
            <EditBtn onOpenModal={onOpenModal} section="about" />
          </div>
      )}
      <div className="container mx-auto px-2 py-4">
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium font-montserrat text-white mb-8 text-center">Qui suis-je ?</h2>
          <div className="text-lg font-montserrat leading-relaxed whitespace-pre-wrap">
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