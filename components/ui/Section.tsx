
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
          Removed max-width restriction completely to allow full-screen "corner to corner" layout as requested.
      */}
      <div className="w-full mx-auto">
        {children}
      </div>
    </section>
  );
};
