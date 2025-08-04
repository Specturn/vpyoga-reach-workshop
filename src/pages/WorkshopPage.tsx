import React from 'react';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import Highlights from '../components/Highlights';
import TargetAudience from '../components/TargetAudience';
import Mentor from '../components/Mentor';
import SpecialOffers from '../components/SpecialOffers';
import VenueMap from '../components/VenueMap';
import RegistrationForm from '../components/RegistrationForm';
import Contact from '../components/Contact';
import SpecturnBranding from '../components/SpecturnBranding';

const WorkshopPage: React.FC = () => {
  return (
    <div className="font-montserrat">
      <Hero />
      <Introduction />
      <Highlights />
      <TargetAudience />
      <Mentor />
      <SpecialOffers />
      <VenueMap />
      <RegistrationForm />
      <Contact />
      <SpecturnBranding />
    </div>
  );
};

export default WorkshopPage;