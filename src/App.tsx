import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import VideoSection from './components/VideoSection';
import ProjectsSection from './components/ProjectsSection';
import ToolsSection from './components/ToolsSection';
import Footer from './components/Footer';
import ImageBackground from './components/ImageBackground';
import RingCursor from './components/RingCursor';

export default function App() {
  return (
    <div className="min-h-screen">
      <ImageBackground />
      <RingCursor />
      <Navbar />
      <main>
        <HeroSection /><AboutSection /><ExperienceSection />
        <VideoSection />
        <ProjectsSection />
        <ToolsSection />
      </main>
      <Footer />
    </div>
  );
}
