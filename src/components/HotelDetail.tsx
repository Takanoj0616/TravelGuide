import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Star, Link, Building, DollarSign, Wifi, ParkingSquare, UtensilsCrossed } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import StarRating from './StarRating';

// ホテルのデータ構造のインターフェース
interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[];
  address: string;
  mapUrl?: string;
  websiteUrl?: string;
  priceRange?: string; // 例: "15,000円〜30,000円"
  rating?: number;
  amenities?: string[]; // 例: ["Wi-Fi", "駐車場", "レストラン"]
}

const HotelDetail: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // 'hotels'コレクションからデータを取得
        const ref = doc(db, 'hotels', hotelId);
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

          setHotel({
            id: snap.id,
            name: data.name || 'No Name Provided',
            description: data.description || '',
            images: images,
            address: data.address || '',
            mapUrl: data.mapUrl,
            websiteUrl: data.websiteUrl,
            priceRange: data.priceRange,
            rating: data.rating,
            amenities: data.amenities,
          });
        } else {
          console.log("No such document!");
          setHotel(null);
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
        setHotel(null);
      }
      setLoading(false);
    };

    fetchHotel();
  }, [hotelId]);

  const nextImage = () => {
    if (hotel && hotel.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length);
    }
  };

  const prevImage = () => {
    if (hotel && hotel.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length);
    }
  };
  
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={18} />;
    if (amenity.toLowerCase().includes('parking')) return <ParkingSquare size={18} />;
    if (amenity.toLowerCase().includes('restaurant')) return <UtensilsCrossed size={18} />;
    return <Star size={18} />;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!hotel) return <div className="text-center py-10">ホテル情報が見つかりません</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 md:p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
      
      {hotel.rating && (
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={hotel.rating} />
          <span className="text-yellow-500 font-bold">{hotel.rating.toFixed(1)}</span>
        </div>
      )}

      <p className="text-gray-600 mb-6 whitespace-pre-wrap">{hotel.description}</p>
      
      {/* Image Slider */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="relative mb-6">
          <img src={hotel.images[currentImageIndex]} alt={`${hotel.name} ${currentImageIndex + 1}`} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" />
          {hotel.images.length > 1 && (
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
      
      {/* Hotel Info Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><MapPin/>アクセス</h2>
          <p className="text-gray-700 mb-2">{hotel.address}</p>
          {hotel.mapUrl && <a href={hotel.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Google Mapで見る</a>}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><DollarSign/>料金目安</h2>
          <p className="text-gray-700">{hotel.priceRange || '情報なし'}</p>
        </div>
      </div>

      {/* Amenities Section */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">主な設備・アメニティ</h2>
          <div className="flex flex-wrap gap-4">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">
                {getAmenityIcon(amenity)}
                {amenity}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 items-center">
        {hotel.websiteUrl && (
          <a href={hotel.websiteUrl} target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold text-lg">
            <Link size={18} />
            公式サイトで予約する
          </a>
        )}
      </div>
    </div>
  );
};

export default HotelDetail; 