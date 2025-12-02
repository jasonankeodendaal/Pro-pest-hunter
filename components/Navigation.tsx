import React, { useState, useEffect } from 'react';
import { Phone, Bug, User, LogIn } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onBookClick?: () => void;
  onAdminClick?: () => void; // Used for client login trigger as well now
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
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
          ? 'bg-pestBrown/80 backdrop-blur-xl shadow-glass border border-white/10 py-3 translate-y-0' 
          : 'bg-transparent py-4 translate-y-2'
      }`}
    >
      {/* 
         Inner Container: 
         Widen to match page layout (1800px max width).
      */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 flex justify-between items-center">
        
        {/* Logo Section */}
        <button onClick={() => navigateTo('home')} className="flex items-center gap-3 text-white cursor-pointer group"> 
            <span className={`font-black tracking-wide whitespace-nowrap drop-shadow-sm block group-hover:text-pestGreen transition-all duration-300 ${isScrolled ? 'text-lg md:text-2xl' : 'text-xl md:text-3xl'}`}>
                {content.company.name}
            </span>
        </button>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 md:gap-8">
          <button onClick={() => navigateTo('home')} className="text-xs md:text-base font-bold text-white/90 hover:text-pestGreen transition-colors drop-shadow-sm">Home</button>
          <button onClick={() => navigateTo('about')} className="text-xs md:text-base font-bold text-white/90 hover:text-pestGreen transition-colors drop-shadow-sm">About</button>
          <button onClick={() => navigateTo('services')} className="text-xs md:text-base font-bold text-white/90 hover:text-pestGreen transition-colors drop-shadow-sm">Services</button>
          
          <div className="flex items-center gap-2">
              {/* Client Login Button */}
              <button 
                onClick={onAdminClick}
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white hover:text-pestBrown text-white border border-white/20 rounded-xl px-4 py-2.5 font-bold transition-all text-xs md:text-sm"
                title="Client Login"
              >
                  <User size={16} /> Login
              </button>

              <button 
                onClick={onBookClick}
                className={`bg-pestGreen text-white rounded-xl font-bold hover:bg-white hover:text-pestGreen transition-all shadow-thick hover:shadow-none hover:translate-y-[2px]
                    ${isScrolled ? 'px-4 py-2 text-xs md:text-sm' : 'px-5 py-2.5 md:px-7 md:py-3 text-xs md:text-base'}
                `}
              >
                Book Now
              </button>
          </div>
        </nav>
      </div>
    </header>
  );
};