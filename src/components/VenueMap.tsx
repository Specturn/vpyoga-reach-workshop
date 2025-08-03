import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const VenueMap: React.FC = () => {
  const venuePosition: [number, number] = [12.813198409953795, 77.48866928758359]; // Updated coordinates for the workshop venue

  return (
    <section className="bg-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-12">
          WORKSHOP VENUE & SCHEDULE
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-black text-black mb-6">EVENT DETAILS</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-red-500 text-lg">Dates:</h4>
                <p className="text-black text-xl">August 9th & 10th, 2025</p>
                <p className="text-gray-600">(Saturday & Sunday)</p>
              </div>
              
              <div>
                <h4 className="font-bold text-red-500 text-lg">Venue:</h4>
                <p className="text-black text-lg font-semibold">Fireflies Intercultural Center</p>
                <p className="text-gray-600">
                  Kanakapura Road, Kaggalipura<br />
                  Bengaluru, Karnataka 560082
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-red-500 text-lg">Workshop Type:</h4>
                <p className="text-black">2-Day Residential Program</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <h3 className="text-xl font-black text-black mb-4 text-center">VENUE LOCATION</h3>
            <div className="h-80 rounded-lg overflow-hidden">
              <MapContainer
                center={venuePosition}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={venuePosition} icon={markerIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>Workshop Venue</strong><br />
                      Fireflies Intercultural Center<br />
                      Kaggalipura, Bengaluru
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueMap;