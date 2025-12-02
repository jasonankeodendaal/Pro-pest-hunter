
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
    <Section id="contact" className="bg-pestStone py-8 md:py-20 relative overflow-hidden">
       {/* Decorative Background Elements */}
       <div id="booking" className="absolute -top-24 left-0"></div>
       <div className="hidden md:block absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pestBrown/5 to-transparent pointer-events-none"></div>

       <div className="mx-auto perspective-1000 max-w-[98%] xl:max-w-[1440px]">
          {/* Main Card Container */}
          <div className="bg-pestLight rounded-[20px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-row min-h-0 md:min-h-[500px] border border-white/50 transform transition-transform duration-500 hover:scale-[1.005]">
            
            {/* Left Panel: Call To Action */}
            <div className="w-1/2 bg-pestGreen text-white p-3 sm:p-4 md:p-12 relative overflow-hidden flex flex-col justify-center items-center md:items-start text-center md:text-left">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 flex flex-col items-center md:items-start h-full justify-center w-full py-4 md:py-0">
                    {/* Badge */}
                    <div className="hidden md:flex items-center gap-2 text-pestBrown font-bold bg-pestLight px-4 py-2 rounded-xl shadow-thick mb-6 transform -rotate-2">
                        <CalendarCheck size={18} />
                        <span className="text-xs uppercase tracking-wider">Online Priority</span>
                    </div>

                    {/* Mobile Badge */}
                    <div className="md:hidden flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full mb-1">
                         <CalendarCheck size={10} className="text-white"/>
                         <span className="text-[8px] font-bold uppercase tracking-wide">Priority</span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-6xl lg:text-7xl font-black leading-none mb-1 md:mb-6 drop-shadow-md">
                        {content.bookCTA.title}
                    </h2>
                    
                    {/* Desktop Subtitle */}
                    <p className="hidden md:block text-xl mb-8 text-white/90 font-medium max-w-lg border-l-4 border-white/30 pl-6">
                        {content.bookCTA.subtitle}
                    </p>
                    
                    {/* Mobile Subtitle - Increased size */}
                    <p className="md:hidden text-[10px] text-white/90 font-medium mb-2 max-w-[95%] leading-tight opacity-90 line-clamp-2">
                        {content.bookCTA.subtitle}
                    </p>

                    <button 
                        onClick={onBookNow}
                        className="bg-pestBrown hover:bg-pestDarkGreen text-white font-black text-xs md:text-xl px-4 py-2 md:px-10 md:py-5 rounded-lg md:rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-1 md:gap-3 group/btn border border-white/10 mt-1 md:mt-0"
                    >
                        <span>{content.bookCTA.buttonText}</span>
                        <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Right Panel: Contact Details */}
            <div className="w-1/2 bg-pestBrown text-white p-3 sm:p-4 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-pestGreen/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-center w-full py-4 md:py-0">
                    {/* Header Icon */}
                    <div className="hidden md:flex w-12 h-12 bg-white/5 rounded-2xl items-center justify-center mb-8 border border-white/10 shadow-lg backdrop-blur-sm">
                       <MessageSquare className="text-pestGreen w-6 h-6" />
                    </div>

                    {/* Mobile Header */}
                    <div className="md:hidden mb-1 flex items-center justify-center gap-1 opacity-60">
                        <MessageSquare size={12} className="text-pestGreen" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-pestGreen">Contact</span>
                    </div>
                    
                    <h3 className="hidden md:block text-4xl font-black mb-12 uppercase tracking-tight leading-none text-white">
                        {content.contact.title}
                    </h3>

                    <div className="space-y-3 md:space-y-8 flex flex-col justify-center">
                        {/* Phone */}
                        <a href={`tel:${content.company.phone}`} className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 group text-center md:text-left">
                            <div className="w-6 h-6 md:w-12 md:h-12 rounded-md md:rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-pestGreen transition-colors duration-300">
                                <Phone className="text-white w-3 h-3 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                                <span className="hidden md:block text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Phone</span>
                                <span className="font-bold text-xs md:text-xl leading-tight truncate block">{content.company.phone}</span>
                            </div>
                        </a>

                        {/* Email */}
                        <a href={`mailto:${content.company.email}`} className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 group text-center md:text-left">
                            <div className="w-6 h-6 md:w-12 md:h-12 rounded-md md:rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-pestGreen transition-colors duration-300">
                                <Mail className="text-white w-3 h-3 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0 w-full">
                                <span className="hidden md:block text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Email</span>
                                <span className="font-bold text-[10px] md:text-xl leading-tight break-all md:break-normal block line-clamp-1 px-1">{content.company.email}</span>
                            </div>
                        </a>

                        {/* Address */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-4 group text-center md:text-left">
                            <div className="w-6 h-6 md:w-12 md:h-12 rounded-md md:rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-pestGreen transition-colors duration-300">
                                <MapPin className="text-white w-3 h-3 md:w-5 md:h-5" />
                            </div>
                            <div className="min-w-0">
                                <span className="hidden md:block text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Address</span>
                                <span className="font-bold text-[10px] md:text-xl leading-tight block line-clamp-2 md:line-clamp-none opacity-80 md:opacity-100 px-1">{content.company.address}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Desktop Map Frame - NO IMAGE FALLBACK */}
                    {content.contact.mapEmbedUrl && (
                        <div className="mt-auto pt-4 border-t border-white/10 hidden lg:block">
                            <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg h-48">
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
            </div>

          </div>
       </div>
    </Section>
  );
};
