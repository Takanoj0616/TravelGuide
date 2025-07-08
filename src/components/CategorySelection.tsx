import React from 'react';
import { Area, Category } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { Utensils, Building, Train, TreePine, Camera, Lock, Crown } from 'lucide-react';

interface CategorySelectionProps {
  onUpgradeToPremium: () => void;
  isPremium: boolean;
}

const categoryData: Record<Category, {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isPremiumRequired?: boolean;
}> = {
  meals: {
    name: 'Meals & Dining',
    description: 'Discover authentic local cuisine and hidden dining gems',
    icon: Utensils
  },
  hotels: {
    name: 'Hotels & Accommodation',
    description: 'Find the perfect place to stay for your budget and style',
    icon: Building
  },
  transportation: {
    name: 'Transportation',
    description: 'Navigate like a local with transportation tips and routes',
    icon: Train
  },
  leisure: {
    name: 'Leisure & Entertainment',
    description: 'Exclusive leisure activities and premium experiences',
    icon: TreePine,
    isPremiumRequired: true
  },
  'tourist-spots': {
    name: 'Tourist Spots',
    description: 'Curated tourist destinations with insider recommendations',
    icon: Camera,
    isPremiumRequired: true
  }
};

const areaNames = {
  tokyo: 'Tokyo',
  yokohama: 'Yokohama',
  saitama: 'Saitama',
  chiba: 'Chiba'
};

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  onUpgradeToPremium,
  isPremium 
}) => {
  const { area: areaParam } = useParams<{ area: Area }>();
  const navigate = useNavigate();
  const area = areaParam as Area;

  const handleCategoryClick = (category: Category) => {
    const categoryInfo = categoryData[category];
    if (categoryInfo.isPremiumRequired && !isPremium) {
      onUpgradeToPremium();
    } else {
      navigate(`/content/${area}/${category}`);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore {areaNames[area]}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a category to dive deep into what {areaNames[area]} has to offer. 
            Each section is carefully curated with local insights and practical tips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryData).map(([key, category]) => {
            const IconComponent = category.icon;
            const isLocked = category.isPremiumRequired && !isPremium;
            
            return (
              <div
                key={key}
                onClick={() => handleCategoryClick(key as Category)}
                className={`relative group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  isLocked ? 'ring-2 ring-yellow-400' : 'hover:transform hover:scale-105'
                }`}
              >
                {isLocked && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Premium
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                    isLocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 group-hover:shadow-lg'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-8 h-8 text-white" />
                    ) : (
                      <IconComponent className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed mb-6">
                    {category.description}
                  </p>

                  <div className={`text-center transition-all duration-200 ${
                    isLocked
                      ? 'text-yellow-600 font-semibold'
                      : 'text-blue-600 group-hover:text-blue-700'
                  }`}>
                    {isLocked ? 'Upgrade to Access' : 'Explore →'}
                  </div>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-50/80 to-transparent pointer-events-none"></div>
                )}
              </div>
            );
          })}
        </div>

        {!isPremium && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Unlock Premium Features
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Get access to exclusive leisure activities, hidden tourist spots, personalized recommendations, 
                and detailed cultural insights with our premium membership.
              </p>
              <button
                onClick={onUpgradeToPremium}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <Crown className="w-5 h-5" />
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};