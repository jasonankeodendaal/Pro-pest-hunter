
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
        
        <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto text-center relative z-20">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md mb-6"
             >
                Get In <span className="text-pestGreen">Touch</span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                We are ready to help. Reach out to our HQ, visit a shop, or find a specific team member.
            </p>
        </div>
      </Section>

      {/* Locations / Shops */}
      <Section id="locations" className="bg-pestLight py-16">
          <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-pestGreen rounded-lg text-white"><Building2 size={24} /></div>
              <h2 className="text-3xl font-black text-pestBrown uppercase">Our Locations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.locations.map((loc) => (
                  <div key={loc.id} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow">
                      <div className="w-full md:w-48 h-48 bg-gray-200 rounded-2xl overflow-hidden flex-shrink-0">
                          {loc.image ? (
                              <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-pestStone text-gray-400">
                                  <Building2 size={48} />
                              </div>
                          )}
                      </div>
                      <div className="flex-1 space-y-4">
                          <div>
                              <h3 className="text-xl font-bold text-pestBrown flex items-center gap-2">
                                  {loc.name} 
                                  {loc.isHeadOffice && <span className="text-[10px] bg-pestGreen text-white px-2 py-1 rounded-full uppercase">HQ</span>}
                              </h3>
                              <p className="text-gray-500 text-sm flex items-start gap-2 mt-2">
                                  <MapPin size={16} className="mt-1 flex-shrink-0" /> {loc.address}
                              </p>
                          </div>
                          <div className="space-y-2">
                              <a href={`tel:${loc.phone}`} className="flex items-center gap-2 text-pestGreen font-bold hover:underline">
                                  <Phone size={16} /> {loc.phone}
                              </a>
                              <a href={`mailto:${loc.email}`} className="flex items-center gap-2 text-gray-600 hover:text-pestGreen text-sm">
                                  <Mail size={16} /> {loc.email}
                              </a>
                          </div>
                          <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
                                    <Clock size={14} /> Hours
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{content.company.hours.weekdays}</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </Section>

      {/* Employee Directory */}
      <Section id="directory" className="bg-white py-16 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-pestBrown rounded-lg text-white"><User size={24} /></div>
              <h2 className="text-3xl font-black text-pestBrown uppercase">Team Directory</h2>
          </div>

          {content.employees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {content.employees.map((emp) => (
                      <div key={emp.id} className="group relative bg-pestLight rounded-2xl p-6 border border-transparent hover:border-pestGreen/30 transition-all text-center">
                          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white shadow-md">
                              {emp.profileImage ? (
                                  <img src={emp.profileImage} alt={emp.fullName} className="w-full h-full object-cover" />
                              ) : (
                                  <User size={40} className="text-gray-400 w-full h-full p-4" />
                              )}
                          </div>
                          <h3 className="font-bold text-pestBrown">{emp.fullName}</h3>
                          <p className="text-xs text-pestGreen font-bold uppercase tracking-wider mb-4">{emp.jobTitle}</p>
                          
                          <div className="space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs text-gray-600 flex items-center justify-center gap-1"><Mail size={12} /> {emp.email}</p>
                              <p className="text-xs text-gray-600 flex items-center justify-center gap-1"><Phone size={12} /> {emp.tel}</p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500">
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
