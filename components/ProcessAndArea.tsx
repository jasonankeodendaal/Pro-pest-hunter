
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
    <Section id="process-area" className="bg-pestLight relative py-24 overflow-visible border-t border-white/50">
      <div id="process" className="absolute -top-24 left-0"></div>
      <div id="area" className="absolute top-1/2 left-0"></div>

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#99a, transparent 1px), linear-gradient(90deg, #99a, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* UPDATED: Forced grid-cols-2 */}
      <div className="grid grid-cols-2 gap-8 lg:gap-24 relative z-10">
        
        {/* LEFT COLUMN: PROCESS */}
        <div className="flex flex-col">
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-1 w-10 bg-pestGreen rounded-full"></div>
                    <span className="text-pestGreen font-bold uppercase tracking-widest text-xs">Our Workflow</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-pestBrown leading-[0.9] mb-4">
                    {content.process.title}
                </h2>
                <p className="text-gray-500 font-medium text-sm md:text-lg max-w-md leading-relaxed">
                    {content.process.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 perspective-1000">
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
                            className="bg-pestStone p-4 md:p-6 rounded-3xl shadow-thick border border-white/50 relative overflow-hidden group hover:border-pestGreen/30 transition-colors"
                        >
                            <div className="absolute -right-4 -bottom-6 text-[4rem] md:text-[6rem] font-black text-pestBrown/5 group-hover:text-pestGreen/10 transition-colors select-none leading-none">
                                {step.step}
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-pestLight rounded-2xl flex items-center justify-center mb-4 text-pestBrown group-hover:bg-pestGreen group-hover:text-white transition-colors shadow-sm border border-white/50">
                                    <IconComponent size={20} className="md:w-6 md:h-6" />
                                </div>
                                <h3 className="font-bold text-sm md:text-lg text-pestBrown mb-2">{step.title}</h3>
                                <p className="text-[10px] md:text-xs text-gray-500 font-medium leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        {/* RIGHT COLUMN: SERVICE AREA */}
        <div className="flex flex-col h-full">
            <div className="mb-10 lg:text-right">
                <div className="flex items-center gap-2 mb-3 lg:justify-end">
                    <span className="text-pestGreen font-bold uppercase tracking-widest text-xs">Coverage</span>
                    <div className="h-1 w-10 bg-pestGreen rounded-full"></div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-pestBrown leading-[0.9] mb-4">
                    {content.serviceArea.title}
                </h2>
                <p className="text-gray-500 font-medium text-sm md:text-lg leading-relaxed lg:ml-auto lg:max-w-md">
                    {content.serviceArea.description}
                </p>
            </div>

            <div 
                className="relative flex-grow min-h-[300px] md:min-h-[400px] bg-pestStone rounded-[40px] overflow-hidden shadow-thick border-4 border-white group perspective-1000 cursor-zoom-in"
                onClick={() => setIsMapOpen(true)}
            >
                {/* Map Content */}
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
                            className="w-full h-full"
                        />
                    ) : (
                        content.serviceArea.mapImage ? (
                            <img src={content.serviceArea.mapImage} alt="Service Area Map" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full opacity-10 text-pestBrown fill-current" viewBox="0 0 400 400" preserveAspectRatio="none">
                                    <path d="M0,200 Q100,150 200,200 T400,200 V400 H0 Z" fillOpacity="0.1"/>
                                    <path d="M50,50 Q150,0 250,50 T450,50" stroke="currentColor" strokeWidth="1" fill="none" />
                                    <path d="M100,300 Q200,250 300,300" stroke="currentColor" strokeWidth="1" fill="none" />
                                    <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
                                </svg>
                                <div className="text-center p-6 border-2 border-dashed border-pestBrown/20 rounded-3xl">
                                    <MapPin className="w-12 h-12 text-pestBrown/30 mx-auto mb-2" />
                                    <p className="text-pestBrown/40 font-bold text-sm uppercase tracking-widest">Map Display Area</p>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between z-10 pointer-events-none">
                    <div className="flex justify-end">
                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-pestGreen rounded-full"></div>
                            <span className="text-pestBrown text-[10px] font-bold uppercase tracking-wider">Service Area</span>
                        </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 border border-white/50 pointer-events-auto shadow-lg">
                        <div className="flex items-center gap-2 mb-3 text-pestBrown/60 text-xs uppercase font-bold tracking-wider border-b border-pestBrown/5 pb-2">
                            <Navigation size={12} /> Locations
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {content.serviceArea.towns.map((town) => (
                                <span key={town} className="bg-white hover:bg-pestGreen text-pestBrown hover:text-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-default shadow-sm">
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
                        content.serviceArea.mapImage ? (
                            <img src={content.serviceArea.mapImage} alt="Full Service Area Map" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-pestLight text-pestBrown/40 p-10 text-center">
                                <MapPin size={64} className="mb-4 opacity-50" />
                                <h3 className="text-2xl font-black uppercase opacity-50">No Map Uploaded</h3>
                            </div>
                        )
                    )}
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
