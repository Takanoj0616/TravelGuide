import React from 'react';
import { useTranslation } from 'react-i18next';

interface AirportInfo {
  name: string;
  transportation: {
    type: string;
    description: string;
    duration: string;
    cost: string;
  }[];
}

const airportData: Record<string, AirportInfo> = {
  narita: {
    name: 'Narita International Airport',
    transportation: [
      {
        type: 'Narita Express (N\'EX)',
        description: 'Direct train to Tokyo Station, Shinjuku, and other major stations',
        duration: 'About 60 minutes to Tokyo Station',
        cost: '¥3,070 (one way)',
      },
      {
        type: 'Airport Limousine Bus',
        description: 'Direct bus service to major hotels and stations',
        duration: 'About 90-120 minutes to Tokyo',
        cost: '¥3,100 (one way)',
      },
      {
        type: 'Keisei Skyliner',
        description: 'Express train to Nippori and Ueno stations',
        duration: 'About 40 minutes to Nippori',
        cost: '¥2,520 (one way)',
      },
    ],
  },
  haneda: {
    name: 'Haneda Airport',
    transportation: [
      {
        type: 'Tokyo Monorail',
        description: 'Direct connection to Hamamatsucho Station',
        duration: 'About 15 minutes',
        cost: '¥490 (one way)',
      },
      {
        type: 'Keikyu Line',
        description: 'Direct connection to Shinagawa Station',
        duration: 'About 15 minutes',
        cost: '¥410 (one way)',
      },
      {
        type: 'Airport Limousine Bus',
        description: 'Direct bus service to major hotels and stations',
        duration: 'About 30-60 minutes',
        cost: '¥1,200 (one way)',
      },
    ],
  },
};

export const AirportNavigation: React.FC = () => {
  const { t } = useTranslation();
  const [selectedAirport, setSelectedAirport] = React.useState<'narita' | 'haneda'>('narita');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('airport.title')}</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedAirport('narita')}
            className={`px-4 py-2 rounded-md ${
              selectedAirport === 'narita'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t('airport.narita')}
          </button>
          <button
            onClick={() => setSelectedAirport('haneda')}
            className={`px-4 py-2 rounded-md ${
              selectedAirport === 'haneda'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t('airport.haneda')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">{airportData[selectedAirport].name}</h3>
        
        {airportData[selectedAirport].transportation.map((option, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h4 className="font-bold text-lg mb-2">{option.type}</h4>
            <p className="text-gray-600 mb-2">{option.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{option.duration}</span>
              <span>{option.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 