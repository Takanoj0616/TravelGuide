import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

interface SavedItem {
  id: string;
  title: string;
  type: 'pdf' | 'webpage';
  date: Date;
}

export const OfflineStorage: React.FC = () => {
  const { t } = useTranslation();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const saveAsPDF = async (content: HTMLElement, title: string) => {
    const opt = {
      margin: 1,
      filename: `${title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(content).save();
      
      const newItem: SavedItem = {
        id: Date.now().toString(),
        title,
        type: 'pdf',
        date: new Date()
      };
      
      setSavedItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('PDF保存エラー:', error);
    }
  };

  const saveWebpage = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const blob = new Blob([html], { type: 'text/html' });
      saveAs(blob, `${title}.html`);
      
      const newItem: SavedItem = {
        id: Date.now().toString(),
        title,
        type: 'webpage',
        date: new Date()
      };
      
      setSavedItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Webページ保存エラー:', error);
    }
  };

  const deleteSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-gray-150 py-15">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">{t('offline.title')}</h2>

      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => saveAsPDF(document.body, 'current-page')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('offline.saveAsPDF')}
          </button>
          <button
            onClick={() => saveWebpage(window.location.href, 'current-page')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {t('offline.saveWebpage')}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{t('offline.savedItems')}</h3>
          {savedItems.length === 0 ? (
            <p className="text-gray-500">{t('offline.noItems')}</p>
          ) : (
            <div className="space-y-4">
              {savedItems.map(item => (
                <div
                  key={item.id}
                    className="flex justify-between items-center border rounded-lg p-4 bg-gray-100"
                >
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-500">
                      {item.type.toUpperCase()} - {item.date.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSavedItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('offline.delete')}
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}; 