
import React from 'react';
import { CheckCircle2, Users, MapPin, Award, Shield, Zap, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';

const IconMap: Record<string, any> = {
  'Users': Users,
  'MapPin': MapPin,
  'CheckCircle2': CheckCircle2,
  'Award': Award,
  'Shield': Shield,
  'Zap': Zap,
  'Default': Circle
};

export const About: React.FC = () => {
  const { content } = useContent();

  return (
    <Section id="about" className="relative bg-pestLight py-16 md:py-24 overflow-visible border-t border-white/50">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pestStone to-transparent -z-10"></div>
      
      {/* UPDATED: Reduced gap on mobile */}
      <div className="grid grid-cols-2 gap-2 md:gap-20 items-center relative z-10">
        {/* Left Content */}
        <div className="relative perspective-1000 z-30">
          <motion.div 
            initial={{ opacity: 0, rotateY: 15, x: -30 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 50, duration: 0.8 }}
            className="bg-pestStone/90 backdrop-blur-xl p-3 md:p-10 rounded-[20px] md:rounded-[30px] shadow-glass border border-white/60 relative z-20"
          >
            <div className="absolute -top-3 md:-top-5 left-2 md:left-10 bg-pestBrown text-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-thick-dark font-bold text-[8px] md:text-sm transform -rotate-2">
               Since {new Date().getFullYear() - content.company.yearsExperience}
            </div>

            <span className="text-pestGreen font-black text-[8px] md:text-sm uppercase tracking-widest mb-1 md:mb-2 block mt-2 md:mt-0">Who We Are</span>
            
            <h2 className="text-lg md:text-5xl font-black text-pestBrown mb-2 md:mb-6 leading-none drop-shadow-sm">
              {content.about.title}
            </h2>
            
            <p className="text-gray-600 text-[9px] md:text-lg leading-relaxed mb-3 md:mb-8 font-medium line-clamp-6 md:line-clamp-none">
              {content.about.text}
            </p>

            <div className="bg-pestLight p-2 md:p-4 rounded-xl md:rounded-2xl border border-pestGreen/10 flex gap-2 md:gap-4 items-start transform hover:scale-105 transition-transform duration-300">
                <div className="bg-pestGreen text-white p-1 md:p-2 rounded-lg shadow-md mt-1">
                   <Award size={14} className="md:w-5 md:h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-pestDarkGreen text-[10px] md:text-lg mb-0.5 md:mb-1">{content.about.missionTitle}</h3>
                    <p className="text-gray-500 text-[8px] md:text-sm italic leading-tight">"{content.about.missionText}"</p>
                </div>
            </div>
          </motion.div>
          <div className="absolute inset-0 bg-pestGreen/10 rounded-[30px] transform translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 -z-10"></div>
        </div>

        {/* Right Content - RESIZED IMAGE CONTAINER */}
        {/* Changed h-[400px] to h-[200px] on mobile to prevent stretching */}
        <div className="relative h-[200px] md:h-[500px] perspective-2000 flex items-center justify-center z-20">
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="group relative w-full h-full md:w-[28rem] md:h-[34rem] flex flex-col items-center justify-end"
            >
                {/* Background Shadow Elements */}
                <div className="absolute bottom-0 w-4/5 h-8 md:h-12 bg-black/10 blur-lg rounded-[100%] transform scale-y-50 translate-y-2 z-0"></div>
                <div className="absolute bottom-0 w-3/4 h-4 md:h-8 bg-pestLight rounded-[100%] shadow-2xl z-0 border-t border-white/40"></div>
                
                {content.about.ownerImage ? (
                    <>
                       <div className="relative z-10 w-full h-full overflow-hidden rounded-[20px] md:rounded-[40px] border-4 border-white/20 shadow-2xl">
                           <img 
                               src={content.about.ownerImage} 
                               alt="Owner" 
                               className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
                           />
                       </div>
                       
                       <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 bg-pestStone/95 backdrop-blur px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-glass border border-white/40 z-30 transform rotate-3 hover:rotate-0 transition-transform whitespace-nowrap">
                           <p className="text-[6px] md:text-xs text-gray-500 uppercase font-bold">Owner Managed</p>
                           <p className="text-[10px] md:text-lg font-black text-pestBrown">{content.company.name.split(' ')[0] || 'Ruaan'}</p>
                       </div>

                       <div className="absolute top-2 right-2 md:top-4 md:right-4 w-fit flex flex-col items-end space-y-1 md:space-y-2 z-20">
                            {content.about.items.map((item, i) => {
                                const IconComponent = IconMap[item.iconName] || IconMap['Default'];
                                return (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 * i + 0.3, duration: 0.4 }}
                                    className="bg-white/90 backdrop-blur text-pestBrown p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg border border-white/50 flex items-center gap-1 md:gap-2 transform hover:scale-110 transition-transform"
                                >
                                    <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-pestGreen" />
                                    <span className="font-bold text-[8px] md:text-[10px] uppercase">{item.text}</span>
                                </motion.div>
                                );
                            })}
                       </div>

                    </>
                ) : (
                    <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center rounded-[20px] md:rounded-[40px] bg-pestBrown border-4 border-white/20">
                         <Users className="text-white/50 w-12 h-12 md:w-16 md:h-16" />
                    </div>
                )}
            </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-12 md:h-24 bg-gradient-to-t from-pestLight to-transparent"></div>
    </Section>
  );
};
