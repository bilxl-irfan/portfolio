import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

export default function Home() {
  return (
    <main className="bg-[#050505] relative">
      <CustomCursor />
      <Navbar />
      <div id="home"><Hero /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <Footer />
    </main>
  );
}