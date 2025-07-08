import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, Star, ArrowRight, TrendingUp, Lightbulb, MessageSquarePlus, User, ClipboardList, Bookmark, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- スライドデータ ---
  const slides = [
    {
      title1: t('home.heroTitlePart1'),
      title2: t('home.heroTitlePart2'),
      desc: t('home.heroDescription'),
    },
    {
      title1: '日本の魅力を再発見',
      title2: '新しい旅のカタチ',
      desc: 'AIとリアルタイム情報で、あなたの旅をもっと快適に。',
    },
    {
      title1: '今すぐ旅に出よう',
      title2: 'おすすめスポット満載',
      desc: 'エリア・テーマ別に最適な旅プランを提案します。',
    },
  ];
  const [slideIdx, setSlideIdx] = useState(0);
  const [autoSlide, setAutoSlide] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 3秒後に自動スライド開始
  useEffect(() => {
    const timer = setTimeout(() => setAutoSlide(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 自動スライド
  useEffect(() => {
    if (!autoSlide) return;
    intervalRef.current = setInterval(() => {
      setSlideIdx((idx) => (idx + 1) % slides.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSlide, slides.length]);

  const handleGetStarted = () => {
    navigate('/area-selection');
  };

  const handleRealTimeInfo = () => {
    navigate('/real-time-info');
  };

  return (
    <div className="relative">
      {/* Hero Section (Slideshow) */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 transition-all duration-700">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {slides[slideIdx].title1}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {slides[slideIdx].title2}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {slides[slideIdx].desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('home.startJourney')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleRealTimeInfo}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <TrendingUp className="w-5 h-5" />
                リアルタイム情報
              </button>
            </div>
            {/* --- Slide Indicators --- */}
            <div className="flex justify-center items-center gap-3 mt-6">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 border-2 focus:outline-none ${
                    idx === slideIdx
                      ? 'bg-white border-white shadow-lg scale-125'
                      : 'bg-white/40 border-white/60 hover:bg-white/70'
                  }`}
                  aria-label={`スライド${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Info Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
              リアルタイム混雑情報
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SNSやレビューサイトの情報をリアルタイムで分析し、観光地の混雑状況をお知らせします
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">リアルタイム更新</h3>
                <p className="text-gray-600">5分ごとに最新の混雑情報を更新</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">多様なデータソース</h3>
                <p className="text-gray-600">Google Places、Twitter、ユーザー投稿を統合</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI分析</h3>
                <p className="text-gray-600">信頼度付きで混雑レベルを判定</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={handleRealTimeInfo}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <TrendingUp className="w-5 h-5" />
                リアルタイム情報を見る
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AIおすすめスポット Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="mr-3"><Lightbulb className="w-8 h-8 text-yellow-500" /></span>
              AIおすすめスポット
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AIがあなたにぴったりの観光スポットを提案します
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">パーソナライズ提案</h3>
                <p className="text-gray-600">あなたの好みや旅程に合わせてAIがスポットを厳選</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">レビュー分析</h3>
                <p className="text-gray-600">SNSや口コミをAIが分析し、人気スポットを抽出</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">最新トレンド</h3>
                <p className="text-gray-600">今話題のスポットや旬の情報をリアルタイムで提案</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/ai-recommendation')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Lightbulb className="w-5 h-5" />
                AIおすすめスポットを見る
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 旅の相談 Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="mr-3"><MessageSquarePlus className="w-8 h-8 text-blue-500" /></span>
              旅の相談
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              プロや他の旅行者に旅の悩みやプランを気軽に相談できます
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquarePlus className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">プロに相談</h3>
                <p className="text-gray-600">旅行プランナーがあなたの旅をサポート</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">みんなのQ&A</h3>
                <p className="text-gray-600">他の旅行者の質問・回答も参考にできる</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">相談履歴</h3>
                <p className="text-gray-600">過去の相談内容もいつでも見返せる</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/custom-plan/new')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageSquarePlus className="w-5 h-5" />
                旅の相談をする
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 旅のしおり Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span className="mr-3"><Bookmark className="w-8 h-8 text-pink-500" /></span>
              旅のしおり
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              あなただけの旅程を自由にカスタマイズ！日程や訪問先、思い出も自分専用にまとめて管理できます。
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">旅程管理</h3>
                <p className="text-gray-600">日ごとの予定や訪問先を簡単に記録</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">お気に入り保存</h3>
                <p className="text-gray-600">気になったスポットや体験をワンクリック保存</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">思い出アルバム</h3>
                <p className="text-gray-600">旅の写真やメモをまとめて振り返り</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/itinerary')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Bookmark className="w-5 h-5" />
                旅のしおりを見る
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.whyChooseTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChooseDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.feature1Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.feature1Description')}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.feature2Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.feature2Description')}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.feature3Title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.exploreRegionsTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.exploreRegionsDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: t('home.areaTokyoName'), description: t('home.areaTokyoDescription'), image: 'https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg' },
              { name: t('home.areaYokohamaName'), description: t('home.areaYokohamaDescription'), image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg' },
              { name: t('home.areaSaitamaName'), description: t('home.areaSaitamaDescription'), image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg' },
              { name: t('home.areaChibaName'), description: t('home.areaChibaDescription'), image: 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg' }
            ].map((area) => (
              <div key={area.name} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  <img 
                    src={area.image} 
                    alt={area.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{area.name}</h3>
                    <p className="text-sm opacity-90">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};