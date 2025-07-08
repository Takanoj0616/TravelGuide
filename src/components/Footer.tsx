import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Japan Guide</h3>
            <p className="text-gray-400 text-sm">
              {t('common.getStarted')} your unforgettable journey through Japan.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('common.home')}</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('common.areas')}</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('common.map')}</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">{t('common.calendar')}</a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} Japan Guide. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1 mt-2">
            Made with <Heart className="w-3 h-3 text-red-400" /> in Japan.
          </p>
        </div>
      </div>
    </footer>
  );
}; 