import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import About from '@/components/About';
import SecretTerminal from '@/components/SecretTerminal';

export default function Home() {
  return (
    <main className="bg-[#050505] relative">
      <SecretTerminal />
      <Navbar />
      <div id="home"><Hero /></div>
      <div id="about"><About /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <Footer />
    </main>
  );
}