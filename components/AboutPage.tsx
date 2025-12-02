
import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { About } from './About';
import { WhyChooseUs } from './WhyChooseUs';
import { Safety } from './Safety';

interface AboutPageProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
  const { content } = useContent();

  return (
    <div className="relative min-h-screen flex flex-col bg-pestLight">
      <Navigation onBookClick={onBookClick} navigateTo={navigateTo} />
      
      {/* Header */}
      <Section id="about-header" className="py-24 md:pt-40 md:pb-20 bg-pestDarkGreen relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pestLight to-transparent z-10"></div>
        
        <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto text-center relative z-20">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md mb-6"
             >
                Our Story & <span className="text-pestGreen">Mission</span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                We are more than just exterminators. We are guardians of your home and the Lowveld ecosystem.
            </p>
        </div>
      </Section>

      {/* Content - Reusing the About Component but in a full page context */}
      <div className="bg-white pb-20">
         <About />
      </div>

      <WhyChooseUs />

      {/* Expanded Team/Values Section */}
      <Section id="values" className="bg-white py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                  <h3 className="text-3xl font-bold text-pestBrown mb-6">Deeply Rooted in the Lowveld</h3>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                      Founded in {new Date().getFullYear() - content.company.yearsExperience}, {content.company.name} started with a single bakkie and a commitment to doing things differently. We realized that the standard "spray everything" approach was outdated and harmful.
                  </p>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                      Today, we employ advanced Integrated Pest Management (IPM) strategies that target pests at their source while minimizing environmental impact. Our team lives in the communities we serve—from White River to Barberton—so we treat every home like our neighbor's.
                  </p>
              </div>
              <div className="bg-pestStone rounded-3xl p-8 border border-pestGreen/20 shadow-inner-3d">
                  <h4 className="text-xl font-bold text-pestGreen mb-4">Our Core Values</h4>
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-pestGreen rounded-full"></div>
                          <span className="font-bold text-pestBrown">Integrity First</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-pestGreen rounded-full"></div>
                          <span className="font-bold text-pestBrown">Safety Without Compromise</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-pestGreen rounded-full"></div>
                          <span className="font-bold text-pestBrown">Continuous Education</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-pestGreen rounded-full"></div>
                          <span className="font-bold text-pestBrown">Community Focused</span>
                      </li>
                  </ul>
              </div>
          </div>
      </Section>
      
      <Safety />
      
      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />
    </div>
  );
};
