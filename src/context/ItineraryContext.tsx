import React, { createContext, useState, useContext, ReactNode } from 'react';

// スポットの型定義
export interface ItinerarySpot {
  id: string;
  name: string;
  address?: string;
}

// Contextが提供する値の型定義
interface ItineraryContextType {
  itinerary: ItinerarySpot[];
  addSpotToItinerary: (spot: ItinerarySpot) => void;
}

// Contextの作成
const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// Context Providerコンポーネント
export const ItineraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itinerary, setItinerary] = useState<ItinerarySpot[]>([]);

  const addSpotToItinerary = (spot: ItinerarySpot) => {
    // すでに追加されているスポットは追加しない
    if (!itinerary.find(s => s.id === spot.id)) {
      setItinerary(prevItinerary => [...prevItinerary, spot]);
      alert(`「${spot.name}」を旅のしおりに追加しました！`);
    } else {
      alert(`「${spot.name}」はすでに旅のしおりに追加されています。`);
    }
  };

  const value = {
    itinerary,
    addSpotToItinerary,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};

// Contextを使用するためのカスタムフック
export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}; 