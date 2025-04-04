'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import HeroBanner from '@/components/sections/HeroBanner';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import Separation from '@/components/common/Separation';
import AdminTheme from '@/components/layout/AdminTheme';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAdmin: authIsAdmin } = useAuth();

  useEffect(() => {
    // Synchroniser le state local avec le contexte d'authentification
    setIsAdmin(authIsAdmin);
  }, [authIsAdmin]);

  const handleOpenModal = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <AdminTheme key={isAdmin} />
      <div className="flex flex-col items-center w-full min-h-screen gap-[20px] md:gap-[40px] lg:gap-[60px]">
        <Header onOpenModal={handleOpenModal} activeModal={activeModal} />
        <main className="flex flex-col items-center w-full gap-[20px] md:gap-[40px] lg:gap-[60px]" id="main-content">
          <HeroBanner onOpenModal={handleOpenModal} activeModal={activeModal} />
          <Separation />
          <About onOpenModal={handleOpenModal} activeModal={activeModal} />
          <Separation />
          <Skills onOpenModal={handleOpenModal} activeModal={activeModal} />
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
