
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
    <footer className="bg-[#1a1a1a] text-gray-400 py-12 md:py-16 border-t border-white/5">
      <div className="w-full max-w-[95%] xl:max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
                <h4 className="text-white font-bold text-lg md:text-xl mb-4">{content.company.name}</h4>
                <div className="flex flex-wrap gap-3 mb-6">
                    {Array.isArray(content.company.socials) && content.company.socials.map((social) => (
                        <a 
                            key={social.id} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white/10 p-2 rounded-lg hover:bg-white/20 hover:scale-105 transition-all"
                            title={social.name}
                        >
                            <img src={social.icon} alt={social.name} className="w-5 h-5 object-contain opacity-70 hover:opacity-100" />
                        </a>
                    ))}
                </div>
                
                {(content.company.regNumber || content.company.vatNumber) && (
                    <div className="space-y-2 text-xs md:text-sm text-gray-500">
                         {content.company.regNumber && <p>Reg: {content.company.regNumber}</p>}
                         {content.company.vatNumber && <p>VAT: {content.company.vatNumber}</p>}
                    </div>
                )}
            </div>
            
            {/* Links 1 */}
            <div className="col-span-1">
                <h5 className="text-white font-bold text-base md:text-lg mb-4">Navigate</h5>
                <ul className="space-y-3 text-sm md:text-base">
                    <li><button onClick={() => navigateTo('home')} className="hover:text-pestGreen text-left w-full transition-colors">Home</button></li>
                    <li><button onClick={() => navigateTo('about')} className="hover:text-pestGreen text-left w-full transition-colors">About Us</button></li>
                    <li><button onClick={() => navigateTo('services')} className="hover:text-pestGreen text-left w-full transition-colors">Services</button></li>
                    <li><button onClick={() => navigateTo('process')} className="hover:text-pestGreen text-left w-full transition-colors">Our Process</button></li>
                </ul>
            </div>

            {/* Links 2 */}
            <div className="col-span-1">
                <h5 className="text-white font-bold text-base md:text-lg mb-4">Action</h5>
                <ul className="space-y-3 text-sm md:text-base">
                    <li><button onClick={() => navigateTo('services')} className="text-pestGreen font-bold flex items-center gap-2 text-left w-full hover:underline">Book Now <ArrowUpRight size={14} /></button></li>
                    <li><button onClick={() => navigateTo('contact')} className="hover:text-pestGreen text-left w-full transition-colors">Contact</button></li>
                    <li className="pt-4">
                        <button 
                            onClick={onAdminClick} 
                            className="flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-all w-fit border border-orange-500/20"
                        >
                            <Lock size={14} /> <span className="text-xs md:text-sm">Admin Access</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs md:text-sm text-gray-600">&copy; {new Date().getFullYear()} {content.company.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
