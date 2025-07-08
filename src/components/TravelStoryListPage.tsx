import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Calendar, User } from 'lucide-react';

interface TravelStory {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  tags: string[];
  images: string[];
  likes: number;
  views: number;
  isPublic: boolean;
}

export const TravelStoryListPage: React.FC = () => {
  const [stories, setStories] = useState<TravelStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/travel-stories');
        const result = await response.json();
        
        if (result.success) {
          setStories(result.data);
        } else {
          setError(result.error || '旅行記の取得に失敗しました');
        }
      } catch (err) {
        setError('旅行記の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ja-JP');
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">旅行記・体験談</h1>
          <Link
            to="/travel-stories/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            旅行記を投稿する
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : stories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">まだ旅行記がありません</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Link
                key={story.id}
                to={`/travel-stories/${story.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {story.images && story.images.length > 0 && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {story.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateContent(story.content)}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    {story.authorAvatar ? (
                      <img
                        src={story.authorAvatar}
                        alt={story.authorName}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <User className="w-4 h-4 mr-1" />
                    )}
                    <span>{story.authorName}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(story.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        <span>{story.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{story.views}</span>
                      </div>
                    </div>
                    
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStoryListPage; 