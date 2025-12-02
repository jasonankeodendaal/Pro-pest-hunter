
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Section } from './ui/Section';
import { ServiceItem } from '../types';
import { ServiceGrid } from './Services';
import { ServiceDetailPanel } from './ServiceDetailPanel';
import { motion } from 'framer-motion';

interface ServicesPageProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  navigateTo: (pageName: 'home' | 'services') => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleServiceClick = (service: ServiceItem) => {
    if (selectedService?.id === service.id) {
      setSelectedService(null);
    } else {
      setSelectedService(service);
    }
  };

  const handleServiceClose = () => {
    setSelectedService(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navigation onBookClick={onBookClick} navigateTo={navigateTo} />
      
      {/* Header - Left Aligned on Desktop */}
      <Section id="full-services-intro" className="py-24 md:pt-48 md:pb-20 bg-pestDarkGreen relative overflow-hidden flex-grow">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pestLight to-transparent z-10"></div>
        
        <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto relative z-20 text-left">
            <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-8xl font-black text-white leading-tight drop-shadow-sm mb-8"
            >
                Our Comprehensive <br/><span className="text-pestGreen">Pest Solutions</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-3xl text-gray-300 max-w-5xl font-light leading-relaxed border-l-4 border-pestGreen pl-6"
            >
                Explore our full range of professional pest control services designed to protect your home and business. Click on any service card below for detailed information.
            </motion.p>
        </div>
      </Section>
      
      <Section id="services-grid" className="bg-pestLight relative py-24 md:py-32">
        {/* 3D Background Elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-pestGreen/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-pestBrown/5 rounded-full blur-3xl -z-0"></div>
        <ServiceGrid 
          onServiceClick={handleServiceClick}
          onServiceClose={handleServiceClose}
          activeServiceId={selectedService?.id || null}
          onBookClick={onBookClick}
        />
      </Section>
      
      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />

      <ServiceDetailPanel 
        service={selectedService}
        onClose={handleServiceClose}
        onBookClick={onBookClick}
      />
    </div>
  );
};
