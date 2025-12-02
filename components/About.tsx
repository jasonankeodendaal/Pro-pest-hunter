

import React from 'react';
import { CheckCircle2, Users, MapPin, Award, Shield, Zap, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import * as Icons from 'lucide-react';

const IconMap = Icons as unknown as Record<string, React.ElementType>;

export const About: React.FC = () => {
  const { content } = useContent();

  return (
    <Section id="about" className="relative bg-pestLight py-16 md:py-24 overflow-visible border-t border-white/50">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pestStone to-transparent -z-10"></div>
      
      {/* Container with Flex layout for responsiveness */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch relative z-10">
        
        {/* Left Content: Story & Mission */}
        <div className="flex-1 relative z-30">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
            className="bg-pestStone/90 backdrop-blur-xl p-6 md:p-10 rounded-[30px] shadow-glass border border-white/60 relative h-full flex flex-col"
          >
            {/* "Since Year" Badge - Now positioned relatively to prevent overlap */}
            <div className="self-start bg-pestBrown text-white px-4 py-2 rounded-xl shadow-thick-dark font-bold text-sm transform -rotate-2 mb-6 inline-block">
               Since {new Date().getFullYear() - content.company.yearsExperience}
            </div>

            <span className="text-pestGreen font-black text-xs md:text-sm uppercase tracking-widest mb-2 block">Who We Are</span>
            
            <h2 className="text-3xl md:text-5xl font-black text-pestBrown mb-6 leading-none drop-shadow-sm">
              {content.about.title}
            </h2>
            
            <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-8 font-medium">
              {content.about.text}
            </p>

            <div className="mt-auto bg-pestLight p-4 rounded-2xl border border-pestGreen/10 flex gap-4 items-start transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-pestGreen text-white p-2 rounded-xl shadow-md mt-1 shrink-0">
                   <Award size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-pestDarkGreen text-lg mb-1">{content.about.missionTitle}</h3>
                    <p className="text-gray-500 text-sm italic leading-tight">"{content.about.missionText}"</p>
                </div>
            </div>
          </motion.div>
          
          {/* Decorative background blob */}
          <div className="absolute inset-0 bg-pestGreen/10 rounded-[30px] transform translate-x-3 translate-y-3 -z-10"></div>
        </div>

        {/* Right Content: Owner Image & Detailed Features */}
        <div className="flex-1 flex flex-col gap-6">
            {/* Top: Owner Image */}
            <div className="relative h-[300px] md:h-[400px] w-full rounded-[30px] overflow-hidden shadow-2xl border-4 border-white">
                {content.about.ownerImage ? (
                    <img 
                        src={content.about.ownerImage} 
                        alt="Owner" 
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
                    />
                ) : (
                    <div className="w-full h-full bg-pestBrown flex items-center justify-center">
                        <Users className="text-white/50 w-20 h-20" />
                    </div>
                )}
                
                {/* Floating Owner Badge */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-lg border border-white/50 z-20">
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Managed By</p>
                     <p className="text-xl font-black text-pestBrown">{content.company.name.split(' ')[0] || 'Founder'}</p>
                </div>
            </div>

            {/* Bottom: Detailed Feature Cards (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.about.items.map((item, i) => {
                    const IconComponent = IconMap[item.iconName] || IconMap['Circle'];
                    return (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                            className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pestGreen/30 transition-all ${i === content.about.items.length - 1 && content.about.items.length % 2 !== 0 ? 'md:col-span-2' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-pestGreen/10 flex items-center justify-center text-pestGreen shrink-0">
                                    <IconComponent size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-pestBrown text-lg leading-tight mb-1">{item.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                        {item.description || "Top-tier service standard."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
      </div>
    </Section>
  );
};