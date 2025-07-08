import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Recommendation {
  title: string;
  description: string;
  location: string;
  address?: string;
  access?: string;
  officialSite?: string;
  businessHours?: string;
  features?: string[];
  crowdLevel?: string;
  reviewExample?: string;
  duration: string;
  cost: string;
}

export const AIRecommendation: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preferences, setPreferences] = useState({
    interests: '',
    budget: '',
    duration: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await fetch('/api/get-ai-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error(t('ai.error'));
      }

      const result = await response.json();
      setRecommendations(result.recommendations);
    } catch (err) {
      setError((err as Error).message);
      console.error('AIレコメンドエラー:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{t('ai.spot.title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ai.spot.interests')}
          </label>
          <select
            value={preferences.interests}
            onChange={(e) => setPreferences(prev => ({ ...prev, interests: e.target.value }))}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="" disabled>{t('ai.spot.interestsPlaceholder')}</option>
            <option value="アニメ・漫画">アニメ・漫画</option>
            <option value="歴史・文化">歴史・文化</option>
            <option value="自然・風景">自然・風景</option>
            <option value="グルメ">グルメ</option>
            <option value="ショッピング">ショッピング</option>
            <option value="温泉">温泉</option>
            <option value="アート・美術館">アート・美術館</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ai.spot.budget')}
          </label>
          <select
            value={preferences.budget}
            onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="" disabled>{t('ai.spot.budgetPlaceholder')}</option>
            <option value="〜5,000円">〜5,000円</option>
            <option value="5,000円〜10,000円">5,000円〜10,000円</option>
            <option value="10,000円〜20,000円">10,000円〜20,000円</option>
            <option value="20,000円〜">20,000円〜</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ai.spot.duration')}
          </label>
          <select
            value={preferences.duration}
            onChange={(e) => setPreferences(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="" disabled>{t('ai.spot.durationPlaceholder')}</option>
            <option value="半日">半日</option>
            <option value="1日">1日</option>
            <option value="2日間">2日間</option>
            <option value="3日間">3日間</option>
            <option value="4日以上">4日以上</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ai.spot.location')}
          </label>
          <select
            value={preferences.location}
            onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="" disabled>{t('ai.spot.locationPlaceholder')}</option>
            <optgroup label="東京">
              <option value="新宿">新宿</option>
              <option value="渋谷">渋谷</option>
              <option value="東京駅">東京駅</option>
              <option value="池袋">池袋</option>
              <option value="上野">上野</option>
              <option value="秋葉原">秋葉原</option>
              <option value="銀座">銀座</option>
              <option value="浅草">浅草</option>
            </optgroup>
            <optgroup label="横浜">
              <option value="横浜駅">横浜駅</option>
              <option value="桜木町">桜木町</option>
              <option value="みなとみらい">みなとみらい</option>
              <option value="新横浜">新横浜</option>
            </optgroup>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? t('ai.loading') : t('ai.spot.getRecommendations')}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
              <p className="text-gray-600 mb-2">{rec.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 mb-2">
                <div>
                  <span className="font-medium">{t('ai.spot.location')}:</span> {rec.location}
                </div>
                <div>
                  <span className="font-medium">{t('ai.spot.duration')}:</span> {rec.duration}
                </div>
                <div>
                  <span className="font-medium">{t('ai.spot.cost')}:</span> {rec.cost}
                </div>
              </div>
              {rec.address && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">住所:</span> {rec.address}</div>
              )}
              {rec.access && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">アクセス:</span> {rec.access}</div>
              )}
              {rec.officialSite && rec.officialSite !== 'なし' && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">公式サイト:</span> <a href={rec.officialSite} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{rec.officialSite}</a></div>
              )}
              {rec.businessHours && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">営業時間:</span> {rec.businessHours}</div>
              )}
              {rec.features && rec.features.length > 0 && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">特徴:</span>
                  <ul className="list-disc list-inside ml-4">
                    {rec.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
              {rec.crowdLevel && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">混雑度:</span> {rec.crowdLevel}</div>
              )}
              {rec.reviewExample && (
                <div className="text-sm text-gray-700 mb-1"><span className="font-medium">口コミ例:</span> <span className="italic">{rec.reviewExample}</span></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 