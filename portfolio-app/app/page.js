import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Separation from '../components/Separation';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen gap-[30px]">
      <Header />
      <main className="flex flex-col items-center w-full gap-[30px]">
        <HeroBanner />
        <Separation />
        <About />
        <Separation />
        <Skills />
        <Separation />
        <Projects />
        <Separation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
