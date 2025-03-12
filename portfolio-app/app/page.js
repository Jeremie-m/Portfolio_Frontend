'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Separation from '../components/Separation';
import AdminTheme from '@/components/AdminTheme';

export default function Home() {
  const { isAdmin, setIsAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAdmin(false);
  };

  return (
    <>
      <AdminTheme />
      <div className="flex flex-col items-center w-full min-h-screen gap-[30px]">
        <Header>
          {isAdmin && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleLogout}
                className="text-[12px] font-jetbrains-mono text-white hover:text-red-500 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          )}
        </Header>
        <main className="flex flex-col items-center w-full gap-[30px]" id="main-content">
          <HeroBanner />
          <Separation />
          <section id="whoami">
            <About />
          </section>
          <Separation />
          <section id="skills">
            <Skills />
          </section>
          <Separation />
          <section id="projects">
            <Projects />
          </section>
          <Separation />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
