
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
    <Section id="about" className="relative bg-pestLight py-16 md:py-32 overflow-visible border-t border-white/50">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pestStone to-transparent -z-10"></div>
      
      {/* Container with Grid layout for always 2 columns */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-8 md:gap-20 items-center relative z-10">
            
            {/* Left Content: Story & Mission - Left Aligned */}
            <div className="relative z-30">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
                    className="flex flex-col justify-center items-start text-left" 
                >
                    {/* "Since Year" Badge */}
                    <div className="bg-pestBrown text-white px-4 py-2 rounded-full shadow-md font-black text-xs md:text-sm border-2 border-white/20 mb-6">
                        Since {new Date().getFullYear() - content.company.yearsExperience}
                    </div>

                    <span className="text-pestGreen font-black text-sm md:text-base uppercase tracking-widest mb-3 block">Who We Are</span>
                    
                    <h2 className="text-3xl md:text-6xl font-black text-pestBrown mb-6 leading-tight drop-shadow-sm">
                        {content.about.title}
                    </h2>
                    
                    {/* Increased Font Size */}
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                        {content.about.text}
                    </p>

                    {/* Mission - Left Border style */}
                    <div className="border-l-4 border-pestGreen pl-6 py-2">
                        <div className="flex items-center gap-3 mb-2">
                            <Award size={24} className="text-pestGreen" />
                            <h3 className="font-bold text-pestDarkGreen text-lg md:text-xl">{content.about.missionTitle}</h3>
                        </div>
                        <p className="text-base md:text-lg text-gray-500 italic leading-relaxed">"{content.about.missionText}"</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Content: Owner Image & Detailed Features */}
            <div className="flex flex-col gap-6 md:gap-8">
                {/* Top: Owner Image - Shrink by 30% using width constraint, centered */}
                <div className="w-[70%] max-w-md mx-auto relative pb-[93.33%] rounded-[20px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                    <div className="absolute inset-0">
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
                    </div>
                    
                    {/* Floating Owner Badge */}
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 backdrop-blur px-5 py-3 md:px-6 md:py-3 rounded-xl shadow-lg border border-white/50 z-20">
                        <p className="text-xs md:text-xs text-gray-500 uppercase font-bold tracking-widest">Managed By</p>
                        <p className="text-lg md:text-2xl font-black text-pestBrown">{content.company.name.split(' ')[0] || 'Founder'}</p>
                    </div>
                </div>

                {/* Bottom: Detailed Feature Cards */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {content.about.items.map((item, i) => {
                        const IconComponent = IconMap[item.iconName] || IconMap['Circle'];
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pestGreen/30 transition-all flex flex-col h-full"
                            >
                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-pestGreen/10 flex items-center justify-center text-pestGreen shrink-0 mb-3 md:mb-4">
                                    <IconComponent size={24} className="md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-pestBrown text-base md:text-xl mb-2">{item.title}</h4>
                                    <p className="text-sm md:text-base text-gray-500 leading-snug font-medium line-clamp-4">
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
