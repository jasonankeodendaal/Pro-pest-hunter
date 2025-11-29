
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
          className="fixed inset-y-0 right-0 w-full md:w-1/3 xl:w-1/4 bg-pestBrown z-40 shadow-2xl overflow-y-auto 
                     flex flex-col border-l border-pestGreen/50"
        >
          {/* Header Image if available */}
          <div className="relative w-full h-48 bg-black/20 flex-shrink-0">
             {service.image ? (
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-pestDarkGreen/50">
                     <IconComponent size={64} className="text-white/20" />
                 </div>
             )}
             <button 
              onClick={onClose} 
              className="absolute top-4 right-4 bg-black/40 backdrop-blur hover:bg-black/60 text-white transition-colors p-2 rounded-full"
              aria-label="Close service details"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <h2 className="text-4xl font-black text-white mb-2">{service.title}</h2>
            
            {service.featured && (
              <div className="mb-6">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md inline-flex items-center gap-1">
                    <Award size={12} className="fill-white" /> Featured Service
                  </span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pestGreen flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <IconComponent size={24} />
                </div>
                <p className="text-white/80 text-sm italic">{service.description}</p>
            </div>

            {/* Full Description */}
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {service.fullDescription}
            </p>

            {/* Bulleted Details */}
            {service.details && service.details.length > 0 && (
                <ul className="list-disc list-inside text-base text-gray-400 space-y-2 mb-6 flex-grow">
                {service.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                    <span className="mr-2 text-pestGreen shrink-0">&bull;</span> <span>{detail}</span>
                    </li>
                ))}
                </ul>
            )}

            <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
                {service.price && (
                <div className="flex items-center justify-between bg-pestGreen/10 text-white p-4 rounded-xl border border-pestGreen/20">
                    <span className="text-sm uppercase font-bold text-pestGreen">Starting From:</span>
                    <span className="text-2xl font-black text-white">{service.price}</span>
                </div>
                )}
                <button 
                    onClick={onBookClick}
                    className="w-full bg-pestGreen text-white px-6 py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 shadow-lg hover:bg-white hover:text-pestGreen transition-all"
                >
                    Book Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};