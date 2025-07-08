import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NearbyLocation {
  location: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
}

interface GooglePlacesDetails {
  rating?: number;
  totalRatings?: number;
  currentStatus?: boolean;
}

// TwitterTweet型を定義（必要ならimport）
interface TwitterUser {
  id: string;
  username?: string;
  name?: string;
  profile_image_url?: string;
}
interface TwitterTweet {
  id?: string;
  author_id?: string;
  created_at?: string;
  text: string;
  user?: TwitterUser | null;
}

interface CrowdData {
  location: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  sources: string[];
  lastUpdated: string;
  details: {
    googlePlaces?: GooglePlacesDetails;
    twitter?: {
      tweets?: TwitterTweet[];
    };
    instagram?: unknown;
    reviews?: unknown;
  };
  nearbyLocations?: NearbyLocation[];
}

interface CrowdStatusProps {
  location?: string;
  lat?: number;
  lng?: number;
  autoRefresh?: boolean;
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

const CrowdStatus: React.FC<CrowdStatusProps> = ({ 
  location = 'Tokyo Tower', 
  lat, 
  lng, 
  autoRefresh: _autoRefresh = false 
}) => {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const navigate = useNavigate();

  console.log('CrowdStatus props', { location, lat, lng });
  console.log('CrowdStatus state', { crowdData, loading, error, lastRefresh });

  const fetchCrowdData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/crowd-analysis';
      const params = new URLSearchParams();
      
      if (location) {
        params.append('location', location);
      }
      if (lat && lng) {
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
        params.append('radius', '1000');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('CrowdStatus fetch URL', url);

      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        setCrowdData(result.data);
        setLastRefresh(new Date());
      } else {
        setError(result.error || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
      console.error('Error fetching crowd data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('CrowdStatus useEffect (fetchCrowdData) triggered', { location, lat, lng });
    fetchCrowdData();
  }, [location, lat, lng]);

  useEffect(() => {
    console.log('CrowdStatus useEffect (crowdData changed)', { crowdData });
    if (crowdData) {
      console.log('crowdData.details:', crowdData.details);
      if (crowdData.details) {
        console.log('crowdData.details.twitter:', crowdData.details.twitter);
        if (crowdData.details.twitter) {
          console.log('crowdData.details.twitter.tweets:', crowdData.details.twitter.tweets);
        }
      }
    }
  }, [crowdData]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // カードクリック時に詳細ページへ遷移
  const handleCardClick = () => {
    if (crowdData && crowdData.location) {
      navigate(`/real-time-info/detail?location=${encodeURIComponent(crowdData.location)}`);
    }
  };

  // 周辺スポットの混雑状況表示用
  const handleNearbyClick = (loc: string) => {
    if (loc) {
      navigate(`/real-time-info/detail?location=${encodeURIComponent(loc)}`);
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg transition cursor-pointer hover:shadow-2xl hover:ring-2 hover:ring-blue-200"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label="混雑状況の詳細を見る"
      style={{ outline: 'none' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <MapPin className="mr-2 h-6 w-6 text-blue-600" />
          リアルタイム混雑状況
        </h2>
        <button
          onClick={fetchCrowdData}
          disabled={loading}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          更新
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2">データを取得中...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {crowdData && (
        <div className="space-y-4">
          {/* メインの混雑状況 */}
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

          {/* データソース */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              データソース
            </h4>
            <div className="flex flex-wrap gap-2">
              {crowdData.sources.map((source) => (
                <span key={source} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {source}
                </span>
              ))}
            </div>
          </div>

          {/* 詳細情報 */}
          {crowdData.details.googlePlaces && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Google Places 情報</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">評価:</span>
                  <span className="ml-2 font-semibold">
                    {(crowdData.details.googlePlaces as GooglePlacesDetails).rating} ⭐
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">レビュー数:</span>
                  <span className="ml-2 font-semibold">
                    {(crowdData.details.googlePlaces as GooglePlacesDetails).totalRatings?.toLocaleString() || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">営業状況:</span>
                  <span className={`ml-2 font-semibold ${
                    (crowdData.details.googlePlaces as GooglePlacesDetails).currentStatus ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(crowdData.details.googlePlaces as GooglePlacesDetails).currentStatus ? '営業中' : '閉店'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Twitter投稿セクション */}
          {crowdData.details.twitter && (
            console.log('tweets (render):', crowdData.details.twitter.tweets),
            (crowdData.details.twitter as { tweets?: TwitterTweet[] }).tweets && (crowdData.details.twitter as { tweets?: TwitterTweet[] }).tweets!.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Twitter投稿例</h4>
                <ul className="space-y-3">
                  {(crowdData.details.twitter as { tweets?: TwitterTweet[] }).tweets!.slice(0, 3).map((tweet: TwitterTweet, idx: number) => (
                    <li key={tweet.id || idx} className="border-b pb-2">
                      <div className="flex items-center mb-1">
                        {tweet.user && tweet.user.profile_image_url && (
                          <img src={tweet.user.profile_image_url} alt="icon" className="w-6 h-6 rounded-full mr-2" />
                        )}
                        <span className="font-semibold text-gray-800 mr-2">{tweet.user?.name || 'user'}</span>
                        <span className="text-xs text-gray-500">@{tweet.user?.username || tweet.author_id}</span>
                        <span className="text-xs text-gray-400 ml-2">{tweet.created_at ? new Date(tweet.created_at).toLocaleString('ja-JP') : ''}</span>
                      </div>
                      <div className="text-gray-800 text-sm whitespace-pre-line">{tweet.text}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* 周辺スポットの混雑状況 */}
          {crowdData.nearbyLocations && crowdData.nearbyLocations.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">周辺スポットの混雑状況</h4>
              <ul className="space-y-2">
                {crowdData.nearbyLocations.map((spot: NearbyLocation) => (
                  <li
                    key={spot.location}
                    className="flex items-center justify-between cursor-pointer hover:bg-blue-50 rounded px-2 py-1"
                    onClick={() => handleNearbyClick(spot.location)}
                  >
                    <span className="font-medium text-blue-700">{spot.location}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${levelColor[spot.crowdLevel]}`}>{levelText[spot.crowdLevel]}</span>
                    <span className={`ml-2 text-xs ${getConfidenceColor(spot.confidence)}`}>{Math.round(spot.confidence * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 最終更新時刻 */}
          <div className="text-xs text-gray-500 text-center">
            最終更新: {lastRefresh ? formatTime(lastRefresh.toISOString()) : 'N/A'}
          </div>
        </div>
      )}

      {/* フォールバック用のモックデータ */}
      {!crowdData && !loading && !error && (
        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>位置情報を取得中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrowdStatus; 