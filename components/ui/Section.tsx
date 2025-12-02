
import React from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, className = "", children }) => {
  return (
    <section id={id} className={`py-16 md:py-24 px-6 md:px-12 lg:px-20 ${className}`}>
      <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto">
        {children}
      </div>
    </section>
  );
};
