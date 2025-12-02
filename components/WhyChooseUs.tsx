
import React from 'react';
import { Award, DollarSign, RefreshCw, Shield, Clock, HeartHandshake, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';

const IconMap: Record<string, any> = {
    'Award': Award,
    'DollarSign': DollarSign,
    'RefreshCw': RefreshCw,
    'Shield': Shield,
    'Clock': Clock,
    'HeartHandshake': HeartHandshake,
    'Default': Circle
};

export const WhyChooseUs: React.FC = () => {
  const { content } = useContent();

  return (
    <Section id="why-us" className="bg-pestBrown relative overflow-hidden py-24 md:py-40">
      {/* Deep 3D Grid Background */}
      <div className="absolute inset-0 opacity-20">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-pestGreen opacity-20 blur-[100px]"></div>
      </div>
      
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pestLight to-transparent z-10"></div>

      {/* Centered Header */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 drop-shadow-sm leading-[0.9]">
                    {content.whyChooseUs.title}
                </h2>
                <div className="w-32 h-2.5 bg-pestGreen mx-auto rounded-full mb-8 shadow-neon"></div> 
                <p className="text-gray-300 text-xl md:text-2xl border-l-4 border-pestGreen pl-6 bg-white/5 p-4 rounded-r-xl backdrop-blur-sm mx-auto font-light leading-relaxed">
                  {content.whyChooseUs.subtitle}
                </p>
            </motion.div>
         </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative z-20 perspective-1000">
        {content.whyChooseUs.items.map((item, idx) => {
            const IconComponent = IconMap[item.iconName] || IconMap['Default'];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.05, type: "spring" }}
                whileHover={{ y: -10, rotate: 2, scale: 1.03, z: 10, transition: { duration: 0.2, ease: "easeOut" } }} 
                className="group relative bg-white/5 backdrop-blur-md rounded-[30px] p-6 md:p-10 border-2 border-white/20 shadow-glass cursor-pointer
                           transition-all duration-300 overflow-hidden hover:shadow-3d hover:outline hover:outline-2 hover:outline-pestGreen/50" 
              >
                {/* Glass Reflection Shine */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-pestGreen to-pestDarkGreen shadow-lg flex items-center justify-center mb-6
                                    group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-2 border-white/30"> 
                        <IconComponent className="w-7 h-7 md:w-10 md:h-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg md:text-2xl text-white leading-tight mb-3">{item.title}</h4>
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium">{item.text}</p>
                </div>
                {/* Subtle green overlay on hover */}
                <div className="absolute inset-0 z-0 bg-pestGreen/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
        })}
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </Section>
  );
};
