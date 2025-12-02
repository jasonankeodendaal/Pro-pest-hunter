
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
    <Section id="about" className="relative bg-pestLight py-12 md:py-24 overflow-visible border-t border-white/50">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pestStone to-transparent -z-10"></div>
      
      {/* Container with Grid layout for always 2 columns */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-6 md:gap-16 items-center relative z-10">
            
            {/* Left Content: Story & Mission - FREE VIEW (No Box) */}
            <div className="relative z-30">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
                    className="flex flex-col justify-center" // Removed box styles
                >
                    {/* "Since Year" Badge */}
                    <div className="self-start bg-pestBrown text-white px-3 py-1.5 rounded-full shadow-md font-black text-xs md:text-sm transform -rotate-2 border-2 border-white/20 mb-4">
                        Since {new Date().getFullYear() - content.company.yearsExperience}
                    </div>

                    <span className="text-pestGreen font-black text-xs md:text-sm uppercase tracking-widest mb-2 block">Who We Are</span>
                    
                    <h2 className="text-2xl md:text-5xl font-black text-pestBrown mb-4 leading-tight drop-shadow-sm">
                        {content.about.title}
                    </h2>
                    
                    {/* Increased Font Size */}
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 font-medium">
                        {content.about.text}
                    </p>

                    {/* Mission - Cleaner look (Left Border) instead of Box */}
                    <div className="border-l-4 border-pestGreen pl-5 py-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Award size={20} className="text-pestGreen" />
                            <h3 className="font-bold text-pestDarkGreen text-base md:text-lg">{content.about.missionTitle}</h3>
                        </div>
                        <p className="text-sm md:text-base text-gray-500 italic leading-relaxed">"{content.about.missionText}"</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Content: Owner Image & Detailed Features */}
            <div className="flex flex-col gap-4 md:gap-6">
                {/* Top: Owner Image - Fill Column */}
                <div className="w-full mx-auto relative pb-[113.33%] rounded-[20px] md:rounded-[30px] overflow-hidden shadow-2xl border-4 border-white">
                    <div className="absolute inset-0">
                        {content.about.ownerImage ? (
                            <img 
                                src={content.about.ownerImage} 
                                alt="Owner" 
                                className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
                            />
                        ) : (
                            <div className="w-full h-full bg-pestBrown flex items-center justify-center">
                                <Users className="text-white/50 w-16 h-16" />
                            </div>
                        )}
                    </div>
                    
                    {/* Floating Owner Badge */}
                    <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-white/90 backdrop-blur px-4 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl shadow-lg border border-white/50 z-20">
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">Managed By</p>
                        <p className="text-base md:text-xl font-black text-pestBrown">{content.company.name.split(' ')[0] || 'Founder'}</p>
                    </div>
                </div>

                {/* Bottom: Detailed Feature Cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {content.about.items.map((item, i) => {
                        const IconComponent = IconMap[item.iconName] || IconMap['Circle'];
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pestGreen/30 transition-all flex flex-col h-full"
                            >
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-pestGreen/10 flex items-center justify-center text-pestGreen shrink-0 mb-2 md:mb-3">
                                    <IconComponent size={18} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-pestBrown text-sm md:text-lg mb-1">{item.title}</h4>
                                    <p className="text-xs md:text-sm text-gray-500 leading-snug font-medium line-clamp-4">
                                        {item.description || "Detailed service standard description goes here."}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </Section>
  );
};
