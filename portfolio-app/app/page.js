import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-dark">
      <Header />
      <main className="flex flex-col items-center w-full">
        <HeroBanner />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
