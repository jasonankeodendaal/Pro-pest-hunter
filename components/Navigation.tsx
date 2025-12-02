
import React, { useState, useEffect } from 'react';
import { Phone, Bug } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface NavigationProps {
  onBookClick?: () => void;
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onBookClick, navigateTo }) => {
  const { content } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl ${
        isScrolled 
          ? 'bg-pestBrown/80 backdrop-blur-xl shadow-glass border border-white/10 py-3 px-6 translate-y-0' 
          : 'bg-transparent py-4 px-4 translate-y-2'
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Logo - now navigates to home */}
        <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-white cursor-pointer group"> 
          {/* Logo Image Removed - Moved to Hero */}
          <span className="font-black text-xl md:text-3xl tracking-wide whitespace-nowrap drop-shadow-sm block group-hover:text-pestGreen transition-colors">{content.company.name}</span>
        </button>

        {/* Nav Links */}
        <nav className="flex items-center gap-4 md:gap-8 text-sm md:text-base font-bold text-white/90">
          <button onClick={() => navigateTo('home')} className="hover:text-pestGreen transition-colors drop-shadow-sm hidden sm:block">Home</button>
          <button onClick={() => navigateTo('about')} className="hover:text-pestGreen transition-colors drop-shadow-sm">About</button>
          <button onClick={() => navigateTo('services')} className="hover:text-pestGreen transition-colors drop-shadow-sm">Services</button>
          <button 
            onClick={onBookClick}
            className="bg-pestGreen text-white px-5 py-2.5 md:px-7 md:py-3 rounded-xl text-xs md:text-base font-bold hover:bg-white hover:text-pestGreen transition-all shadow-thick hover:shadow-none hover:translate-y-[2px]"
          >
            Book Now
          </button>
        </nav>
      </div>
    </header>
  );
};
