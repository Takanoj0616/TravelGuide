import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Tag, Eye, EyeOff } from 'lucide-react';

const mockUser = {
  id: 'user1',
  name: '旅行者',
  avatar: '',
};

const TravelStoryFormPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !content.trim()) {
      setError('タイトルと本文は必須です');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/travel-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          authorId: mockUser.id,
          authorName: mockUser.name,
          authorAvatar: mockUser.avatar,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          images: images.split(',').map(img => img.trim()).filter(Boolean),
          isPublic,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        navigate('/travel-stories');
      } else {
        setError(result.error || '投稿に失敗しました');
      }
    } catch (err) {
      setError('投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">旅行記を投稿する</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="旅行記のタイトルを入力してください"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                本文 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="あなたの旅行体験を詳しく書いてください..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                タグ（カンマ区切り・任意）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 東京, グルメ, 観光, 温泉"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline w-4 h-4 mr-1" />
                画像URL（カンマ区切り・任意）
              </label>
              <input
                type="text"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  {isPublic ? (
                    <>
                      <Eye className="inline w-4 h-4 mr-1" />
                      公開する
                    </>
                  ) : (
                    <>
                      <EyeOff className="inline w-4 h-4 mr-1" />
                      非公開にする
                    </>
                  )}
                </span>
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/travel-stories')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '投稿中...' : '投稿する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelStoryFormPage; 