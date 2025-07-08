import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, TrendingUp } from 'lucide-react';
import CrowdStatus from './CrowdStatus';

const RealTimeInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tokyo Tower');

  const popularLocations = [
    { name: 'Tokyo Tower', description: '東京タワー' },
    { name: 'Shibuya Crossing', description: '渋谷スクランブル交差点' },
    { name: 'Senso-ji Temple', description: '浅草寺' },
    { name: 'Tokyo Skytree', description: '東京スカイツリー' },
    { name: 'Tsukiji Market', description: '築地市場' },
    { name: 'Harajuku', description: '原宿' },
    { name: 'Ginza', description: '銀座' },
    { name: 'Roppongi Hills', description: '六本木ヒルズ' }
  ];

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setSelectedLocation(searchLocation);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                戻る
              </button>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                リアルタイム情報
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-600" />
            場所を検索
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="場所名を入力してください（例：東京タワー）"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              検索
            </button>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            人気の場所
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleLocationSelect(location.name)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedLocation === location.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-medium text-gray-900 text-sm">{location.description}</h3>
                <p className="text-xs text-gray-500 mt-1">{location.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Crowd Status Display */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            現在の混雑状況: {selectedLocation}
          </h2>
          <CrowdStatus 
            location={selectedLocation}
            autoRefresh={true}
          />
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📊 リアルタイム情報について
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">データソース</h4>
              <ul className="space-y-1">
                <li>• Google Places API - レビューと評価</li>
                <li>• Twitter API - リアルタイム投稿</li>
                <li>• ユーザー投稿 - 実際の訪問者からの情報</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">更新頻度</h4>
              <ul className="space-y-1">
                <li>• 自動更新: 5分ごと</li>
                <li>• 手動更新: いつでも可能</li>
                <li>• 信頼度: AIによる分析結果</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeInfoPage; 