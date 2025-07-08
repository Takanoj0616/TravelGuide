import React from 'react';
import { Area, Category } from '../App';
import { AlertTriangle, Info, Crown, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BaseContentLayout } from './BaseContentLayout';

interface ContentPageProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}

interface ContentItem {
  name: string;
  type: string;
  price: string;
  description: string;
  premium?: boolean;
  subCategory?: 'Ramen' | 'Soba' | 'Sushi' | 'Chinese' | 'Western' | 'Japanese';
}

const areaNames = {
  tokyo: 'Tokyo',
  yokohama: 'Yokohama',
  saitama: 'Saitama',
  chiba: 'Chiba'
};

const categoryNames = {
  meals: 'Meals & Dining',
  hotels: 'Hotels & Accommodation',
  transportation: 'Transportation',
  leisure: 'Leisure & Entertainment',
  'tourist-spots': 'Tourist Spots'
};

// Sample content data
export const contentData: Record<Area, Record<Category, {
  items: ContentItem[];
  tips: string[];
  precautions: string[];
}>> = {
  tokyo: {
    meals: {
      items: [
        { name: 'Tsukiji Outer Market', type: 'Seafood Market', price: '¥1,000-3,000', description: 'Fresh sushi and seafood breakfast experience', subCategory: 'Japanese' },
        { name: 'Ichiran Ramen', type: 'Ramen Chain', price: '¥800-1,200', description: 'Famous tonkotsu ramen with customizable options', subCategory: 'Ramen' },
        { name: 'Kanda Matsuya', type: 'Soba Noodles', price: '¥1,000-2,000', description: 'Long-established soba restaurant with a traditional atmosphere', subCategory: 'Soba' },
        { name: 'Din Tai Fung', type: 'Taiwanese/Chinese', price: '¥2,000-4,000', description: 'World-famous for its xiao long bao (soup dumplings)', subCategory: 'Chinese' },
        { name: 'bills', type: 'Cafe/Western', price: '¥2,000-4,000', description: 'Known for its ricotta hotcakes and brunch menu', subCategory: 'Western' },
        { name: 'Sukiyabashi Jiro', type: 'High-end Sushi', price: '¥30,000+', description: 'World-renowned sushi master experience', premium: true, subCategory: 'Sushi' }
      ],
      tips: [
        'Many restaurants don\'t accept credit cards - carry cash',
        'Tipping is not customary in Japan',
        'Slurping noodles is perfectly acceptable and shows appreciation'
      ],
      precautions: [
        'Some traditional restaurants may not allow photography',
        'Reservations are essential for high-end establishments',
        'Learn basic Japanese food terms for easier ordering'
      ]
    },
    hotels: {
      items: [
        { name: 'Park Hyatt Tokyo', type: 'Luxury Hotel', price: '¥50,000+/night', description: 'Premium location in Shinjuku with city views' },
        { name: 'Capsule Hotel Anshin Oyado', type: 'Capsule Hotel', price: '¥3,000-5,000/night', description: 'Unique Japanese accommodation experience' },
        { name: 'The Ritz-Carlton Tokyo', type: 'Ultra Luxury', price: '¥80,000+/night', description: 'Ultimate luxury with Michelin-starred dining', premium: true }
      ],
      tips: [
        'Book accommodations well in advance, especially during cherry blossom season',
        'Many hotels offer luggage forwarding services',
        'Check-in time is typically 3 PM, check-out is 11 AM'
      ],
      precautions: [
        'Some traditional ryokans may have strict rules about bathing etiquette',
        'Rooms are typically smaller than Western standards',
        'Smoking rooms are still common - specify non-smoking when booking'
      ]
    },
    transportation: {
      items: [
        { name: 'JR Yamanote Line', type: 'Train Line', price: '¥140-200 per ride', description: 'Circular line connecting major Tokyo stations' },
        { name: 'Tokyo Metro 24-Hour Ticket', type: 'Day Pass', price: '¥800', description: 'Unlimited rides on Tokyo Metro lines' },
        { name: 'Taxi Services', type: 'Private Transport', price: '¥400 base + distance', description: 'Clean and reliable but expensive option' }
      ],
      tips: [
        'Get a JR Pass if traveling between cities',
        'Download Google Translate app for station names',
        'Rush hours are 7-9 AM and 5-7 PM - avoid if possible'
      ],
      precautions: [
        'Last trains usually run until midnight',
        'Some stations are extremely large - allow extra time',
        'Priority seats are reserved for elderly, pregnant, and disabled passengers'
      ]
    },
    leisure: {
      items: [
        { name: 'TeamLab Borderless', type: 'Digital Art Museum', price: '¥3,200', description: 'Immersive digital art experience', premium: true },
        { name: 'Tokyo Skytree', type: 'Observation Tower', price: '¥2,100-3,400', description: 'Tallest tower in Japan with city views' },
        { name: 'Kabuki-za Theatre', type: 'Traditional Theater', price: '¥4,000-20,000', description: 'Experience traditional Japanese performing arts', premium: true }
      ],
      tips: [
        'Book tickets online in advance for popular attractions',
        'Many museums are closed on Mondays',
        'Student discounts are often available with proper ID'
      ],
      precautions: [
        'Photography may be restricted in some venues',
        'Dress codes may apply for traditional theaters',
        'Some experiences require advance reservations'
      ]
    },
    'tourist-spots': {
      items: [
        { name: 'Senso-ji Temple', type: 'Historic Temple', price: 'Free', description: 'Tokyo\'s oldest Buddhist temple in Asakusa' },
        { name: 'Meiji Shrine', type: 'Shinto Shrine', price: 'Free', description: 'Peaceful shrine dedicated to Emperor Meiji' },
        { name: 'Imperial Palace East Gardens', type: 'Gardens', price: 'Free', description: 'Beautiful traditional Japanese gardens', premium: true }
      ],
      tips: [
        'Visit temples early morning for peaceful experience',
        'Bow before entering shrine grounds',
        'Many temples offer English pamphlets'
      ],
      precautions: [
        'Dress modestly when visiting religious sites',
        'Photography may be restricted in shrine buildings',
        'Remove hats and sunglasses when entering sacred areas'
      ]
    }
  },
  yokohama: {
    meals: {
      items: [
        { name: 'Yokohama Chinatown', type: 'Chinese Cuisine District', price: '¥1,500-3,000', description: 'Largest Chinatown in Japan with authentic dishes' },
        { name: 'Red Brick Warehouse Restaurant', type: 'International Cuisine', price: '¥2,000-4,000', description: 'Trendy dining with harbor views' }
      ],
      tips: ['Chinatown gets crowded on weekends', 'Try local specialty: Shumai'],
      precautions: ['Some restaurants may have long waits during peak hours']
    },
    hotels: {
      items: [
        { name: 'Intercontinental Yokohama Grand', type: 'Luxury Hotel', price: '¥25,000+/night', description: 'Waterfront luxury with city views' }
      ],
      tips: ['Book harbor view rooms in advance'],
      precautions: ['Hotel rates increase during events at nearby venues']
    },
    transportation: {
      items: [
        { name: 'Minato Mirai Line', type: 'Train Line', price: '¥200-300', description: 'Connects to Tokyo and covers main attractions' }
      ],
      tips: ['Get day passes for unlimited rides'],
      precautions: ['Some stations have limited English signage']
    },
    leisure: {
      items: [
        { name: 'Cosmo World', type: 'Amusement Park', price: '¥800 + rides', description: 'Waterfront amusement park with iconic Ferris wheel', premium: true }
      ],
      tips: ['Visit at sunset for beautiful views'],
      precautions: ['Some rides may close during bad weather']
    },
    'tourist-spots': {
      items: [
        { name: 'Sankeien Garden', type: 'Traditional Garden', price: '¥700', description: 'Historic garden with traditional architecture', premium: true }
      ],
      tips: ['Best visited during cherry blossom season'],
      precautions: ['Garden paths can be slippery when wet']
    }
  },
  saitama: {
    meals: {
      items: [
        { name: 'Kawagoe Sweet Potato Street', type: 'Local Specialty', price: '¥300-800', description: 'Famous for sweet potato snacks and treats' }
      ],
      tips: ['Try different varieties of sweet potato dishes'],
      precautions: ['Streets can get crowded during festivals']
    },
    hotels: {
      items: [
        { name: 'Kawagoe Prince Hotel', type: 'Mid-range Hotel', price: '¥8,000-12,000/night', description: 'Convenient location near historic district' }
      ],
      tips: ['Walking distance to main attractions'],
      precautions: ['Limited English-speaking staff']
    },
    transportation: {
      items: [
        { name: 'Tobu Tojo Line', type: 'Train Line', price: '¥500-800', description: 'Direct connection from Tokyo to Kawagoe' }
      ],
      tips: ['Buy round-trip tickets for savings'],
      precautions: ['Service frequency decreases in the evening']
    },
    leisure: {
      items: [
        { name: 'Railway Museum', type: 'Museum', price: '¥1,330', description: 'Interactive railway history and train simulators', premium: true }
      ],
      tips: ['Allow at least 3 hours for full experience'],
      precautions: ['Popular with families - can get crowded on weekends']
    },
    'tourist-spots': {
      items: [
        { name: 'Kawagoe Historic District', type: 'Historic Area', price: 'Free to walk', description: 'Well-preserved Edo period architecture', premium: true }
      ],
      tips: ['Rent a bicycle to cover more ground'],
      precautions: ['Traffic can be heavy on weekends']
    }
  },
  chiba: {
    meals: {
      items: [
        { name: 'Kamogawa Seaworld Restaurant', type: 'Aquarium Dining', price: '¥1,500-2,500', description: 'Dine with a view of marine life' }
      ],
      tips: ['Book window seats in advance'],
      precautions: ['Can be noisy during showtimes']
    },
    hotels: {
      items: [
        { name: 'Hotel New Otani Makuhari', type: 'Resort Hotel', price: '¥15,000-30,000/night', description: 'Luxury resort near Makuhari Messe' }
      ],
      tips: ['Check for convention-related discounts'],
      precautions: ['Can be crowded during major events']
    },
    transportation: {
      items: [
        { name: 'Keiyo Line', type: 'Train Line', price: '¥200-400', description: 'Connects Tokyo Station to Chiba' }
      ],
      tips: ['Use for direct access to Disneyland'],
      precautions: ['Line can be very crowded during peak hours for theme parks']
    },
    leisure: {
      items: [
        { name: 'Tokyo DisneySea', type: 'Theme Park', price: '¥8,000-9,400', description: 'Critically acclaimed theme park with unique themes', premium: true }
      ],
      tips: ['Buy tickets online in advance'],
      precautions: ['Expect long lines for popular attractions']
    },
    'tourist-spots': {
      items: [
        { name: 'Mother Farm', type: 'Farm Park', price: '¥1,500', description: 'Family-friendly farm with animal shows and activities', premium: true }
      ],
      tips: ['Arrive early to enjoy all activities'],
      precautions: ['Requires a car or bus access from nearest station']
    }
  }
};

