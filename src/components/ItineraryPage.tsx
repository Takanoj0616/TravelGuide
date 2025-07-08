import React, { useState } from 'react';
import { useItinerary } from '../context/ItineraryContext';
import { MapPin, Trash2, Route, Lightbulb, ChefHat, Ship, Building2 } from 'lucide-react';

// AIのレスポンスの型定義
interface Recommendation {
  name: string;
  category: string;
  description: string;
}
interface RouteStep {
  spot_name: string;
  order_reason: string;
}
interface Transportation {
  from: string;
  to: string;
  method: string;
  duration_minutes: number;
}
interface AiRouteResponse {
  title: string;
  optimal_route: RouteStep[];
  transportation_details: Transportation[];
  recommendations: Recommendation[];
}

const ItineraryPage: React.FC = () => {
  const { itinerary } = useItinerary();
  const [aiRoute, setAiRoute] = useState<AiRouteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoute = async () => {
    if (itinerary.length < 2) {
      alert('ルートを生成するには、少なくとも2つのスポットを旅のしおりに追加してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiRoute(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itinerary }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate route');
      }

      const data: AiRouteResponse = await response.json();
      setAiRoute(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Implement spot removal
  const handleRemoveSpot = (spotId: string) => {
    console.log('Removing spot:', spotId);
    alert('スポットの削除機能は現在開発中です。');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 md:p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">旅のしおり</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">追加されたスポット</h2>
        {itinerary.length === 0 ? (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">まだスポットが追加されていません。</p>
            <p className="text-sm text-gray-500 mt-2">観光スポットページから「旅のしおりへ追加」ボタンでスポットを追加できます。</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {itinerary.map((spot, index) => (
              <li key={spot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-lg">{index + 1}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{spot.name}</h3>
                    {spot.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {spot.address}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveSpot(spot.id)}
                  className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${spot.name}`}
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-8">
        <button 
          onClick={handleGenerateRoute}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition font-bold text-lg"
          disabled={itinerary.length < 2}
        >
          AIで最適ルートを作成
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">AIが最適なルートを生成中です...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      )}

      {/* AI Generated Route Display */}
      {aiRoute && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{aiRoute.title}</h2>

          {/* Optimal Route */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Route className="text-blue-500" /> 最適ルート</h3>
            <div className="relative pl-6">
              {aiRoute.optimal_route.map((step, index) => (
                <div key={index} className="relative pb-8">
                  <div className="absolute left-[-11px] top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">{index + 1}</div>
                  {index < aiRoute.optimal_route.length - 1 && <div className="absolute left-0 top-8 w-0.5 h-full bg-blue-200"></div>}
                  <div className="ml-6">
                    <h4 className="font-bold text-lg">{step.spot_name}</h4>
                    <p className="text-sm text-gray-600">{step.order_reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transportation Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Ship className="text-green-500" /> 移動手段詳細</h3>
            <ul className="space-y-3">
              {aiRoute.transportation_details.map((detail, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{detail.from} → {detail.to}</p>
                  <p className="text-sm text-gray-600">{detail.method}（約{detail.duration_minutes}分）</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Lightbulb className="text-yellow-500" /> おすすめスポット</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {aiRoute.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-bold flex items-center gap-2">
                    {rec.category.includes('レストラン') || rec.category.includes('ランチ') ? <ChefHat size={18} /> : <Building2 size={18} />}
                    {rec.name}
                  </h4>
                  <p className="text-sm font-semibold text-yellow-800 my-1">{rec.category}</p>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryPage; 