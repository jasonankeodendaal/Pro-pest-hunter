
import React from 'react';
import { Phone, Mail, MapPin, ArrowRight, CalendarCheck, MessageSquare } from 'lucide-react';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

interface ContactProps {
  onBookNow: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onBookNow }) => {
  const { content } = useContent();

  return (
    <Section id="contact" className="bg-pestStone py-10 md:py-20 relative overflow-hidden">
       <div id="booking" className="absolute -top-24 left-0"></div>
       <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pestBrown/5 to-transparent pointer-events-none"></div>

       <div className="max-w-[85rem] mx-auto perspective-1000">
          {/* UPDATED: Forced flex-row. Removed min-h-[500px] on mobile to fit content naturally. Added md:min-h-[500px] */}
          <div className="bg-pestLight rounded-[24px] md:rounded-[40px] shadow-3d overflow-hidden flex flex-row min-h-0 md:min-h-[500px] border-4 border-white/50 transform hover:scale-[1.01] transition-transform duration-500 group">
            
            {/* Left Panel: Call To Action */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-1/2 bg-pestGreen text-white p-3 md:p-16 relative overflow-hidden flex flex-col justify-center"
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Compact Badge */}
                    <div className="flex items-center gap-1 md:gap-2 text-pestBrown font-bold bg-pestLight w-fit px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-thick mb-3 md:mb-8 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                        <CalendarCheck size={10} className="md:w-5 md:h-5" />
                        <span className="text-[7px] md:text-xs uppercase tracking-wider whitespace-nowrap">Online Priority</span>
                    </div>

                    {/* Scaled Heading */}
                    <h2 className="text-lg md:text-7xl font-black leading-[0.9] mb-2 md:mb-6 drop-shadow-md" style={{ textShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                        {content.bookCTA.title}
                    </h2>
                    
                    {/* Scaled Subtitle */}
                    <p className="text-[9px] md:text-2xl mb-4 md:mb-12 text-white/90 font-medium max-w-lg border-l-2 md:border-l-4 border-white/30 pl-2 md:pl-6 leading-tight">
                        {content.bookCTA.subtitle}
                    </p>

                    <button 
                        onClick={onBookNow}
                        // Compact Button
                        className="bg-pestBrown text-white font-black text-[10px] md:text-xl px-3 py-2 md:px-12 md:py-6 rounded-lg md:rounded-2xl shadow-thick-dark hover:translate-y-1 hover:shadow-xl transition-all duration-200 flex items-center gap-1 md:gap-4 group/btn border border-white/10 w-fit"
                    >
                        <span>{content.bookCTA.buttonText}</span>
                        <div className="bg-white/10 p-0.5 md:p-2 rounded-md md:rounded-lg group-hover/btn:bg-pestGreen transition-colors">
                            <ArrowRight className="w-3 h-3 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* Right Panel: Contact Details */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-1/2 bg-pestBrown text-white p-3 md:p-12 flex flex-col justify-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-pestGreen/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-center">
                    <div className="mb-2 md:mb-8">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-8 border border-white/10 shadow-lg backdrop-blur-sm">
                           <MessageSquare className="text-pestGreen w-4 h-4 md:w-6 md:h-6" />
                        </div>
                        
                        <span className="block text-[7px] md:text-xs font-bold text-pestGreen mb-1 md:mb-3 uppercase tracking-widest">{content.contact.subtitle}</span>
                        <h3 className="text-xl md:text-4xl font-black mb-4 md:mb-12 uppercase tracking-tight leading-none text-white">
                            {content.contact.title}
                        </h3>
                        
                        <div className="space-y-3 md:space-y-8">
                            <div className="flex items-center gap-2 md:gap-4 group/item">
                                <div className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-pestGreen transition-all duration-300 shadow-inner border border-white/5 flex-shrink-0">
                                    <Phone className="text-white w-3 h-3 md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[7px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Phone</span>
                                    <a href={`tel:${content.company.phone}`} className="font-bold text-[10px] md:text-xl leading-tight hover:text-pestGreen transition-colors truncate block">{content.company.phone}</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4 group/item">
                                <div className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-pestGreen transition-all duration-300 shadow-inner border border-white/5 flex-shrink-0">
                                    <Mail className="text-white w-3 h-3 md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[7px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Email</span>
                                    <a href={`mailto:${content.company.email}`} className="font-bold text-[10px] md:text-xl leading-tight hover:text-pestGreen transition-colors break-all block">{content.company.email}</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4 group/item">
                                <div className="w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-pestGreen transition-all duration-300 shadow-inner border border-white/5 flex-shrink-0">
                                    <MapPin className="text-white w-3 h-3 md:w-5 md:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <span className="block text-[7px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Address</span>
                                    <span className="font-bold text-[10px] md:text-xl leading-tight block truncate">{content.company.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {content.contact.mapEmbedUrl && (
                        <div className="mt-auto pt-2 md:pt-4 border-t border-white/10 hidden md:block">
                            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg h-32 md:h-48">
                                <iframe 
                                    src={content.contact.mapEmbedUrl} 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={false} 
                                    loading="lazy" 
                                    title="Office Location Map"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

          </div>
       </div>
    </Section>
  );
};
