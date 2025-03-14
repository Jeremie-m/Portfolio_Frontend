'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import HeroBanner from '@/components/sections/HeroBanner';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import Separation from '@/components/ui/Separation';
import AdminTheme from '@/components/layout/AdminTheme';

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
          <HeroBanner onOpenModal={handleOpenModal} activeModal={activeModal} />
          <Separation />
          <section id="whoami">
            <About onOpenModal={handleOpenModal} activeModal={activeModal} />
          </section>
          <Separation />
          <section id="skills">
            <Skills onOpenModal={handleOpenModal} activeModal={activeModal} />
          </section>
          <Separation />
          <section id="projects">
            <Projects onOpenModal={handleOpenModal} activeModal={activeModal} />
          </section>
          <Separation />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
