import React from 'react';
import { useTranslation } from 'react-i18next';

interface CultureTip {
  title: string;
  description: string;
  imageUrl?: string;
}

export const CultureGuide: React.FC = () => {
  const { t } = useTranslation();

  const generalEtiquette: CultureTip[] = [
    {
      title: t('culture.bowing'),
      description: t('culture.bowingDesc')
    },
    {
      title: t('culture.shoes'),
      description: t('culture.shoesDesc')
    },
    {
      title: t('culture.greeting'),
      description: t('culture.greetingDesc')
    }
  ];

  const diningEtiquette: CultureTip[] = [
    {
      title: t('culture.chopsticks'),
      description: t('culture.chopsticksDesc')
    },
    {
      title: t('culture.slurping'),
      description: t('culture.slurpingDesc')
    },
    {
      title: t('culture.tipping'),
      description: t('culture.tippingDesc')
    }
  ];

  const templeEtiquette: CultureTip[] = [
    {
      title: t('culture.purification'),
      description: t('culture.purificationDesc')
    },
    {
      title: t('culture.praying'),
      description: t('culture.prayingDesc')
    },
    {
      title: t('culture.photography'),
      description: t('culture.photographyDesc')
    }
  ];

  const onsenEtiquette: CultureTip[] = [
    {
      title: t('culture.cleaning'),
      description: t('culture.cleaningDesc')
    },
    {
      title: t('culture.tattoos'),
      description: t('culture.tattoosDesc')
    },
    {
      title: t('culture.towels'),
      description: t('culture.towelsDesc')
    }
  ];

  const garbageSorting: CultureTip[] = [
    {
      title: t('culture.burnable'),
      description: t('culture.burnableDesc')
    },
    {
      title: t('culture.recyclable'),
      description: t('culture.recyclableDesc')
    },
    {
      title: t('culture.nonBurnable'),
      description: t('culture.nonBurnableDesc')
    }
  ];

  const renderTips = (tips: CultureTip[], title: string) => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
            <p className="text-gray-600">{tip.description}</p>
            {tip.imageUrl && (
              <img
                src={tip.imageUrl}
                alt={tip.title}
                className="mt-4 rounded-lg w-full h-48 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('culture.title')}</h2>

      {renderTips(generalEtiquette, t('culture.generalEtiquette'))}
      {renderTips(diningEtiquette, t('culture.diningEtiquette'))}
      {renderTips(templeEtiquette, t('culture.templeEtiquette'))}
      {renderTips(onsenEtiquette, t('culture.onsenEtiquette'))}
      {renderTips(garbageSorting, t('culture.garbageSorting'))}

      {/* Additional Tips */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{t('culture.additionalTips')}</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600">{t('culture.additionalTipsDesc')}</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>{t('culture.tip1')}</li>
            <li>{t('culture.tip2')}</li>
            <li>{t('culture.tip3')}</li>
            <li>{t('culture.tip4')}</li>
          </ul>
        </div>
      </section>
    </div>
  );
};