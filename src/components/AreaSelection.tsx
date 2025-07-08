import React from 'react';
import { Area } from '../App';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Train, Mountain, ArrowRight } from 'lucide-react';

const areaData = {
  tokyo: {
    name: 'Tokyo',
    description: 'The bustling capital city with endless possibilities',
    highlights: ['Shibuya Crossing', 'Tokyo Skytree', 'Tsukiji Market', 'Harajuku'],
    image: '/images/tokyo-tower.jpg',
    icon: Users,
    stats: { population: '14M', districts: '23 Special Wards', transport: 'Extensive Rail Network' }
  },
  yokohama: {
    name: 'Yokohama',
    description: 'Modern port city with beautiful waterfront views',
    highlights: ['Minato Mirai', 'Chinatown', 'Red Brick Warehouse', 'Cosmo World'],
    image: '/images/yokohama.jpg',
    icon: MapPin,
    stats: { population: '3.7M', districts: '18 Wards', transport: 'Connected to Tokyo' }
  },
  saitama: {
    name: 'Saitama',
    description: 'Perfect blend of traditional culture and modern living',
    highlights: ['Kawagoe', 'Omiya', 'Railway Museum', 'Chichibu'],
    image: '/images/saitama.jpg',
    icon: Train,
    stats: { population: '7.3M', districts: '40 Cities', transport: 'Major Rail Hub' }
  },
  chiba: {
    name: 'Chiba',
    description: 'Coastal prefecture with beautiful nature and beaches',
    highlights: ['Narita', 'Choshi', 'Boso Peninsula', 'Tokyo Disneyland'],
    image: '/images/chiba.jpg',
    icon: Mountain,
    stats: { population: '6.3M', districts: '37 Cities', transport: 'Airport Gateway' }
  }
};

export const AreaSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleAreaClick = (area: Area) => {
    navigate(`/category-selection/${area}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          Discover Areas in Japan
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Select an area to start your personalized travel guide.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {Object.entries(areaData).map(([key, area]) => (
            <div
              key={key}
              className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleAreaClick(key as Area)}
            >
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h2>
                <p className="text-gray-600 text-base mb-4">{area.description}</p>
                <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
                  Explore Guide
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};