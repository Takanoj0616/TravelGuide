import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Video, PlusSquare, Star, MapPin, Route } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../api/reviews';
import StarRating from './StarRating';
import { useItinerary } from '../context/ItineraryContext';

interface SpotDetailProps {
  reviews: Review[];
}

interface Spot {
  id: string;
  name: string;
  description: string;
  images: string[];
  videoEmbed?: string;
  address?: string;
  mapUrl?: string;
  nearestStation?: string;
}

const SpotDetail: React.FC<SpotDetailProps> = ({ reviews }) => {
  const { spotId } = useParams<{ spotId: string }>();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addSpotToItinerary } = useItinerary();

  useEffect(() => {
    const fetchSpot = async () => {
      if (!spotId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const ref = doc(db, 'spots', spotId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          
          const imageKeys = Object.keys(data)
            .filter(key => key.startsWith('imageUrl'))
            .sort((a, b) => {
                const numA = parseInt(a.replace('imageUrl', '') || '1', 10);
                const numB = parseInt(b.replace('imageUrl', '') || '1', 10);
                return numA - numB;
            });
          const images = imageKeys.map(key => data[key]);

          setSpot({
            id: snap.id,
            name: data.name || 'No Name Provided',
            description: data.description || '',
            images: images,
            videoEmbed: data.videoEmbed,
            address: data.address,
            mapUrl: data.mapUrl,
            nearestStation: data.nearestStation,
          });
        } else {
          console.log("No such document!");
          setSpot(null);
        }
      } catch (error) {
        console.error("Error fetching spot:", error);
        setSpot(null);
      }
      setLoading(false);
    };

    fetchSpot();
  }, [spotId]);

  useEffect(() => {
    if (spot && spot.images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % spot.images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [spot, currentImageIndex]);

  const spotReviews = reviews.filter(review => review.spotId === spotId);

  const nextImage = () => {
    if (spot && spot.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % spot.images.length);
    }
  };

  const prevImage = () => {
    if (spot && spot.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + spot.images.length) % spot.images.length);
    }
  };
  
  const handleAddToItinerary = () => {
    if(spot) {
      addSpotToItinerary({
        id: spot.id,
        name: spot.name,
        address: spot.address,
      });
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!spot) return <div className="text-center py-10">スポット情報が見つかりません</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 md:p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{spot.name}</h1>
      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{spot.description}</p>
      
      {/* Image Slider */}
      {spot.images && spot.images.length > 0 && (
        <div className="relative mb-6">
          <img src={spot.images[currentImageIndex]} alt={`${spot.name} ${currentImageIndex + 1}`} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" />
          {spot.images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        {spot.address && <p className="text-sm text-gray-500">住所: {spot.address}</p>}
        {spot.mapUrl && (
          <a href={spot.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
            Google Mapで見る
          </a>
        )}
        <button onClick={handleAddToItinerary} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold">
          <PlusSquare size={18} />
          旅のしおりへ追加
        </button>
      </div>

      {/* Directions Section */}
      {spot.nearestStation && spot.address && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={22} />
            アクセス
          </h2>
          <p className="mb-3">
            最寄り駅: <span className="font-semibold">{spot.nearestStation}</span>
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(spot.nearestStation)}&destination=${encodeURIComponent(spot.address)}&travelmode=walking`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            <Route size={18} />
            {spot.nearestStation}からの徒歩ルートをGoogle Mapで見る
          </a>
        </div>
      )}

      {/* Video Section */}
      {spot.videoEmbed && (() => {
        const srcMatch = spot.videoEmbed.match(/src="([^"]*)"/);
        const src = srcMatch ? srcMatch[1] : '';
        const titleMatch = spot.videoEmbed.match(/title="([^"]*)"/);
        const title = titleMatch ? titleMatch[1] : '';

        if (!src) {
          return null;
        }

        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Video /> 説明動画</h2>
            <div className="w-full">
              <iframe 
                src={src}
                title={title}
                className="w-full h-[260px] sm:h-[360px] md:h-[420px] rounded-lg shadow-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        );
      })()}

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Star /> 築地に関するレビュー</h2>
        <div className="space-y-4">
          {spotReviews.length > 0 ? (
            spotReviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <img src={review.userAvatar || '/avatar-placeholder.png'} alt={review.userName} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{review.userName}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
                {/* Review images can be displayed here if available */}
              </div>
            ))
          ) : (
            <p className="text-gray-500">このスポットにはまだレビューがありません。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotDetail; 