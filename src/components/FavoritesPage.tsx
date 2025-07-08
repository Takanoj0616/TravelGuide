import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Area, Category } from '../App';
import { contentData } from './ContentPage';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  // 全エリア・カテゴリからお気に入りアイテムを抽出
  const favoriteItems: { item: any; area: Area; category: Category }[] = [];
  (Object.keys(contentData) as Area[]).forEach(area => {
    (Object.keys(contentData[area]) as Category[]).forEach(category => {
      contentData[area][category].items.forEach(item => {
        if (favorites.includes(item.name)) {
          favoriteItems.push({ item, area, category });
        }
      });
    });
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center">
        <Heart className="w-8 h-8 text-pink-500 mr-3" /> お気に入り一覧
      </h1>
      {favoriteItems.length === 0 ? (
        <div className="text-gray-500 text-lg">お気に入り登録されたスポットや体験はありません。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {favoriteItems.map(({ item, area, category }) => (
            <Link
              to={`/content/${area}/${category}/${slugify(item.name)}`}
              key={item.name}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block relative"
            >
              <div className="absolute top-4 right-4">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">Type: {item.type}</p>
              <p className="text-gray-600 mb-4">Price: {item.price}</p>
              <p className="text-gray-700">{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 