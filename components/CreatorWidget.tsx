
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const CreatorWidget: React.FC = () => {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use data from context, fallback to empty strings if not yet loaded
  const widgetData = content.creatorWidget || {
    logo: "",
    whatsappIcon: "",
    emailIcon: "",
    background: "",
    slogan: "",
    ctaText: ""
  };

  if (!content.creatorWidget) return null; // Don't render until data loads

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex flex-col items-start gap-2 font-sans">
      
      {/* Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 relative w-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              {widgetData.background && (
                  <img 
                    src={widgetData.background} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
              )}
              {/* Lighter Gradient Overlay for text readability but keeping background visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col items-center text-center text-white">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1"
              >
                <X size={20} />
              </button>

              {/* Logo */}
              <div className="w-32 h-32 mb-6 drop-shadow-2xl filter brightness-110">
                {widgetData.logo && <img src={widgetData.logo} alt="Creator Logo" className="w-full h-full object-contain" />}
              </div>
              
              {/* Text Container for Readability */}
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 w-full mb-6 border border-white/10 shadow-lg">
                  {/* Slogan */}
                  <p className="text-xs font-bold text-pestGreen uppercase tracking-widest mb-3 w-full drop-shadow-md">
                    {widgetData.slogan}
                  </p>

                  {/* CTA Text */}
                  <p className="text-sm font-bold text-white leading-relaxed drop-shadow-md">
                    {widgetData.ctaText}
                  </p>
              </div>

              {/* Icons Side by Side */}
              <div className="flex items-center justify-center gap-4 w-full">
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/27695989427" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white/10 hover:bg-green-500/20 rounded-2xl flex items-center justify-center border border-white/20 hover:border-green-400 hover:scale-105 transition-all duration-300 shadow-lg group"
                  title="WhatsApp"
                >
                  {widgetData.whatsappIcon && <img src={widgetData.whatsappIcon} alt="WhatsApp" className="w-8 h-8 object-contain drop-shadow-md group-hover:brightness-110" />}
                </a>

                {/* Email */}
                <a 
                  href="mailto:jstypme@gmail.com"
                  className="w-14 h-14 bg-white/10 hover:bg-blue-500/20 rounded-2xl flex items-center justify-center border border-white/20 hover:border-blue-400 hover:scale-105 transition-all duration-300 shadow-lg group"
                  title="Email"
                >
                  {widgetData.emailIcon && <img src={widgetData.emailIcon} alt="Email" className="w-8 h-8 object-contain drop-shadow-md group-hover:brightness-110" />}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button - FREE VIEW (No Box) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ 
          y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }}
        className="relative group focus:outline-none"
      >
        {/* Just the Image, no background container - Reduced Size */}
        {widgetData.logo && (
            <img 
                src={widgetData.logo} 
                alt="Creator" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-2xl filter hover:brightness-110 transition-all"
            />
        )}
      </motion.button>

    </div>
  );
};