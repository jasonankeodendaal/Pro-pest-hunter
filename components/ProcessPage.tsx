
import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { ProcessAndArea } from './ProcessAndArea';
import { ArrowRight } from 'lucide-react';

interface ProcessPageProps {
  onBookClick: () => void;
  onAdminClick: () => void;
  navigateTo: (pageName: 'home' | 'services' | 'about' | 'process' | 'contact') => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onBookClick, onAdminClick, navigateTo }) => {
  const { content } = useContent();

  return (
    <div className="relative min-h-screen flex flex-col bg-pestLight">
      <Navigation onBookClick={onBookClick} navigateTo={navigateTo} />
      
      {/* Header */}
      <Section id="process-header" className="py-24 md:pt-40 md:pb-20 bg-pestBrown relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-pestLight to-transparent z-10"></div>
        
        <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto text-center relative z-20">
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md mb-6"
             >
                How We <span className="text-pestGreen">Work</span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                Transparency is key. From the first call to the final inspection, here is exactly what you can expect from {content.company.name}.
            </p>
        </div>
      </Section>

      {/* Reusing ProcessAndArea for the core content */}
      <ProcessAndArea />

      {/* Additional Detailed Steps */}
      <Section id="process-details" className="bg-white py-20">
          <div className="max-w-4xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-12">
                   <div className="bg-pestGreen/10 text-pestGreen font-black text-5xl p-6 rounded-2xl">01</div>
                   <div>
                       <h3 className="text-2xl font-bold text-pestBrown mb-4">The Initial Consultation</h3>
                       <p className="text-gray-600 text-lg leading-relaxed">
                           When you contact us, our office team will ask specific questions to gauge the severity of your pest issue. For complex infestations (like termites or commercial audits), we schedule a site visit. For standard pests (ants, roaches), we can often provide an immediate estimate.
                       </p>
                   </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-12">
                   <div className="bg-pestGreen/10 text-pestGreen font-black text-5xl p-6 rounded-2xl">02</div>
                   <div>
                       <h3 className="text-2xl font-bold text-pestBrown mb-4">Custom Treatment Plan</h3>
                       <p className="text-gray-600 text-lg leading-relaxed">
                           No two homes are the same. We verify the species involved—misidentifying a pest is the #1 reason for treatment failure. We then select the correct chemical formulation and application method (gel, spray, bait station, or gas) that is safest for your specific environment.
                       </p>
                   </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start pb-12">
                   <div className="bg-pestGreen/10 text-pestGreen font-black text-5xl p-6 rounded-2xl">03</div>
                   <div>
                       <h3 className="text-2xl font-bold text-pestBrown mb-4">Aftercare & Prevention</h3>
                       <p className="text-gray-600 text-lg leading-relaxed">
                           Pest control is a partnership. After treatment, our technician will provide a report detailing what was done and, crucially, what you can do to prevent re-infestation (e.g., trimming branches, sealing specific cracks). We also schedule follow-ups if necessary.
                       </p>
                   </div>
              </div>
          </div>

          <div className="text-center mt-12">
              <button onClick={onBookClick} className="bg-pestGreen text-white px-8 py-4 rounded-xl font-bold text-xl shadow-thick hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-2 mx-auto">
                  Start The Process <ArrowRight />
              </button>
          </div>
      </Section>

      <Footer onAdminClick={onAdminClick} navigateTo={navigateTo} />
    </div>
  );
};
