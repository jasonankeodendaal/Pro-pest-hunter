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
  
  // Ref for video control
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full min-h-[60vh] flex items-center bg-pestDarkGreen overflow-hidden pt-24 pb-12">
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

      {/* Container */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* LEFT COLUMN: Text & Icons */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8 flex-1 w-full max-w-3xl"
            >
                {/* HEADLINE / LOGO LOCKUP */}
                <div className="flex flex-row items-center gap-6 md:gap-8 w-full">
                     <div className="flex-shrink-0">
                        {content.company.logo ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                src={content.company.logo} 
                                alt="Company Logo" 
                                className="h-32 w-auto md:h-48 drop-shadow-2xl object-contain" 
                            />
                        ) : (
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-pestGreen rounded-full flex items-center justify-center shadow-neon">
                                <Bug className="w-16 h-16 md:w-20 md:h-20 text-white" />
                            </div>
                        )}
                     </div>
                        
                    {/* Text Block */}
                    <div className="flex flex-col justify-center">
                         <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white font-black text-3xl sm:text-4xl md:text-7xl lg:text-8xl uppercase leading-[0.9] drop-shadow-lg text-left"
                        >
                            {content.company.name}
                        </motion.h1>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-pestGreen font-black text-sm md:text-3xl tracking-[0.2em] mt-1 md:mt-2 block text-left"
                        >
                            (Pty) Ltd
                        </motion.span>
                    </div>
                </div>

                {/* Subheadline */}
                <div className="w-full">
                    <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide leading-tight text-left">
                        {content.hero.subheadline || "The Lowveld's #1 Defense Against Pests."}
                    </h2>
                </div>

                {/* Experience Box & Icons Row */}
                <div className="flex flex-row items-center gap-4 md:gap-8 w-full justify-start">
                    {/* Experience Text Box */}
                    <div className="bg-white/10 backdrop-blur-md border-l-4 border-pestGreen p-4 md:p-5 rounded-r-xl max-w-xs shadow-lg">
                        <span className="block text-white font-black text-lg md:text-xl mb-1">{content.company.yearsExperience}+ Years</span>
                        <p className="text-gray-300 text-sm md:text-base leading-tight">
                            Military precision pest control.
                        </p>
                    </div>

                    {/* Icons Stack */}
                    <div className="flex flex-col gap-3">
                        {content.about.items.slice(0, 3).map((item, i) => {
                            const IconComponent = (IconMap as any)[item.iconName] || IconMap['Circle'];
                            return (
                                <div key={i} className="group relative flex items-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pestGreen rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-neon cursor-pointer z-20 hover:bg-white/20 hover:text-pestGreen transition-all duration-300 hover:scale-110">
                                        <IconComponent size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none border border-white/10 shadow-xl z-10">
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 flex w-full justify-start">
                    <button 
                        onClick={() => navigateTo('services')}
                        className="group bg-pestLight text-pestDarkGreen px-8 py-4 md:px-10 md:py-5 rounded-xl font-black text-base md:text-xl shadow-thick hover:shadow-neon hover:scale-105 transition-all flex items-center gap-3"
                    >
                        {content.hero.buttonText || "Get Quote"} 
                        <div className="bg-pestGreen text-white p-1 rounded-full group-hover:translate-x-1 transition-transform">
                             <ArrowRight size={18} />
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: VIDEO (Visible on Tablet & Desktop) */}
            <div className="hidden md:flex flex-1 items-center justify-center perspective-2000">
                <motion.div 
                    initial={{ opacity: 0, rotateY: -10, x: 50 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full max-w-xl aspect-video bg-[#0f1f0e] rounded-[30px] overflow-hidden shadow-3d-hover border-8 border-white/10 group transform transition-transform duration-500 hover:scale-105"
                >
                    {content.hero.mediaVideo ? (
                        <>
                            <video 
                                ref={desktopVideoRef}
                                src={content.hero.mediaVideo} 
                                autoPlay 
                                muted={isMuted}
                                loop 
                                playsInline 
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <button 
                                onClick={toggleMute}
                                className="absolute bottom-6 right-6 p-4 bg-black/40 hover:bg-pestGreen backdrop-blur-md rounded-full text-white transition-all duration-300 z-30 border border-white/10 shadow-lg group-hover:scale-110"
                            >
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 relative">
                             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                <Play size={40} className="text-pestGreen mx-auto mb-2" />
                                <p className="text-white font-bold text-lg">Brand Video</p>
                             </div>
                        </div>
                    )}
                    {/* Reflection/Gloss */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
};