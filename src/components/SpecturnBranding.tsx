import React from 'react';
import { ExternalLink } from 'lucide-react';

const SpecturnBranding: React.FC = () => {
  return (
    <section className="bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide">
          A SPECTURN PRODUCT
        </p>
        <a 
          href="https://specturn.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-lg font-bold text-white hover:text-yellow-400 transition-colors duration-300 border-b border-transparent hover:border-yellow-400"
        >
          <span>SPECTURN.IN</span>
          <ExternalLink size={14} className="ml-2" />
        </a>
        <p className="text-xs text-gray-500 mt-2 font-medium">
          Digital Solutions & Web Development
        </p>
      </div>
    </section>
  );
};

export default SpecturnBranding; 