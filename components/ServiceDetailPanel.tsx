
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceItem } from '../types';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronRight, Award } from 'lucide-react';

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
          className="fixed inset-y-0 right-0 w-full md:w-[60%] xl:w-[40%] bg-pestBrown z-[60] shadow-2xl overflow-y-auto 
                     flex flex-col border-l-4 border-pestGreen"
        >
          {/* Close Arrow Button - Positioned on the LEFT edge vertically centered */}
          <button 
              onClick={onClose} 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50 bg-white/10 hover:bg-pestGreen text-white p-4 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 border border-white/20 group"
              title="Close Details"
          >
              <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Header Image if available */}
          <div className="relative w-full h-64 md:h-80 bg-black/20 flex-shrink-0">
             {service.image ? (
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-pestDarkGreen/50">
                     <IconComponent size={80} className="text-white/20" />
                 </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-pestBrown to-transparent"></div>
          </div>

          <div className="p-8 md:p-16 flex-1 flex flex-col -mt-20 relative z-10">
            {service.featured && (
              <div className="mb-4">
                  <span className="bg-yellow-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
                    <Award size={16} className="fill-white" /> Featured
                  </span>
              </div>
            )}

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-none">{service.title}</h2>
            
            <div className="flex items-start gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl bg-pestGreen flex items-center justify-center text-white shadow-lg flex-shrink-0 mt-1 border-2 border-white/20">
                    <IconComponent size={40} />
                </div>
                <p className="text-white/90 text-xl md:text-2xl italic font-medium leading-relaxed">{service.description}</p>
            </div>

            {/* Full Description */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
                {service.fullDescription}
            </p>

            {/* Bulleted Details */}
            {service.details && service.details.length > 0 && (
                <div className="mb-10 flex-grow">
                    <h3 className="text-pestGreen font-bold uppercase tracking-widest text-sm mb-4">What's Included</h3>
                    <ul className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10">
                    {service.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                            <span className="mr-3 text-pestGreen shrink-0 text-xl font-bold">&bull;</span> 
                            <span className="text-lg md:text-xl text-gray-300 font-medium">{detail}</span>
                        </li>
                    ))}
                    </ul>
                </div>
            )}

            <div className="mt-auto space-y-6 pt-8 border-t border-white/10">
                {service.price && (
                <div className="flex items-center justify-between bg-pestGreen/10 text-white p-6 rounded-2xl border border-pestGreen/20">
                    <span className="text-lg uppercase font-bold text-pestGreen">Estimated Cost:</span>
                    <span className="text-4xl font-black text-white">{service.price}</span>
                </div>
                )}
                <button 
                    onClick={onBookClick}
                    className="w-full bg-pestGreen text-white px-8 py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 shadow-3d hover:shadow-neon hover:translate-y-[-2px] transition-all"
                >
                    Book This Service <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
