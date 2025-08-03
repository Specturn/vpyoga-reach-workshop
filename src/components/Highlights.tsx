import React from 'react';
import { Heart, Brain, Sparkles, Zap, Target, Leaf, Star, Hand } from 'lucide-react';

const highlights = [
  { icon: Heart, title: 'VISHY Healing Techniques', color: 'text-red-500' },
  { icon: Brain, title: 'Stress Relief & Emotional Healing', color: 'text-blue-500' },
  { icon: Sparkles, title: 'Clearing Limiting Beliefs', color: 'text-purple-500' },
  { icon: Zap, title: 'Deep Emotional Cleansing', color: 'text-yellow-500' },
  { icon: Target, title: 'Chakra Balancing & Healing', color: 'text-green-500' },
  { icon: Leaf, title: 'Healing Pranayama & Relaxation', color: 'text-teal-500' },
  { icon: Star, title: 'Reiki Healing', color: 'text-indigo-500' },
  { icon: Hand, title: 'Acupressure Healing & Mudras', color: 'text-orange-500' }
];

const Highlights: React.FC = () => {
  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-12">
          TRANSFORM YOUR LIFE WITH THESE POWERFUL TECHNIQUES
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg text-center hover:transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <item.icon className={`mx-auto mb-4 ${item.color}`} size={48} />
              <h3 className="font-bold text-black text-lg">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;