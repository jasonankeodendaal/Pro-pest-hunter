

import React from 'react';
import { Lock, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onAdminClick?: () => void;
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, navigateTo }) => {
  const { content } = useContent();

  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-8 md:py-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {/* Brand */}
            <div className="col-span-1">
                <h4 className="text-white font-bold text-xs md:text-lg mb-2 md:mb-4">{content.company.name}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {content.company.socials.map((social) => (
                        <a 
                            key={social.id} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white/10 p-1.5 rounded-lg hover:bg-white/20 hover:scale-105 transition-all"
                            title={social.name}
                        >
                            <img src={social.icon} alt={social.name} className="w-4 h-4 object-contain opacity-70 hover:opacity-100" />
                        </a>
                    ))}
                </div>
                
                {(content.company.regNumber || content.company.vatNumber) && (
                    <div className="space-y-1 text-[8px] md:text-[10px] text-gray-600">
                         {content.company.regNumber && <p>Reg: {content.company.regNumber}</p>}
                         {content.company.vatNumber && <p>VAT: {content.company.vatNumber}</p>}
                    </div>
                )}
            </div>
            
            {/* Links 1 */}
            <div className="col-span-1">
                <h5 className="text-white font-bold text-[10px] md:text-sm mb-2">Navigate</h5>
                <ul className="space-y-1 text-[9px] md:text-sm">
                    <li><button onClick={() => navigateTo('home')} className="hover:text-pestGreen text-left w-full">Home</button></li>
                    <li><button onClick={() => navigateTo('about')} className="hover:text-pestGreen text-left w-full">About Us</button></li>
                    <li><button onClick={() => navigateTo('services')} className="hover:text-pestGreen text-left w-full">Services</button></li>
                    <li><button onClick={() => navigateTo('process')} className="hover:text-pestGreen text-left w-full">Our Process</button></li>
                </ul>
            </div>

            {/* Links 2 */}
            <div className="col-span-1">
                <h5 className="text-white font-bold text-[10px] md:text-sm mb-2">Action</h5>
                <ul className="space-y-1 text-[9px] md:text-sm">
                    <li><button onClick={() => navigateTo('services')} className="text-pestGreen font-bold flex items-center gap-1 text-left w-full">Book Now <ArrowUpRight size={10} /></button></li>
                    <li><button onClick={() => navigateTo('contact')} className="hover:text-pestGreen text-left w-full">Contact</button></li>
                    <li>
                        <button onClick={onAdminClick} className="flex items-center gap-1 hover:text-white opacity-50 hover:opacity-100 mt-2 text-left w-full">
                            <Lock size={8} /> <span className="text-[8px]">Admin</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/5 text-center">
            <p className="text-[8px] text-gray-600">&copy; {new Date().getFullYear()} {content.company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};