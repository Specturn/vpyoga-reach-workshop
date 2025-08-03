import React from 'react';
import { Gift, Star } from 'lucide-react';

const SpecialOffers: React.FC = () => {
  return (
    <section className="bg-yellow-400 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-black mb-8">
          EXCLUSIVE BONUSES FOR PARTICIPANTS
        </h2>
        
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="flex justify-center mb-6">
            <Gift className="text-red-500" size={64} />
          </div>
          
          <h3 className="text-2xl font-bold text-black mb-4">
            Surprise Bonuses & Special Offers Await!
          </h3>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            We have exciting surprise bonuses and special offers for our participants. 
            Details will be revealed soon! Register now to stay updated and secure 
            your exclusive benefits.
          </p>
          
          <div className="flex justify-center items-center space-x-2">
            <Star className="text-yellow-500" size={20} />
            <span className="text-lg font-semibold text-gray-600">
              Early Bird Registrations Get Extra Benefits
            </span>
            <Star className="text-yellow-500" size={20} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;