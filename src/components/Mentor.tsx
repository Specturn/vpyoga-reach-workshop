import React from 'react';
import { Award, BookOpen, Users } from 'lucide-react';
import { ASSETS } from '../utils/assets';
import ImageWithFallback from './ImageWithFallback';

const Mentor: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-black text-center mb-12">
          MEET YOUR GUIDE: DR. VENKATESH T
        </h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <ImageWithFallback
              src={ASSETS.DR_VENKATESH_IMAGE}
              alt="Dr. Venkatesh T - Workshop Mentor"
              className="w-full rounded-lg shadow-xl object-cover"
              fallbackText="Dr. Venkatesh T Photo"
            />
          </div>
          
          <div className="lg:w-1/2">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Award className="text-red-500" size={32} />
                <div>
                  <h3 className="font-black text-xl">PhD (Yoga)</h3>
                  <p className="text-gray-600">Advanced Yoga Sciences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <BookOpen className="text-red-500" size={32} />
                <div>
                  <h3 className="font-black text-xl">MSc (PsyN), MBA (HR)</h3>
                  <p className="text-gray-600">Psychology & Human Resources</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Users className="text-red-500" size={32} />
                <div>
                  <h3 className="font-black text-xl">30+ Years Experience</h3>
                  <p className="text-gray-600">Transforming Lives Through Healing</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Dr. Venkatesh T is a renowned healing practitioner and transformational coach 
                with over three decades of experience in guiding individuals toward their 
                highest potential. His unique approach combines ancient wisdom with modern 
                psychology to create profound and lasting change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentor;