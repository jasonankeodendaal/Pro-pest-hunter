
import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Section } from './ui/Section';
import { useContent } from '../context/ContentContext';

export const Testimonials: React.FC = () => {
  const { content } = useContent();

  return (
    <Section id="reviews" className="bg-pestLight">
      <h2 className="text-3xl font-bold text-pestBrown mb-8 text-center">Client Stories</h2>
      
      {content.testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.testimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-pestGreen relative flex flex-col h-full">
                <Quote className="absolute top-4 right-4 text-pestGreen/20 w-8 h-8" />
                <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            size={14} 
                            className={`${i < t.rating ? 'fill-pestGreen text-pestGreen' : 'text-gray-300'}`} 
                        />
                    ))}
                </div>
                <p className="text-gray-600 text-sm italic mb-6 flex-grow">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-pestBrown flex items-center justify-center text-white font-bold text-xs uppercase">
                        {t.name.charAt(0)}
                    </div>
                    <div>
                        <span className="block font-bold text-pestBrown text-sm">{t.name}</span>
                        <span className="block text-xs text-gray-400 uppercase">{t.location}</span>
                    </div>
                </div>
              </div>
            ))}
          </div>
      ) : (
          <p className="text-center text-gray-500">No reviews yet.</p>
      )}
    </Section>
  );
};
