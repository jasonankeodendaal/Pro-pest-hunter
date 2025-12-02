
import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Section } from './ui/Section';
import { ServiceItem } from '../types';
import { ServiceGrid } from './Services';
import { ServiceDetailPanel } from './ServiceDetailPanel';

interface ServicesPageProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  navigateTo: (pageName: 'home' | 'services') => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null); // Changed to selectedService

  const handleServiceClick = (service: ServiceItem) => {
    // If the same service is clicked, close the panel; otherwise, open the new one
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
      
      {/* Updated Header Background to Dark to Ensure Navigation Visibility */}
      <Section id="full-services-intro" className="py-24 md:pt-40 md:pb-8 bg-pestDarkGreen relative overflow-hidden flex-grow">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pestLight to-transparent z-10"></div>
        
        <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto text-center relative z-20">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-sm mb-4">
                Our Comprehensive <span className="text-pestGreen">Pest Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Explore our full range of professional pest control services designed to protect your home and business. Click on any service for more details.
            </p>
        </div>
      </Section>
      
      {/* ServiceGrid is now wrapped in its own Section */}
      <Section id="services-grid" className="bg-pestLight relative py-20">
        {/* 3D Background Elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-pestGreen/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-pestBrown/5 rounded-full blur-3xl -z-0"></div>
        <ServiceGrid 
          onServiceClick={handleServiceClick} // Changed prop name
          onServiceClose={handleServiceClose} // Changed prop name
          activeServiceId={selectedService?.id || null}
          onBookClick={onBookClick}
        />
      </Section>
      
      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />

      {/* Service Detail Panel */}
      <ServiceDetailPanel 
        service={selectedService} // Pass selected service
        onClose={handleServiceClose} // Close handler
        onBookClick={onBookClick}
      />
    </div>
  );
};