export const ContentPage: React.FC<ContentPageProps> = ({
  isPremium,
  onUpgradeToPremium,
}) => {
  const { area, category, item } = useParams<{ area: Area; category: Category; item?: string }>();
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string | null>(null);
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [restaurants, setRestaurants] = React.useState<{ name: string; station?: string; type: string }[]>([]);

  React.useEffect(() => {
    if (area === 'tokyo' && category === 'meals') {
      getDocs(collection(db, 'restaurants')).then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data() as { name: string; station?: string; type: string });
        setRestaurants(data);
      });
    }
  }, [area, category]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const updated = prev.includes(name)
        ? prev.filter(fav => fav !== name)
        : [...prev, name];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const pageData = area && category ? contentData[area]?.[category] : undefined;
  const subCategories = React.useMemo(() => {
    if (!category || category !== 'meals' || !pageData) return [];
    const subs = pageData.items.map(item => item.subCategory).filter(Boolean);
    return [...new Set(subs)] as string[];
  }, [category, pageData]);
  if (!area || !category || !pageData) {
    return <div>Content not found.</div>;
  }
  const areaName = areaNames[area];
  const categoryName = categoryNames[category];

  // item指定時は該当アイテムのみ抽出
  let filteredItems = pageData.items;
  let isDetail = false;
  let detailItem = undefined;

  if (item) {
    const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    detailItem = filteredItems.find(i => slugify(i.name) === item);
    filteredItems = detailItem ? [detailItem] : [];
    isDetail = true;
  } else {
    if (area === 'tokyo' && category === 'meals') {
      const firestoreItems = restaurants.map(rest => ({
        name: rest.name,
        type: rest.type,
        price: '',
        description: rest.station || '',
        premium: false,
        subCategory: undefined
      }));
      const firestoreNames = new Set(firestoreItems.map(item => item.name));
      const mergedItems = [
        ...firestoreItems,
        ...pageData.items.filter(item => !firestoreNames.has(item.name))
      ];
      filteredItems = mergedItems;
    }
    filteredItems = filteredItems.filter(item => {
      if (isPremium || !item.premium) {
        if (selectedSubCategory) {
          return item.subCategory === selectedSubCategory;
        }
        return true;
      }
      return false;
    });
  }

  // フィルターセクション
  const filterSection = !isDetail && category === 'meals' && subCategories.length > 0 ? (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSubCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${!selectedSubCategory ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All
        </button>
        {subCategories.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubCategory(sub)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedSubCategory === sub ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  // Essential Experiences
  const essentialItems = filteredItems.filter(item => !item.premium).map(item => (
    <div key={item.name} className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <button
        className="absolute top-4 right-4 z-10"
        onClick={() => toggleFavorite(item.name)}
        aria-label={favorites.includes(item.name) ? 'お気に入り解除' : 'お気に入り追加'}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${favorites.includes(item.name) ? 'text-pink-500 fill-pink-500' : 'text-gray-300'}`}
          fill={favorites.includes(item.name) ? 'currentColor' : 'none'}
        />
      </button>
      <Link to={`/content/${area}/${category}/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="block">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2">Type: {item.type}</p>
        <p className="text-gray-600 mb-4">Price: {item.price}</p>
        <p className="text-gray-700">{item.description}</p>
      </Link>
    </div>
  ));

  // Premium & Exclusive
  const premiumItems = !isDetail ? filteredItems.filter(item => item.premium).map(item => (
    <div key={item.name} className="relative bg-white rounded-lg shadow-md p-6">
      {!isPremium && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg z-10">
          <Crown className="w-12 h-12 text-yellow-400 mb-4" />
          <button
            onClick={onUpgradeToPremium}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-full hover:bg-yellow-600 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
      <Link to={`/content/${area}/${category}/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="block">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-2">Type: {item.type}</p>
        <p className="text-gray-600 mb-4">Price: {item.price}</p>
        <p className="text-gray-700">{item.description}</p>
      </Link>
    </div>
  )) : [];

  // Tips
  const tips = pageData.tips.map((tip, index) => (
    <li key={index} className="flex items-start bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
      <Info className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
      <p className="text-blue-800">{tip}</p>
    </li>
  ));

  // Precautions
  const precautions = pageData.precautions.map((precaution, index) => (
    <li key={index} className="flex items-start bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
      <p className="text-red-800">{precaution}</p>
    </li>
  ));

  return (
    <BaseContentLayout
      title={isDetail && detailItem ? detailItem.name : `${categoryName} in ${areaName}`}
      subtitle={isDetail && detailItem ? detailItem.description : `Discover the best of ${categoryName} in ${areaName}.`}
      essentialItems={essentialItems}
      premiumItems={premiumItems}
      tips={tips}
      precautions={precautions}
      filterSection={filterSection}
    />
  );
};