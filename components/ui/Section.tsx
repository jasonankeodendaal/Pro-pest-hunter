
import React from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, className = "", children }) => {
  return (
    <section id={id} className={`py-16 md:py-24 px-4 md:px-8 lg:px-12 ${className}`}>
      {/* 
          Updated Container: 
          Removed restrictive 1440px max-width. 
          Increased to 1800px and removed percentage constraint to allow "fill the page" effect.
      */}
      <div className="w-full max-w-[1800px] mx-auto">
        {children}
      </div>
    </section>
  );
};
