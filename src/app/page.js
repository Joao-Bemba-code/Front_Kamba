// pages/index.js
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FeaturedProjectsSection from '../components/FeaturedProjectsSection';
import Footer from '../components/Footer';

const HomePage = () => (
    <>
        <Navbar />
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <FeaturedProjectsSection />
        <Footer />
    </>
);

export default HomePage;