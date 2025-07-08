import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CrowdData {
  location: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  sources: string[];
  lastUpdated: string;
  details: {
    googlePlaces?: any;
    twitter?: any;
    instagram?: any;
    reviews?: any;
  };
}

const levelColor = {
  low: 'bg-green-200 text-green-800',
  medium: 'bg-yellow-200 text-yellow-800',
  high: 'bg-orange-200 text-orange-800',
  very_high: 'bg-red-200 text-red-800',
};

const levelText = {
  low: '空いている',
  medium: 'やや混雑',
  high: '混雑',
  very_high: '大混雑',
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const RealTimeInfoDetailPage: React.FC = () => {
  const query = useQuery();
  const locationParam = query.get('location') || '';
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/crowd-analysis?location=${encodeURIComponent(locationParam)}`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.success && result.data) {
          setCrowdData(result.data);
        } else {
          setError(result.error || 'データの取得に失敗しました');
        }
      } catch (err) {
        setError('ネットワークエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    if (locationParam) fetchData();
  }, [locationParam]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> 戻る
      </button>
      <h1 className="text-2xl font-bold mb-4">リアルタイム詳細: {locationParam}</h1>
      {loading && <div>データを取得中...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {crowdData && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{crowdData.location}</h3>
                <p className="text-sm text-gray-600">
                  信頼度: <span className={getConfidenceColor(crowdData.confidence)}>
                    {Math.round(crowdData.confidence * 100)}%
                  </span>
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${levelColor[crowdData.crowdLevel]}`}>
                {levelText[crowdData.crowdLevel]}
              </span>
            </div>
          </div>

          {/* Twitter投稿セクション */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-600 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.635 4.085A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.387 5.976 4.45 4.45 0 0 1-2.03-.561v.057a4.48 4.48 0 0 0 3.593 4.393 4.48 4.48 0 0 1-2.025.077 4.48 4.48 0 0 0 4.184 3.11A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.785-6.84 12.785-12.785 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
              Twitterの最新投稿
            </h4>
            {crowdData.details.twitter && crowdData.details.twitter.tweets && crowdData.details.twitter.tweets.length > 0 ? (
              <ul className="space-y-2">
                {crowdData.details.twitter.tweets.slice(0, 10).map((tweet: any, idx: number) => (
                  <li key={tweet.id || idx} className="border-b last:border-b-0 pb-2 text-sm text-gray-800">
                    <span className="block">{tweet.text}</span>
                    {tweet.author_id && (
                      <span className="text-xs text-gray-500">ユーザーID: {tweet.author_id}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm py-2">最新の投稿はありません</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeInfoDetailPage; 