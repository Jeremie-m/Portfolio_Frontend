'use client';

import { useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Separation from '../components/Separation';
import AdminTheme from '@/components/AdminTheme';
import HeroEditModal from '@/components/modals/HeroEditModal';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <AdminTheme />
      <div className="flex flex-col items-center w-full min-h-screen gap-[30px]">
        <Header onOpenModal={handleOpenModal} activeModal={activeModal} />
        <main className="flex flex-col items-center w-full gap-[30px]" id="main-content">
          <HeroBanner onOpenModal={() => handleOpenModal('hero')} />
          <Separation />
          <section id="whoami">
            <About onOpenModal={() => handleOpenModal('about')} />
          </section>
          <Separation />
          <section id="skills">
            <Skills onOpenModal={() => handleOpenModal('skills')} />
          </section>
          <Separation />
          <section id="projects">
            <Projects onOpenModal={() => handleOpenModal('projects')} />
          </section>
          <Separation />
          <Contact />
        </main>
        <Footer />

        {/* Modales */}
        <HeroEditModal 
          isOpen={activeModal === 'hero'} 
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
}
