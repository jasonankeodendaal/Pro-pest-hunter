
import React, { useState } from 'react';
import { Search, FileText, Zap, Shield, Circle, MapPin, Navigation, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';

const IconMap: Record<string, any> = {
    'Search': Search,
    'FileText': FileText,
    'Zap': Zap,
    'Shield': Shield,
    'Default': Circle
};

export const ProcessAndArea: React.FC = () => {
  const { content } = useContent();
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <Section id="process-area" className="bg-pestLight relative py-24 md:py-32 overflow-visible border-t border-white/50">
      <div id="process" className="absolute -top-24 left-0"></div>
      <div id="area" className="absolute top-1/2 left-0"></div>

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#99a, transparent 1px), linear-gradient(90deg, #99a, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Forced grid-cols-2 */}
      <div className="grid grid-cols-2 gap-8 lg:gap-24 relative z-10">
        
        {/* LEFT COLUMN: PROCESS */}
        <div className="flex flex-col">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-1.5 w-12 bg-pestGreen rounded-full"></div>
                    <span className="text-pestGreen font-bold uppercase tracking-widest text-sm">Our Workflow</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-pestBrown leading-[0.9] mb-6">
                    {content.process.title}
                </h2>
                <p className="text-gray-500 font-medium text-base md:text-xl max-w-lg leading-relaxed">
                    {content.process.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 perspective-1000">
                {content.process.steps.map((step, i) => {
                    const IconComponent = IconMap[step.iconName] || IconMap['Default'];
                    return (
                        <motion.div 
                            key={step.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-pestStone p-6 md:p-8 rounded-[30px] shadow-thick border border-white/50 relative overflow-hidden group hover:border-pestGreen/30 transition-colors"
                        >
                            <div className="absolute -right-4 -bottom-6 text-[5rem] md:text-[7rem] font-black text-pestBrown/5 group-hover:text-pestGreen/10 transition-colors select-none leading-none">
                                {step.step}
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-pestLight rounded-2xl flex items-center justify-center mb-5 text-pestBrown group-hover:bg-pestGreen group-hover:text-white transition-colors shadow-sm border border-white/50">
                                    <IconComponent size={24} className="md:w-8 md:h-8" />
                                </div>
                                <h3 className="font-bold text-base md:text-xl text-pestBrown mb-3">{step.title}</h3>
                                <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        {/* RIGHT COLUMN: SERVICE AREA */}
        <div className="flex flex-col h-full">
            <div className="mb-12 lg:text-right">
                <div className="flex items-center gap-3 mb-4 lg:justify-end">
                    <span className="text-pestGreen font-bold uppercase tracking-widest text-sm">Coverage</span>
                    <div className="h-1.5 w-12 bg-pestGreen rounded-full"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-pestBrown leading-[0.9] mb-6">
                    {content.serviceArea.title}
                </h2>
                <p className="text-gray-500 font-medium text-base md:text-xl leading-relaxed lg:ml-auto lg:max-w-lg">
                    {content.serviceArea.description}
                </p>
            </div>

            <div 
                className="relative flex-grow min-h-[350px] md:min-h-[450px] bg-pestStone rounded-[50px] overflow-hidden shadow-thick border-4 border-white group perspective-1000 cursor-zoom-in"
                onClick={() => setIsMapOpen(true)}
            >
                {/* Map Content - STATIC IMAGE REMOVED */}
                <div className="absolute inset-0 bg-pestLight transition-transform duration-700 group-hover:scale-105">
                    {content.serviceArea.mapEmbedUrl ? (
                         <iframe 
                            src={content.serviceArea.mapEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            title="Service Area Map"
                            className="w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <MapPin size={64} className="text-pestBrown/30 mx-auto mb-2" />
                            <p className="absolute bottom-10 text-xs font-bold text-pestBrown/30 uppercase">No Map Embedded</p>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between z-10 pointer-events-none">
                    <div className="flex justify-end">
                        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-pestGreen rounded-full"></div>
                            <span className="text-pestBrown text-xs font-bold uppercase tracking-wider">Service Area</span>
                        </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-xl rounded-[30px] p-6 border border-white/50 pointer-events-auto shadow-lg">
                        <div className="flex items-center gap-2 mb-4 text-pestBrown/60 text-xs uppercase font-bold tracking-wider border-b border-pestBrown/5 pb-3">
                            <Navigation size={14} /> Locations Covered
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {content.serviceArea.towns.map((town) => (
                                <span key={town} className="bg-white hover:bg-pestGreen text-pestBrown hover:text-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-default shadow-sm">
                                    {town}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {isMapOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-pestBrown/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                onClick={() => setIsMapOpen(false)}
            >
                <button 
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40 z-[110]"
                    onClick={() => setIsMapOpen(false)}
                >
                    <X size={32} />
                </button>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full h-full max-w-[90vw] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-pestLight"
                    onClick={(e) => e.stopPropagation()}
                >
                    {content.serviceArea.mapEmbedUrl ? (
                         <iframe 
                            src={content.serviceArea.mapEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={true} 
                            loading="lazy" 
                            title="Full Service Area Map"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-pestLight text-pestBrown/40 p-10 text-center">
                            <MapPin size={64} className="mb-4 opacity-50" />
                            <h3 className="text-2xl font-black uppercase opacity-50">No Map Uploaded</h3>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
