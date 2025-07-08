import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react';

interface TravelStory {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: unknown;
  updatedAt?: unknown;
  tags: string[];
  images: string[];
  likes: number;
  views: number;
  isPublic: boolean;
}

const mockUser = {
  id: 'user1',
  name: '旅行者',
};

const TravelStoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<TravelStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/travel-stories/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setStory(result.data);
        } else {
          setError(result.error || '旅行記が見つかりません');
        }
      } catch (_err) {
        setError('旅行記の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    const timestampObj = timestamp as { toDate?: () => Date };
    const date = timestampObj.toDate ? timestampObj.toDate() : new Date(timestamp as string);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    if (!story) return;
    setLiked(!liked);
    // TODO: APIでいいね機能を実装
  };

  const handleEdit = () => {
    navigate(`/travel-stories/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!story || !confirm('この旅行記を削除しますか？')) return;
    
    try {
      const response = await fetch(`/api/travel-stories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: mockUser.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        navigate('/travel-stories');
      } else {
        setError(result.error || '削除に失敗しました');
      }
    } catch (_err) {
      setError('削除に失敗しました');
    }
  };

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  if (error || !story) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error || '旅行記が見つかりません'}</div>
        <Link
          to="/travel-stories"
          className="text-blue-600 hover:text-blue-800"
        >
          旅行記一覧に戻る
        </Link>
      </div>
    );
  }

  const isAuthor = story.authorId === mockUser.id;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/travel-stories"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            旅行記一覧に戻る
          </Link>
        </div>

        <article className="bg-white shadow rounded-lg overflow-hidden">
          {/* ヘッダー */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
              {isAuthor && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              {story.authorAvatar ? (
                <img
                  src={story.authorAvatar}
                  alt={story.authorName}
                  className="w-8 h-8 rounded-full mr-3"
                />
              ) : (
                <User className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">{story.authorName}</span>
              <span className="mx-2">•</span>
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(story.createdAt)}</span>
              {story.updatedAt && story.updatedAt !== story.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>更新: {formatDate(story.updatedAt)}</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{story.likes + (liked ? 1 : 0)}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <Eye className="w-5 h-5" />
                  <span>{story.views}</span>
                </div>
              </div>

              {story.tags && story.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 画像ギャラリー */}
          {story.images && story.images.length > 0 && (
            <div className="p-8 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${story.title} - 画像${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 本文 */}
          <div className="p-8">
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {story.content}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TravelStoryDetailPage; 