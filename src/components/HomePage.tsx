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
      <section className="relative bg-gradient-to-br from-sakura-500 via-gold-400 to-indigo-600 text-white py-20 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gold-300/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-300/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-sakura-300/20 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-sakura-500/80 via-gold-400/80 to-indigo-600/80 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 transition-all duration-700 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight font-display">
              <span className="block animate-fade-in-down">{slides[slideIdx].title1}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-gold-400 animate-shimmer animate-fade-in-up">
                {slides[slideIdx].title2}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              {slides[slideIdx].desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-sakura-600 to-sakura-700 hover:from-sakura-700 hover:to-sakura-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-glow hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('home.startJourney')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleRealTimeInfo}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-glow-indigo hover:shadow-xl transform hover:-translate-y-1"
              >
                <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                リアルタイム情報
              </button>
            </div>
            {/* --- Slide Indicators --- */}
            <div className="flex justify-center items-center gap-3 mt-6 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIdx(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 border-2 focus:outline-none hover:scale-110 ${
                    idx === slideIdx
                      ? 'bg-white border-white shadow-glow scale-125 animate-pulse-soft'
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
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-sakura-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 183, 197, 0.1) 0%, transparent 50%)'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center font-display">
              <TrendingUp className="w-8 h-8 mr-3 text-indigo-600 animate-pulse-soft" />
              リアルタイム混雑情報
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              SNSやレビューサイトの情報をリアルタイムで分析し、観光地の混雑状況をお知らせします
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-indigo">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">リアルタイム更新</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">5分ごとに最新の混雑情報を更新</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-forest-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest-600 transition-colors">多様なデータソース</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Google Places、Twitter、ユーザー投稿を統合</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-sakura-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sakura-600 transition-colors">AI分析</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">信頼度付きで混雑レベルを判定</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={handleRealTimeInfo}
                className="group inline-flex items-center gap-3 bg-indigo-gradient hover:shadow-glow-indigo text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                リアルタイム情報を見る
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AIおすすめスポット Section */}
      <section className="py-16 bg-gradient-to-br from-gold-50 via-yellow-50 to-orange-50 relative overflow-hidden">
        {/* AI-themed background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gold-300/30 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-300/30 rounded-full blur-xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center font-display">
              <span className="mr-3"><Lightbulb className="w-8 h-8 text-gold-500 animate-pulse-soft" /></span>
              AIおすすめスポット
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              AIがあなたにぴったりの観光スポットを提案します
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-gold">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gold-600 transition-colors font-display">パーソナライズ提案</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">あなたの好みや旅程に合わせてAIがスポットを厳選</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-indigo">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors font-display">レビュー分析</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">SNSや口コミをAIが分析し、人気スポットを抽出</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-forest-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest-600 transition-colors font-display">最新トレンド</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">今話題のスポットや旬の情報をリアルタイムで提案</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/ai-recommendation')}
                className="group inline-flex items-center gap-3 bg-gold-gradient hover:shadow-glow-gold text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Lightbulb className="w-5 h-5 group-hover:scale-110 transition-transform" />
                AIおすすめスポットを見る
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 旅の相談 Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Chat-themed background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 bg-indigo-300/40 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-300/40 rounded-lg -rotate-12 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-300/40 rounded-lg rotate-45 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center font-display">
              <span className="mr-3"><MessageSquarePlus className="w-8 h-8 text-indigo-500 animate-pulse-soft" /></span>
              旅の相談
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              プロや他の旅行者に旅の悩みやプランを気軽に相談できます
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-indigo">
                  <MessageSquarePlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors font-display">プロに相談</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">旅行プランナーがあなたの旅をサポート</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-forest-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest-600 transition-colors font-display">みんなのQ&A</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">他の旅行者の質問・回答も参考にできる</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-gold">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gold-600 transition-colors font-display">相談履歴</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">過去の相談内容もいつでも見返せる</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/custom-plan/new')}
                className="group inline-flex items-center gap-3 bg-indigo-gradient hover:shadow-glow-indigo text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                旅の相談をする
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 旅のしおり Section */}
      <section className="py-16 bg-gradient-to-br from-sakura-50 via-pink-50 to-rose-50 relative overflow-hidden">
        {/* Bookmark-themed background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-28 h-28 bg-sakura-300/40 rounded-lg rotate-6 animate-float"></div>
          <div className="absolute top-32 right-16 w-24 h-24 bg-pink-300/40 rounded-lg -rotate-6 animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-16 left-1/3 w-32 h-32 bg-rose-300/40 rounded-lg rotate-12 animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center font-display">
              <span className="mr-3"><Bookmark className="w-8 h-8 text-sakura-500 animate-pulse-soft" /></span>
              旅のしおり
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              あなただけの旅程を自由にカスタマイズ！日程や訪問先、思い出も自分専用にまとめて管理できます。
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-sakura-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Bookmark className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sakura-600 transition-colors font-display">旅程管理</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">日ごとの予定や訪問先を簡単に記録</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-indigo-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow-indigo">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors font-display">お気に入り保存</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">気になったスポットや体験をワンクリック保存</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-forest-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest-600 transition-colors font-display">思い出アルバム</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">旅の写真やメモをまとめて振り返り</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/itinerary')}
                className="group inline-flex items-center gap-3 bg-sakura-gradient hover:shadow-glow text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                旅のしおりを見る
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-sakura-50/30 to-gold-50/30 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-sakura-200/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gold-200/20 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              {t('home.whyChooseTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              {t('home.whyChooseDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-indigo-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow-indigo group-hover:scale-110 transition-all duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors font-display">{t('home.feature1Title')}</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {t('home.feature1Description')}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-sakura-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-sakura-600 transition-colors font-display">{t('home.feature2Title')}</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {t('home.feature2Description')}
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow-gold group-hover:scale-110 transition-all duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gold-600 transition-colors font-display">{t('home.feature3Title')}</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {t('home.feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-sakura-50/30 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full animate-gradient-xy" style={{background: 'linear-gradient(45deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 215, 0, 0.1) 25%, rgba(99, 102, 241, 0.1) 50%, rgba(34, 197, 94, 0.1) 75%, rgba(255, 183, 197, 0.1) 100%)', backgroundSize: '400% 400%'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              {t('home.exploreRegionsTitle')}
            </h2>
            <p className="text-xl text-gray-600 font-light">
              {t('home.exploreRegionsDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: t('home.areaTokyoName'), description: t('home.areaTokyoDescription'), image: 'https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg' },
              { name: t('home.areaYokohamaName'), description: t('home.areaYokohamaDescription'), image: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg' },
              { name: t('home.areaSaitamaName'), description: t('home.areaSaitamaDescription'), image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg' },
              { name: t('home.areaChibaName'), description: t('home.areaChibaDescription'), image: 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg' }
            ].map((area, index) => (
              <div key={area.name} className="group cursor-pointer animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2">
                  <img 
                    src={area.image} 
                    alt={area.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/50 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-sakura-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white transform group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold font-display group-hover:text-sakura-200 transition-colors">{area.name}</h3>
                    <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">{area.description}</p>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-sakura-300/50 rounded-xl transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};