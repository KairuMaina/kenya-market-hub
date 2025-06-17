
import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  ctaText,
  onCtaClick,
  className = ''
}) => {
  return (
    <div className={`relative h-96 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(https://images.unsplash.com/${imageUrl})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          {subtitle && (
            <p className="text-orange-200 text-lg font-medium mb-2">
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          {ctaText && onCtaClick && (
            <button
              onClick={onCtaClick}
              className="inline-block bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-lg"
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
