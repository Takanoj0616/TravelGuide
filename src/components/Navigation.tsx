import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Torus as Torii, Crown, Home, Map, Bookmark, Lightbulb, ClipboardList, MessageSquarePlus, BookOpen, TrendingUp, Heart } from 'lucide-react';
import { User } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface NavigationProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
  user: User | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  isPremium,
  onUpgradeToPremium,
  onLanguageChange,
  currentLanguage,
  user,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  // ドロップダウン用
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // ボタンの下にドロップダウンを絶対配置
  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showDropdown]);

  // 外クリックで閉じる
  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="px-2 sm:px-6">
        <div className="flex items-center h-20">
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <Torii className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Japan Guide</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-6 overflow-x-auto px-2" style={{ overflowY: 'visible' }}>
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              {t('common.home')}
            </Link>
            <Link
              to="/area-selection"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/area-selection') || 
                location.pathname.startsWith('/category-selection') || 
                location.pathname.startsWith('/content')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Map className="w-5 h-5" />
              {t('common.areas')}
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/favorites')
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Heart className="w-5 h-5" />
              お気に入り
            </Link>
            <Link
              to="/real-time-info"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/real-time-info')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              リアルタイム情報
            </Link>
            <Link
              to="/ai-recommendation"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/ai-recommendation')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              {t('ai.spot.title')}
            </Link>
            <Link
              to="/model-courses"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/model-courses')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              モデルコース
            </Link>
            <Link
              to="/questions"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/questions')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MessageSquarePlus className="w-5 h-5" />
              Q&A掲示板
            </Link>
            <Link
              to="/travel-stories"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/travel-stories')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              旅行記・体験談
            </Link>
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                onClick={() => setShowDropdown((v) => !v)}
              >
                旅の相談
                <span className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {showDropdown &&
                createPortal(
                  <div
                    style={dropdownStyle}
                    className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                  >
                    <Link to="/custom-plan/new" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>新規相談</Link>
                    <Link to="/custom-plan/sessions" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>相談履歴を見る</Link>
                  </div>,
                  document.body
                )}
            </div>
            <Link
              to="/itinerary"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/itinerary')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              旅のしおり
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ko">한국어</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            {user ? (
              isPremium ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <Crown className="w-4 h-4" />
                  Premium
                </div>
              ) : (
                <button
                  onClick={onUpgradeToPremium}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade
                </button>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {t('auth.signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};