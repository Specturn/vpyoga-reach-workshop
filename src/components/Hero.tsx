import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToRegistration = () => {
    const element = document.getElementById('registration');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-wider">
          REACH: THE BEST VERSION OF YOU
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">
          2-Day Residential Transformational Workshop
        </h2>
        <p className="text-xl md:text-2xl font-semibold mb-8">
          August 9th & 10th, 2025
        </p>
        
        <div className="mb-2 flex justify-center animate-bounce">
          <ChevronDown size={48} className="text-yellow-400" />
        </div>
        
        <button
          onClick={scrollToRegistration}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          REGISTER NOW
        </button>
      </div>
    </section>
  );
};

export default Hero;