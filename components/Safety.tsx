


import React from 'react';
import { ShieldCheck, FileCheck, Leaf, Heart, Award } from 'lucide-react'; // Added Heart and Award for new defaults
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

const IconMap: Record<string, any> = LucideIcons; // Map all Lucide icons

export const Safety: React.FC = () => {
  const { content } = useContent();

  return (
    <Section id="safety" className="bg-pestBrown text-pestLight relative overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* UPDATED: Forced flex-row */}
        <div className="flex flex-row items-center gap-8 justify-between relative z-10">
            <div className="w-2/3">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex items-center gap-2 mb-2"
                >
                    <ShieldCheck className="text-pestGreen w-5 h-5 md:w-8 md:h-8 animate-pulse" />
                    <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wide">{content.safety.title}</h3>
                </motion.div>
                <motion.p 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                    className="text-gray-300 text-[10px] md:text-lg leading-relaxed font-medium border-l-4 border-pestGreen pl-4"
                >
                    {content.safety.description}
                </motion.p>
                
                {content.safety.certificates && content.safety.certificates.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-wrap gap-4"
                    >
                        {content.safety.certificates.map((cert, i) => (
                            <div key={i} className="bg-white p-2 rounded-lg shadow-lg hover:scale-105 transition-transform">
                                <img src={cert} alt="Certificate" className="h-12 md:h-16 object-contain" />
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
            
            <div className="w-1/3 flex flex-col justify-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-glass">
                {[
                    { iconName: content.safety.badge1IconName, text: content.safety.badge1 },
                    { iconName: content.safety.badge2IconName, text: content.safety.badge2 },
                    { iconName: content.safety.badge3IconName, text: content.safety.badge3 }
                ].map((item, i) => {
                    const IconComponent = IconMap[item.iconName] || IconMap['Circle']; // Fallback to Circle
                    return (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.4 + (i * 0.1), duration: 0.6 }}
                            className="flex items-center gap-3 text-pestGreen hover:text-white transition-colors group"
                        >
                            <div className="p-2 rounded-full bg-pestGreen/10 group-hover:bg-pestGreen/20 transition-colors">
                                <IconComponent size={16} className="md:w-6 md:h-6" />
                            </div>
                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider">{item.text}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </Section>
  );
};
