import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import { HomePage } from './components/HomePage';
import { AreaSelection } from './components/AreaSelection';
import { CategorySelection } from './components/CategorySelection';
import { ContentPage } from './components/ContentPage';
import { PremiumModal } from './components/PremiumModal';
import { Navigation } from './components/Navigation';
import { Map } from './components/Map';
import { Calendar } from './components/Calendar';
import { AirportNavigation } from './components/AirportNavigation';
import { ICCardGuide } from './components/ICCardGuide';
import { CustomerSupport } from './components/CustomerSupport';
import { OfflineStorage } from './components/OfflineStorage';
import { Auth } from './components/Auth';
import { Payment } from './components/Payment';
import { AIRecommendation } from './components/AIRecommendation';
import { EmergencySupport } from './components/EmergencySupport';
import { TransportationGuide } from './components/TransportationGuide';
import { CultureGuide } from './components/CultureGuide';
import { Footer } from './components/Footer';
import { auth } from './config/firebase';
import { User } from 'firebase/auth';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import { createReview, getReviews, Review } from './api/reviews';
import SignUp from './components/SignUp';
import Login from './components/Login';
import SpotDetail from './components/SpotDetail';
import ItineraryPage from './components/ItineraryPage';
import { ItineraryProvider } from './context/ItineraryContext';
import HotelDetail from './components/HotelDetail';
import { ModelCourseListPage } from './components/ModelCourseListPage';
import { ModelCourseDetailPage } from './components/ModelCourseDetailPage';
import { CustomPlanRequestPage } from './components/CustomPlanRequestPage';
import { PlanningSessionListPage } from './components/PlanningSessionListPage';
import { PlanningChatPage } from './components/PlanningChatPage';
import QuestionListPage from './components/QuestionListPage';
import QuestionFormPage from './components/QuestionFormPage';
import QuestionDetailPage from './components/QuestionDetailPage';
import { registerSampleQuestions } from './data/registerQuestions';
import TravelStoryListPage from './components/TravelStoryListPage';
import TravelStoryFormPage from './components/TravelStoryFormPage';
import TravelStoryDetailPage from './components/TravelStoryDetailPage';
import { registerSampleTravelStories } from './data/registerTravelStories';
import RealTimeInfoPage from './components/RealTimeInfoPage';
import RealTimeInfoDetailPage from './components/RealTimeInfoDetailPage';
import FavoritesPage from './components/FavoritesPage';
import CustomPlanNewPage from './components/CustomPlanNewPage';

export type Area = 'tokyo' | 'yokohama' | 'saitama' | 'chiba';
export type Category = 'meals' | 'hotels' | 'transportation' | 'leisure' | 'tourist-spots';

export interface UserSelection {
  area: Area | null;
  category: Category | null;
}

const AppContent = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsPremium(!!currentUser);
    });

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Register sample data
    registerSampleQuestions();
    registerSampleTravelStories();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviews();
      setReviews(data);
    };
    fetchReviews();
  }, []);

  const handleUpgradeToPremium = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumPurchase = () => {
    setIsPremium(true);
    setShowPremiumModal(false);
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  const showNavigationAndFooter = !(location.pathname === '/auth' || location.pathname === '/payment');

  const handleReviewSubmit = async (review: {
    rating: number;
    content: string;
    images: File[];
    userId: string;
    userName: string;
    userAvatar?: string;
    spotId: string;
    spotName: string;
  }) => {
    try {
      await createReview({
        rating: review.rating,
        content: review.content,
        images: review.images,
        spotId: review.spotId,
        spotName: review.spotName,
      });
      alert('口コミが投稿されました！');
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      alert('口コミの投稿に失敗しました');
      console.error(error);
    }
  };

  const handleShare = (review: Review, platform: 'twitter' | 'facebook' | 'instagram') => {
    console.log(`Sharing to ${platform}:`, review);
    // TODO: SNS連携の実装
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showNavigationAndFooter && (
        <Navigation
          isPremium={isPremium}
          onUpgradeToPremium={handleUpgradeToPremium}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          user={user}
        />
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/area-selection" element={<AreaSelection />} />
          <Route path="/category-selection/:area" element={<CategorySelection isPremium={isPremium} onUpgradeToPremium={handleUpgradeToPremium} />} />
          <Route path="/content/:area/:category" element={<ContentPage isPremium={isPremium} onUpgradeToPremium={handleUpgradeToPremium} />} />
          <Route path="/content/:area/:category/:spotId" element={<SpotDetail reviews={reviews} />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/hotel/:hotelId" element={<HotelDetail />} />
          <Route path="/map" element={<Map center={{ lat: 35.6762, lng: 139.6503 }} markers={[]} />} />
          <Route path="/calendar" element={<Calendar events={[]} onEventClick={() => {}} onDateSelect={() => {}} />} />
          <Route path="/airport-navigation" element={<AirportNavigation />} />
          <Route path="/ic-card-guide" element={<ICCardGuide />} />
          <Route path="/auth" element={<Auth onAuthStateChange={setUser} />} />
          <Route path="/payment" element={<Payment onPaymentSuccess={handlePremiumPurchase} />} />
          <Route path="/ai-recommendation" element={<AIRecommendation />} />
          <Route path="/emergency-support" element={<EmergencySupport currentLocation={currentLocation || undefined} />} />
          <Route path="/transportation-guide" element={<TransportationGuide />} />
          <Route path="/culture-guide" element={<CultureGuide />} />
          <Route path="/real-time-info" element={<RealTimeInfoPage />} />
          <Route path="/real-time-info/detail" element={<RealTimeInfoDetailPage />} />
          {/* 口コミ機能のルート */}
          <Route path="/reviews" element={<ReviewList reviews={reviews} onShare={handleShare} />} />
          <Route path="/reviews/new" element={
            <ReviewForm
              onSubmit={handleReviewSubmit}
              userId={user?.uid || 'guest'}
              userName={user?.displayName || 'ゲスト'}
              userAvatar={user?.photoURL || undefined}
              spotId={"spot1"} // TODO: 実際のスポットIDに差し替え
              spotName={"東京タワー"} // TODO: 実際のスポット名に差し替え
            />
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/model-courses" element={<ModelCourseListPage />} />
          <Route path="/model-courses/:courseId" element={<ModelCourseDetailPage />} />
          <Route path="/custom-plan/new" element={<CustomPlanNewPage />} />
          <Route path="/custom-plan/sessions" element={<PlanningSessionListPage />} />
          <Route path="/custom-plan/chat/:sessionId" element={<PlanningChatPage />} />
          <Route path="/questions" element={<QuestionListPage />} />
          <Route path="/questions/new" element={<QuestionFormPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/travel-stories" element={<TravelStoryListPage />} />
          <Route path="/travel-stories/new" element={<TravelStoryFormPage />} />
          <Route path="/travel-stories/:id" element={<TravelStoryDetailPage />} />
        </Routes>
      </main>
      {showNavigationAndFooter && <CustomerSupport />}
      {showNavigationAndFooter && <OfflineStorage />}
      {showNavigationAndFooter && <Footer />}

      {showPremiumModal && (
        <PremiumModal 
          onClose={() => setShowPremiumModal(false)}
          onPurchase={handlePremiumPurchase}
        />
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <ItineraryProvider>
      <AppContent />
    </ItineraryProvider>
  </Router>
);

export default App;