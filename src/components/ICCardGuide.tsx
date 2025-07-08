import React from 'react';
import { useTranslation } from 'react-i18next';

interface CardInfo {
  name: string;
  description: string;
  price: string;
  coverage: string;
  purchaseLocations: string[];
}

const cardData: CardInfo[] = [
  {
    name: 'Suica',
    description: 'JR East\'s rechargeable IC card',
    price: '¥2,000 (includes ¥500 deposit)',
    coverage: 'JR East, Tokyo Metro, Toei Subway, and most private railways and buses',
    purchaseLocations: [
      'JR East ticket offices',
      'JR East ticket vending machines',
      'Airport stations',
    ],
  },
  {
    name: 'PASMO',
    description: 'Tokyo Metro\'s rechargeable IC card',
    price: '¥2,000 (includes ¥500 deposit)',
    coverage: 'Tokyo Metro, Toei Subway, JR East, and most private railways and buses',
    purchaseLocations: [
      'Tokyo Metro ticket offices',
      'Tokyo Metro ticket vending machines',
      'Airport stations',
    ],
  },
  {
    name: 'Tokyo Subway Ticket (24/48/72 hours)',
    description: 'Unlimited rides on Tokyo Metro and Toei Subway lines',
    price: '¥800 (24h) / ¥1,200 (48h) / ¥1,500 (72h)',
    coverage: 'Tokyo Metro and Toei Subway lines only',
    purchaseLocations: [
      'Airport stations',
      'Tourist information centers',
      'Major stations',
    ],
  },
];

export const ICCardGuide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('icCard.title')}</h2>
      
      <div className="space-y-8">
        {cardData.map((card, index) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{card.name}</h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {card.price}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{card.description}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">{t('icCard.coverage')}</h4>
              <p className="text-gray-600">{card.coverage}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">{t('icCard.purchaseLocations')}</h4>
              <ul className="list-disc list-inside text-gray-600">
                {card.purchaseLocations.map((location, idx) => (
                  <li key={idx}>{location}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">{t('icCard.tips')}</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>{t('icCard.tip1')}</li>
          <li>{t('icCard.tip2')}</li>
          <li>{t('icCard.tip3')}</li>
        </ul>
      </div>
    </div>
  );
}; 