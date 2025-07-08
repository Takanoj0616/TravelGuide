import React from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from './Map';

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

interface EmergencySupportProps {
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export const EmergencySupport: React.FC<EmergencySupportProps> = ({ currentLocation }) => {
  const { t } = useTranslation();

  const emergencyContacts: EmergencyContact[] = [
    {
      name: t('emergency.police'),
      number: '110',
      description: t('emergency.policeDesc')
    },
    {
      name: t('emergency.ambulance'),
      number: '119',
      description: t('emergency.ambulanceDesc')
    },
    {
      name: t('emergency.fire'),
      number: '119',
      description: t('emergency.fireDesc')
    }
  ];

  const embassies = [
    {
      name: 'United States Embassy',
      address: '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420',
      phone: '+81-3-3224-5000'
    },
    {
      name: 'British Embassy',
      address: '1 Ichiban-cho, Chiyoda-ku, Tokyo 102-8381',
      phone: '+81-3-5211-1100'
    },
    // Add more embassies as needed
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('emergency.title')}</h2>
      
      {/* Emergency Contacts */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('emergency.contacts')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-bold text-red-700">{contact.name}</h4>
              <p className="text-2xl font-bold text-red-600">{contact.number}</p>
              <p className="text-gray-600">{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Embassies */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('emergency.embassies')}</h3>
        <div className="space-y-4">
          {embassies.map((embassy, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold">{embassy.name}</h4>
              <p className="text-gray-600">{embassy.address}</p>
              <p className="text-gray-600">{embassy.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Map */}
      {currentLocation && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{t('emergency.nearbyFacilities')}</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <Map
              center={currentLocation}
              zoom={14}
              markers={[
                {
                  position: currentLocation,
                  title: t('emergency.yourLocation')
                }
              ]}
            />
          </div>
        </section>
      )}

      {/* Emergency Guide */}
      <section>
        <h3 className="text-xl font-semibold mb-4">{t('emergency.guide')}</h3>
        <div className="prose max-w-none">
          <p>{t('emergency.guideDesc')}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('emergency.guide1')}</li>
            <li>{t('emergency.guide2')}</li>
            <li>{t('emergency.guide3')}</li>
            <li>{t('emergency.guide4')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
}; 