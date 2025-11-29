
import React from 'react';
import { ArrowRight, Leaf, FileCheck, Award, Circle } from 'lucide-react'; // Added Award icon for featured
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types';
import * as Icons from 'lucide-react'; // Import all lucide icons

// Redefine IconMap to use the Icons object directly
const IconMap = Icons as unknown as Record<string, React.ElementType>;

interface ServiceGridProps {
  onServiceClick: (service: ServiceItem) => void; // Changed from onServiceHover
  onServiceClose: () => void; // Changed from onServiceLeave, used for closing current panel if clicking outside? (Not directly used here)
  activeServiceId: string | null;
  onBookClick: () => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onServiceClick, onServiceClose, activeServiceId, onBookClick }) => {
  const { content } = useContent();

  // Filter services to only show those marked as visible
  const visibleServices = content.services.filter(service => service.visible);

  return (
    // Removed Section wrapper: Parent component (ServicesPage) will now wrap ServiceGrid in a Section.
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 perspective-1000">
        {visibleServices.map((service, i) => {
          const IconComponent = (IconMap as any)[service.iconName] || IconMap['Circle'];
          const isActive = activeServiceId === service.id;
          
          return (
            <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30, rotateX: 5 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -10, rotate: 1, scale: 1.02, z: 10, transition: { duration: 0.2, ease: "easeOut" } }}
                onClick={() => onServiceClick(service)} // Changed to onClick
                className={`group relative rounded-[20px] border-2 shadow-thick hover:shadow-3d-hover transition-all duration-200 overflow-hidden flex flex-col h-full cursor-pointer
                           ${isActive ? 'border-pestGreen/50 bg-pestStone' : 'border-white/50 bg-pestStone'}`}
            >
                {/* Featured Badge */}
                {service.featured && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 right-4 bg-yellow-500 text-white text-[8px] md:text-xs font-bold px-3 py-1 rounded-full shadow-md z-20 flex items-center gap-1"
                    >
                        <Award size={12} className="fill-white" /> Featured
                    </motion.div>
                )}

                {/* Inner Depth Shadow */}
                <div className="absolute inset-0 shadow-inner opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 rounded-[18px]"></div>
                
                <div className="p-5 md:p-8 flex flex-col h-full relative z-10">
                    <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pestLight to-pestLight shadow-inner border border-white/60 flex items-center justify-center mb-4 transition-transform duration-300
                                     ${isActive ? 'scale-110 bg-pestGreen text-white' : 'group-hover:scale-110 group-hover:bg-pestGreen group-hover:text-white'}`}>
                        <IconComponent className={`w-5 h-5 md:w-8 md:h-8 transition-colors ${isActive ? 'text-white' : 'text-pestBrown group-hover:text-white'}`} />
                    </div>
                    
                    <h3 className="text-sm md:text-2xl font-black text-pestBrown mb-1 leading-tight">{service.title}</h3>
                    
                    {/* Price Display */}
                    {service.price && (
                        <p className="text-[9px] md:text-sm text-pestGreen font-bold mb-3">{service.price}</p>
                    )}

                    <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed mb-4 flex-grow font-medium">
                       {service.description} {/* This is now the short description */}
                    </p>

                    <button onClick={onBookClick} className="mt-auto flex items-center text-[10px] md:text-sm font-bold text-pestGreen group-hover:underline decoration-2 underline-offset-4">
                        Book Now <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                
                {/* Decorative Corner */}
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-pestGreen/5 rounded-full z-0 group-hover:scale-[5] transition-transform duration-500 ease-out"></div>
            </motion.div>
          );
        })}
      </div>
  );
};