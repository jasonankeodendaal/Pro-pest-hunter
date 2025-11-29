
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
    <section className="relative w-full min-h-[90vh] flex items-center bg-pestDarkGreen overflow-hidden pt-24 pb-12 md:py-0">
      {/* Dynamic Background (Fallback/Overlay) */}
      <div className="absolute inset-0 z-0">
          {content.hero.bgImage && !content.hero.mediaVideo ? (
             <img src={content.hero.bgImage} alt="Hero" className={`w-full h-full object-cover opacity-${content.hero.overlayOpacity || 20}`} />
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-[#0f1f0e] via-[#1a2e18] to-black"></div>
          )}
           {/* Mesh Gradient Overlay - Optimized with CSS opacity instead of heavy blend modes */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pestGreen/10 via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Optimized Floating Blobs - Reduced Blur Radius for Performance */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pestGreen/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pestBrown/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* UPDATED: Forced grid-cols-2 instead of grid-cols-1 to prevent stacking */}
        <div className="grid grid-cols-2 gap-8 md:gap-20 items-center">
            
            {/* LEFT COLUMN: Text & Icons */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
                {/* REPLACED HEADLINE WITH LOGO + BRAND NAME (As requested in screenshot) */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                         {content.company.logo ? (
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                src={content.company.logo} 
                                alt="Company Logo" 
                                className="h-40 md:h-64 w-auto drop-shadow-2xl object-contain" 
                            />
                        ) : (
                            <div className="w-32 h-32 bg-pestGreen rounded-full flex items-center justify-center shadow-neon">
                                <Bug className="w-16 h-16 text-white" />
                            </div>
                        )}
                        
                        <div className="flex flex-col pt-4">
                             <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-white font-black text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.9] drop-shadow-lg"
                            >
                                {content.company.name}
                            </motion.h1>
                            <motion.span 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-pestGreen font-black text-xl md:text-3xl tracking-widest mt-2 block"
                            >
                                (Pty) Ltd
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* Subheadline (Formerly Main Headline area, now secondary focus) */}
                <div>
                    <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-wide leading-tight">
                        {content.hero.subheadline || "The Lowveld's #1 Defense Against Pests."}
                    </h2>
                </div>

                {/* Experience Box & Icons Row */}
                <div className="flex flex-row items-center gap-4 md:gap-8">
                    {/* Experience Text Box */}
                    <div className="bg-white/10 backdrop-blur-md border-l-4 border-pestGreen p-4 md:p-5 rounded-r-2xl max-w-md shadow-lg flex-1">
                        <span className="block text-white font-black text-lg md:text-xl mb-1">{content.company.yearsExperience}+ Years</span>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3">
                            Military precision pest control.
                        </p>
                    </div>

                    {/* Icons Stack */}
                    <div className="flex flex-col gap-2 md:gap-4">
                        {content.about.items.map((item, i) => {
                            const IconComponent = (IconMap as any)[item.iconName] || IconMap['Circle'];
                            return (
                                <div key={i} className="group relative flex items-center">
                                    {/* Icon */}
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-pestGreen rounded-xl flex items-center justify-center text-white shadow-neon cursor-pointer z-20 hover:bg-white hover:text-pestGreen transition-all duration-300 hover:scale-110">
                                        <IconComponent size={20} />
                                    </div>
                                    
                                    {/* Pop-out Label (Right Side) */}
                                    <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none border border-white/10 shadow-xl z-10 flex items-center">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-black/80"></div>
                                        {item.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                    <button 
                        onClick={() => navigateTo('services')}
                        className="group bg-pestLight text-pestDarkGreen px-6 py-3 md:px-8 md:py-4 rounded-2xl font-black text-sm md:text-lg shadow-thick hover:shadow-neon hover:scale-105 transition-all flex items-center gap-3"
                    >
                        {content.hero.buttonText || "Get Quote"} 
                        <div className="bg-pestGreen text-white p-1 rounded-full group-hover:translate-x-1 transition-transform">
                             <ArrowRight size={16} />
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Admin Video */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-[300px] md:h-[500px] w-full flex items-center justify-center"
            >
                {/* Organic Shape Background */}
                <div className="absolute inset-0 bg-pestGreen/20 rounded-[3rem] rotate-3 blur-sm scale-105"></div>
                
                <div className="relative w-full h-full bg-[#0f1f0e] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
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
                                className="absolute bottom-6 right-6 p-3 bg-black/40 hover:bg-pestGreen backdrop-blur-md rounded-full text-white transition-all duration-300 z-30 border border-white/10 shadow-lg group-hover:scale-110"
                                title={isMuted ? "Unmute Video" : "Mute Video"}
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #4CAF50 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                             <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center max-w-xs relative z-10">
                                <div className="w-16 h-16 bg-pestGreen rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon animate-pulse">
                                    <Play size={32} className="text-white ml-1" />
                                </div>
                                <p className="text-white font-bold text-lg mb-1">Brand Video</p>
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
