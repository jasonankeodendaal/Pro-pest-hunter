
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Volume2, VolumeX, Bug } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useContent } from '../context/ContentContext';

const IconMap = Icons as unknown as Record<string, React.ElementType>;

interface HeroProps {
  navigateTo: (page: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const Hero: React.FC<HeroProps> = ({ navigateTo }) => {
  const { content } = useContent();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full min-h-[40vh] md:min-h-[70vh] flex items-center bg-pestDarkGreen overflow-hidden pt-20 pb-8 md:py-0">
      {/* Dynamic Background (Fallback/Overlay) */}
      <div className="absolute inset-0 z-0">
          {content.hero.bgImage && !content.hero.mediaVideo ? (
             <img src={content.hero.bgImage} alt="Hero" className={`w-full h-full object-cover opacity-${content.hero.overlayOpacity || 20}`} />
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-[#0f1f0e] via-[#1a2e18] to-black"></div>
          )}
           {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pestGreen/10 via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Optimized Floating Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pestGreen/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pestBrown/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Wider max-width to match page layout lines (1440px) */}
      <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
        {/* Forced grid-cols-2 to prevent stacking */}
        <div className="grid grid-cols-2 gap-4 md:gap-12 items-center">
            
            {/* LEFT COLUMN: Text & Icons */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6 min-w-0"
            >
                {/* HEADLINE / LOGO */}
                <div className="mb-1 md:mb-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                         {content.company.logo ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                src={content.company.logo} 
                                alt="Company Logo" 
                                className="h-12 md:h-32 w-auto drop-shadow-2xl object-contain" 
                            />
                        ) : (
                            <div className="w-12 h-12 md:w-24 md:h-24 bg-pestGreen rounded-full flex items-center justify-center shadow-neon">
                                <Bug className="w-6 h-6 md:w-12 md:h-12 text-white" />
                            </div>
                        )}
                        
                        <div className="flex flex-col pt-1 md:pt-3 text-center md:text-left">
                             <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-white font-black text-xl md:text-5xl lg:text-6xl uppercase leading-[0.9] drop-shadow-lg"
                            >
                                {content.company.name}
                            </motion.h1>
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-pestGreen font-black text-xs md:text-2xl tracking-widest mt-0.5 md:mt-1 block"
                            >
                                (Pty) Ltd
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* Subheadline - Increased mobile size */}
                <div>
                    <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide leading-tight text-center md:text-left">
                        {content.hero.subheadline || "The Lowveld's #1 Defense Against Pests."}
                    </h2>
                </div>

                {/* Experience Box & Icons Row */}
                <div className="flex flex-row items-center gap-3 md:gap-6 justify-center md:justify-start">
                    {/* Experience Text Box - Increased text size */}
                    <div className="bg-white/10 backdrop-blur-md border-l-4 border-pestGreen p-3 md:p-4 rounded-r-lg md:rounded-r-2xl max-w-[180px] md:max-w-xs shadow-lg flex-1">
                        <span className="block text-white font-black text-sm md:text-lg mb-0.5">{content.company.yearsExperience}+ Years</span>
                        <p className="text-gray-300 text-xs md:text-sm leading-tight line-clamp-2">
                            Military precision pest control.
                        </p>
                    </div>

                    {/* Icons Stack */}
                    <div className="flex flex-col gap-2 md:gap-3">
                        {content.about.items.slice(0, 3).map((item, i) => {
                            const IconComponent = (IconMap as any)[item.iconName] || IconMap['Circle'];
                            return (
                                <div key={i} className="group relative flex items-center">
                                    {/* Icon */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-pestGreen rounded-md md:rounded-xl flex items-center justify-center text-white shadow-neon cursor-pointer z-20 hover:bg-white hover:text-pestGreen transition-all duration-300 hover:scale-110">
                                        <IconComponent size={16} className="md:w-5 md:h-5" />
                                    </div>
                                    
                                    {/* Pop-out Label */}
                                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-xs md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none border border-white/10 shadow-xl z-10 flex items-center">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-black/80"></div>
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Button - Increased size */}
                <div className="pt-2 md:pt-3 flex justify-center md:justify-start">
                    <button 
                        onClick={() => navigateTo('services')}
                        className="group bg-pestLight text-pestDarkGreen px-6 py-3 md:px-6 md:py-3 rounded-lg md:rounded-xl font-black text-sm md:text-base shadow-thick hover:shadow-neon hover:scale-105 transition-all flex items-center gap-2"
                    >
                        {content.hero.buttonText || "Get Quote"} 
                        <div className="bg-pestGreen text-white p-0.5 rounded-full group-hover:translate-x-1 transition-transform">
                             <ArrowRight size={14} className="md:w-3 md:h-3" />
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Video */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full aspect-video flex items-center justify-center min-w-0"
            >
                {/* Organic Shape Background */}
                <div className="absolute inset-0 bg-pestGreen/20 rounded-[1rem] md:rounded-[2rem] rotate-3 blur-sm scale-105"></div>
                
                <div className="relative w-full h-full bg-[#0f1f0e] rounded-[0.8rem] md:rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                    {content.hero.mediaVideo ? (
                        <>
                            <video 
                                ref={videoRef}
                                src={content.hero.mediaVideo} 
                                autoPlay 
                                muted={isMuted}
                                loop 
                                playsInline 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Mute/Unmute Button */}
                            <button 
                                onClick={toggleMute}
                                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-2.5 bg-black/40 hover:bg-pestGreen backdrop-blur-md rounded-full text-white transition-all duration-300 z-30 border border-white/10 shadow-lg group-hover:scale-110"
                                title={isMuted ? "Unmute Video" : "Mute Video"}
                            >
                                {isMuted ? <VolumeX size={16} className="md:w-4 md:h-4" /> : <Volume2 size={16} className="md:w-4 md:h-4" />}
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #4CAF50 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                             <div className="bg-white/10 backdrop-blur-md p-2 md:p-4 rounded-xl md:rounded-2xl border border-white/10 text-center max-w-[80%] md:max-w-xs relative z-10">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-pestGreen rounded-full flex items-center justify-center mx-auto mb-1 md:mb-3 shadow-neon animate-pulse">
                                    <Play size={16} className="md:w-6 md:h-6 text-white ml-1" />
                                </div>
                                <p className="text-white font-bold text-xs md:text-sm mb-0.5">Brand Video</p>
                             </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};
