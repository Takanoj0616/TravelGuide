import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from './Map';

interface TransportationOption {
  type: string;
  description: string;
  price: string;
  duration: string;
  tips: string[];
}

interface TransportationGuideProps {
  fromAirport?: 'narita' | 'haneda';
  toDestination?: string;
}

export const TransportationGuide: React.FC<TransportationGuideProps> = ({
  fromAirport,
  toDestination
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string>('');

  const airportOptions: Record<string, TransportationOption[]> = {
    narita: [
      {
        type: 'Narita Express',
        description: t('transportation.naritaExpressDesc'),
        price: '3,020円',
        duration: '約60分',
        tips: [
          t('transportation.naritaExpressTip1'),
          t('transportation.naritaExpressTip2'),
          t('transportation.naritaExpressTip3')
        ]
      },
      {
        type: 'Skyliner',
        description: t('transportation.skylinerDesc'),
        price: '2,520円',
        duration: '約41分',
        tips: [
          t('transportation.skylinerTip1'),
          t('transportation.skylinerTip2'),
          t('transportation.skylinerTip3')
        ]
      },
      {
        type: 'Airport Limousine Bus',
        description: t('transportation.limousineBusDesc'),
        price: '3,100円',
        duration: '約90分',
        tips: [
          t('transportation.limousineBusTip1'),
          t('transportation.limousineBusTip2'),
          t('transportation.limousineBusTip3')
        ]
      }
    ],
    haneda: [
      {
        type: 'Tokyo Monorail',
        description: t('transportation.monorailDesc'),
        price: '490円',
        duration: '約15分',
        tips: [
          t('transportation.monorailTip1'),
          t('transportation.monorailTip2'),
          t('transportation.monorailTip3')
        ]
      },
      {
        type: 'Keikyu Line',
        description: t('transportation.keikyuDesc'),
        price: '410円',
        duration: '約13分',
        tips: [
          t('transportation.keikyuTip1'),
          t('transportation.keikyuTip2'),
          t('transportation.keikyuTip3')
        ]
      },
      {
        type: 'Airport Limousine Bus',
        description: t('transportation.limousineBusDesc'),
        price: '1,200円',
        duration: '約45分',
        tips: [
          t('transportation.limousineBusTip1'),
          t('transportation.limousineBusTip2'),
          t('transportation.limousineBusTip3')
        ]
      }
    ]
  };

  const trainEtiquette = [
    t('transportation.etiquette1'),
    t('transportation.etiquette2'),
    t('transportation.etiquette3'),
    t('transportation.etiquette4'),
    t('transportation.etiquette5')
  ];

  const taxiTips = [
    t('transportation.taxiTip1'),
    t('transportation.taxiTip2'),
    t('transportation.taxiTip3'),
    t('transportation.taxiTip4')
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('transportation.title')}</h2>

      {/* Airport Transportation */}
      {fromAirport && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            {t('transportation.fromAirport', { airport: t(`transportation.${fromAirport}`) })}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {airportOptions[fromAirport].map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.type
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedOption(option.type)}
              >
                <h4 className="font-bold text-lg mb-2">{option.type}</h4>
                <p className="text-gray-600 mb-2">{option.description}</p>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{t('transportation.price')}: {option.price}</span>
                  <span className="font-semibold">{t('transportation.duration')}: {option.duration}</span>
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {option.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Train Etiquette */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('transportation.trainEtiquette')}</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-5 space-y-2">
            {trainEtiquette.map((etiquette, index) => (
              <li key={index} className="text-gray-600">{etiquette}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Taxi Tips */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('transportation.taxiTips')}</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-5 space-y-2">
            {taxiTips.map((tip, index) => (
              <li key={index} className="text-gray-600">{tip}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Route Map */}
      {fromAirport && toDestination && (
        <section>
          <h3 className="text-xl font-semibold mb-4">{t('transportation.routeMap')}</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <Map
              center={{ lat: 35.6762, lng: 139.6503 }}
              zoom={11}
              markers={[
                {
                  position: { lat: 35.6762, lng: 139.6503 },
                  title: t('transportation.tokyo')
                }
              ]}
            />
          </div>
        </section>
      )}
    </div>
  );
};