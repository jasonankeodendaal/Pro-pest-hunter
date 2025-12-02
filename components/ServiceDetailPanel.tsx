
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceItem } from '../types';
import * as Icons from 'lucide-react';
import { ArrowRight, X, Award } from 'lucide-react';

const IconMap = Icons as unknown as Record<string, React.ElementType>;

interface ServiceDetailPanelProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookClick: () => void;
}

export const ServiceDetailPanel: React.FC<ServiceDetailPanelProps> = ({ 
  service, 
  onClose, 
  onBookClick
}) => {
  if (!service) return null;

  const IconComponent = (IconMap as any)[service.iconName] || IconMap['Circle'];

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }} // Slides in from right
          animate={{ x: '0%', opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }} // Slides out to right
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-y-0 right-0 w-full md:w-1/2 xl:w-1/3 bg-pestBrown z-40 shadow-2xl overflow-y-auto 
                     flex flex-col border-l border-pestGreen/50"
        >
          {/* Header Image if available */}
          <div className="relative w-full h-56 md:h-72 bg-black/20 flex-shrink-0">
             {service.image ? (
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-pestDarkGreen/50">
                     <IconComponent size={64} className="text-white/20" />
                 </div>
             )}
             <button 
              onClick={onClose} 
              className="absolute top-6 right-6 bg-black/40 backdrop-blur hover:bg-black/60 text-white transition-colors p-3 rounded-full z-50"
              aria-label="Close service details"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 md:p-12 flex-1 flex flex-col">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{service.title}</h2>
            
            {service.featured && (
              <div className="mb-8">
                  <span className="bg-yellow-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
                    <Award size={16} className="fill-white" /> Featured Service
                  </span>
              </div>
            )}

            <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-pestGreen flex items-center justify-center text-white shadow-lg flex-shrink-0 mt-1">
                    <IconComponent size={32} />
                </div>
                <p className="text-white/80 text-lg md:text-xl italic font-medium leading-relaxed">{service.description}</p>
            </div>

            {/* Full Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                {service.fullDescription}
            </p>

            {/* Bulleted Details */}
            {service.details && service.details.length > 0 && (
                <ul className="space-y-4 mb-8 flex-grow bg-white/5 p-6 rounded-2xl border border-white/10">
                {service.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-3 text-pestGreen shrink-0 text-xl">&bull;</span> 
                        <span className="text-base md:text-lg text-gray-300">{detail}</span>
                    </li>
                ))}
                </ul>
            )}

            <div className="mt-auto space-y-6 pt-6 border-t border-white/10">
                {service.price && (
                <div className="flex items-center justify-between bg-pestGreen/10 text-white p-6 rounded-2xl border border-pestGreen/20">
                    <span className="text-base uppercase font-bold text-pestGreen">Starting From:</span>
                    <span className="text-3xl font-black text-white">{service.price}</span>
                </div>
                )}
                <button 
                    onClick={onBookClick}
                    className="w-full bg-pestGreen text-white px-8 py-5 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 shadow-3d hover:shadow-none hover:translate-y-1 transition-all"
                >
                    Book Now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
