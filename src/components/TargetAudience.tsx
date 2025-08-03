import React from 'react';
import { Users, Briefcase, Heart, Compass, Crown, Sparkles, Baby, Lightbulb } from 'lucide-react';

const audienceTypes = [
  { icon: Users, title: 'Achievers and Dreamers' },
  { icon: Lightbulb, title: 'Lifestyle Seekers' },
  { icon: Heart, title: 'Couples' },
  { icon: Compass, title: 'Spiritual Explorers' },
  { icon: Crown, title: 'CEOs and Leaders' },
  { icon: Sparkles, title: 'Healing Enthusiasts' },
  { icon: Briefcase, title: 'Aspiring Change-Makers' },
  { icon: Baby, title: 'Parents/Families' }
];

const TargetAudience: React.FC = () => {
  return (
    <section className="bg-red-500 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-12">
          WHO SHOULD ATTEND THIS WORKSHOP?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audienceTypes.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg text-center hover:bg-yellow-100 transition-all duration-300 shadow-xl"
            >
              <item.icon className="mx-auto mb-4 text-red-500" size={40} />
              <h3 className="font-bold text-black text-lg">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;