
import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Contact } from './Contact'; // Reuse the contact form section
import { MapPin, Phone, Mail, Clock, User, Building2 } from 'lucide-react';

interface ContactPageProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
  const { content } = useContent();

  return (
    <div className="relative min-h-screen flex flex-col bg-pestLight">
      <Navigation onBookClick={onBookClick} navigateTo={navigateTo} />
      
      {/* Header */}
      <Section id="contact-header" className="py-24 md:pt-40 md:pb-20 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pestLight to-transparent z-10"></div>
        
        <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto text-center relative z-20">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md mb-6"
             >
                Get In <span className="text-pestGreen">Touch</span>
            </motion.h1>
            <p className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                We are ready to help. Reach out to our HQ, visit a shop, or find a specific team member.
            </p>
        </div>
      </Section>

      {/* Locations / Shops */}
      <Section id="locations" className="bg-pestLight py-20">
          <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-pestGreen rounded-xl text-white"><Building2 size={32} /></div>
              <h2 className="text-4xl font-black text-pestBrown uppercase">Our Locations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {content.locations.map((loc) => (
                  <div key={loc.id} className="bg-white rounded-[30px] p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col xl:flex-row gap-8 hover:shadow-2xl transition-shadow">
                      <div className="w-full xl:w-56 h-56 bg-gray-200 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white shadow-sm">
                          {loc.image ? (
                              <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-pestStone text-gray-400">
                                  <Building2 size={64} />
                              </div>
                          )}
                      </div>
                      <div className="flex-1 space-y-6">
                          <div>
                              <h3 className="text-2xl font-black text-pestBrown flex items-center gap-3">
                                  {loc.name} 
                                  {loc.isHeadOffice && <span className="text-xs bg-pestGreen text-white px-3 py-1 rounded-full uppercase font-bold tracking-wider">HQ</span>}
                              </h3>
                              <p className="text-gray-500 text-base md:text-lg flex items-start gap-3 mt-3 leading-relaxed font-medium">
                                  <MapPin size={20} className="mt-1 flex-shrink-0 text-pestGreen" /> {loc.address}
                              </p>
                          </div>
                          <div className="space-y-3">
                              <a href={`tel:${loc.phone}`} className="flex items-center gap-3 text-pestGreen font-bold text-lg hover:underline">
                                  <Phone size={20} /> {loc.phone}
                              </a>
                              <a href={`mailto:${loc.email}`} className="flex items-center gap-3 text-gray-600 hover:text-pestGreen text-base md:text-lg font-medium transition-colors">
                                  <Mail size={20} /> {loc.email}
                              </a>
                          </div>
                          <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                                    <Clock size={16} /> Business Hours
                                </div>
                                <p className="text-base text-gray-600 font-medium">{content.company.hours.weekdays}</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </Section>

      {/* Employee Directory */}
      <Section id="directory" className="bg-white py-20 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-pestBrown rounded-xl text-white"><User size={32} /></div>
              <h2 className="text-4xl font-black text-pestBrown uppercase">Team Directory</h2>
          </div>

          {content.employees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {content.employees.map((emp) => (
                      <div key={emp.id} className="group relative bg-pestLight rounded-3xl p-8 border border-transparent hover:border-pestGreen/30 transition-all text-center hover:shadow-xl">
                          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 mb-6 border-4 border-white shadow-lg">
                              {emp.profileImage ? (
                                  <img src={emp.profileImage} alt={emp.fullName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              ) : (
                                  <User size={64} className="text-gray-400 w-full h-full p-6" />
                              )}
                          </div>
                          <h3 className="font-black text-xl text-pestBrown mb-1">{emp.fullName}</h3>
                          <p className="text-sm text-pestGreen font-bold uppercase tracking-wider mb-6">{emp.jobTitle}</p>
                          
                          <div className="space-y-3 opacity-80 group-hover:opacity-100 transition-opacity">
                              <p className="text-sm text-gray-600 flex items-center justify-center gap-2 font-medium"><Mail size={16} /> {emp.email}</p>
                              <p className="text-sm text-gray-600 flex items-center justify-center gap-2 font-medium"><Phone size={16} /> {emp.tel}</p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-gray-500 text-lg">
                  No team members listed publicly yet.
              </div>
          )}
      </Section>

      {/* Form Section */}
      <Contact onBookNow={onBookClick} />

      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />
    </div>
  );
};
