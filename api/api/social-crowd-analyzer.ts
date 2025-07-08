import { Request, Response } from 'express';

interface GooglePlacesData {
  name?: string;
  rating?: number;
  totalRatings?: number;
  reviews?: Review[];
  openingHours?: unknown;
  currentStatus?: boolean;
}

interface TwitterUser {
  id: string;
  username?: string;
  name?: string;
  profile_image_url?: string;
}

interface TwitterTweet {
  id?: string;
  author_id?: string;
  created_at?: string;
  text: string;
  user?: TwitterUser | null;
}

interface TwitterData {
  tweets?: TwitterTweet[];
  meta?: unknown;
}

interface InstagramData {
  posts?: unknown[];
  total?: number;
}

interface Review {
  text?: string;
}

interface CrowdData {
  location: string;
  crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  sources: string[];
  lastUpdated: string;
  details: {
    googlePlaces?: GooglePlacesData;
    twitter?: TwitterData;
    instagram?: InstagramData;
    reviews?: Review[];
  };
  nearbyLocations?: {
    location: string;
    crowdLevel: 'low' | 'medium' | 'high' | 'very_high';
    confidence: number;
  }[];
}

interface AnalysisResult {
  success: boolean;
  data?: CrowdData;
  error?: string;
}

// Google Places API から混雑状況を取得
async function fetchGooglePlacesData(location: string, _lat?: number, _lng?: number): Promise<GooglePlacesData | null> {
  try {
    // Google Places API の実装
    // 実際のAPIキーは環境変数から取得
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('Google Places API key not configured');
      return null;
    }

    // 場所検索
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(location)}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.results && searchData.results.length > 0) {
      const placeId = searchData.results[0].place_id;
      // 詳細情報とレビューを取得
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,opening_hours,current_opening_hours&key=${apiKey}`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();

      return {
        name: detailsData.result?.name,
        rating: detailsData.result?.rating,
        totalRatings: detailsData.result?.user_ratings_total,
        reviews: detailsData.result?.reviews?.slice(0, 5) || [],
        openingHours: detailsData.result?.opening_hours,
        currentStatus: detailsData.result?.current_opening_hours?.open_now
      };
    }
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
  }
  return null;
}

// Twitter API からリアルタイム投稿を取得
async function fetchTwitterData(location: string): Promise<TwitterData | null> {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      console.warn('Twitter API bearer token not configured');
      return null;
    }

    // 多言語クエリ対応
    let query = location;
    if (location.toLowerCase() === 'tokyo tower') {
      query = 'Tokyo Tower OR 東京タワー OR 도쿄타워 OR 東京鐵塔';
    }

    const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username,name,profile_image_url`;
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const usersMap: Record<string, TwitterUser> = {};
      if (data.includes && data.includes.users) {
        for (const user of data.includes.users as TwitterUser[]) {
          usersMap[user.id] = user;
        }
      }
      const tweets: TwitterTweet[] = (data.data || []).map((tweet: unknown) => {
        const t = tweet as TwitterTweet;
        return {
          ...t,
          user: usersMap[t.author_id || ''] || null
        };
      });
      if (!tweets || tweets.length === 0) {
        console.warn('No tweets found for query:', query);
      }
      return {
        tweets,
        meta: data.meta
      };
    } else {
      console.error('Twitter API response not ok:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
  }
  return null;
}

// Instagram API から投稿を取得
// async function fetchInstagramData(location: string): Promise<any> {
//   try {
//     // Instagram Basic Display API の実装
//     const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
//     if (!accessToken) {
//       console.warn('Instagram API access token not configured');
//       return null;
//     }

//     // 場所に関連する投稿を検索
//     const searchUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;
//     const response = await fetch(searchUrl);

//     if (response.ok) {
//       const data = await response.json();
//       // 場所名でフィルタリング
//       const filteredPosts = data.data?.filter((post: any) => 
//         post.caption?.toLowerCase().includes(location.toLowerCase())
//       ) || [];
      
//       return {
//         posts: filteredPosts.slice(0, 5),
//         total: filteredPosts.length
//       };
//     }
//   } catch (error) {
//     console.error('Error fetching Instagram data:', error);
//   }
//   return null;
// }

// AI による混雑状況の分析
function analyzeCrowdLevel(googleData: GooglePlacesData | null, twitterData: TwitterData | null, instagramData: InstagramData | null): CrowdData {
  let crowdLevel: 'low' | 'medium' | 'high' | 'very_high' = 'low';
  let confidence = 0.5;
  const sources: string[] = [];

  // Google Places の評価から混雑度を推定
  if (googleData) {
    sources.push('Google Places');
    const rating = googleData.rating || 0;
    const totalRatings = googleData.totalRatings || 0;
    if (rating > 4.0 && totalRatings > 100) {
      crowdLevel = 'high';
      confidence += 0.2;
    } else if (rating > 3.5) {
      crowdLevel = 'medium';
      confidence += 0.1;
    }
  }

  // Twitter の投稿数から混雑度を推定
  if (twitterData && Array.isArray(twitterData.tweets) && twitterData.tweets.length > 0) {
    sources.push('Twitter');
    const tweetCount = twitterData.tweets.length;
    if (tweetCount > 5) {
      crowdLevel = crowdLevel === 'low' ? 'medium' : crowdLevel;
      confidence += 0.15;
    }
  }

  // レビューの内容から混雑度を推定
  if (googleData && googleData.reviews) {
    const reviews = googleData.reviews;
    const crowdKeywords = ['混雑', 'crowded', 'busy', '込んでいる', '待ち時間', 'wait'];
    const crowdMentions = reviews.filter((review: Review) => 
      crowdKeywords.some(keyword => 
        review.text?.toLowerCase().includes(keyword.toLowerCase())
      )
    ).length;
    if (crowdMentions > reviews.length * 0.3) {
      crowdLevel = crowdLevel === 'low' ? 'medium' : 'high';
      confidence += 0.2;
    }
  }
  return {
    location: 'Unknown',
    crowdLevel,
    confidence: Math.min(confidence, 1.0),
    sources,
    lastUpdated: new Date().toISOString(),
    details: {
      googlePlaces: googleData || undefined,
      twitter: twitterData || undefined,
      instagram: instagramData || undefined,
      reviews: googleData?.reviews || undefined
    }
  };
}

// メインの解析関数
export async function getRealTimeCrowdData(req: Request, _res: Response): Promise<AnalysisResult> {
  try {
    // locationはparamsまたはqueryから取得
    let location = (req.params.location || req.query.location) as string | undefined;
    const lat = req.query.lat as string | undefined;
    const lng = req.query.lng as string | undefined;

    // locationが未指定または空文字の場合はエラー
    if ((!location || location.trim() === '') && (!lat || !lng)) {
      return {
        success: false,
        error: 'Location parameter or coordinates are required'
      };
    }

    // locationが空文字の場合はundefinedにする
    if (location && location.trim() === '') {
      location = undefined;
    }

    console.log(`Analyzing crowd data for location: ${location || `${lat},${lng}`}`);

    // 並行して各データソースから情報を取得
    const [googleData, twitterDataRaw, instagramData] = await Promise.all([
      fetchGooglePlacesData(location || 'current location', lat ? parseFloat(lat) : undefined, lng ? parseFloat(lng) : undefined),
      fetchTwitterData(location || 'current location'),
      // fetchInstagramData(location || 'current location')
      Promise.resolve(null) // Instagram API をコメントアウト
    ]);

    // Twitterデータがnullの場合でも空配列で返す
    const twitterData = twitterDataRaw || { tweets: [] };

    // Google Placesのデータが取得できなかった場合はエラー
    if (!googleData) {
      return {
        success: false,
        error: 'No data found for the specified location.'
      };
    }

    // --- ここから周辺スポット取得 ---
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const nearbyLocations = [];
    if (apiKey && googleData && googleData.name) {
      // まずplace_idを取得
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(googleData.name)}&key=${apiKey}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      if (searchData.results && searchData.results.length > 0) {
        const { lat, lng } = searchData.results[0].geometry.location;
        // Nearby Searchで周辺スポットを取得
        const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=restaurant|tourist_attraction&key=${apiKey}`;
        const nearbyResponse = await fetch(nearbyUrl);
        const nearbyData = await nearbyResponse.json();
        if (nearbyData.results && Array.isArray(nearbyData.results)) {
          for (const spot of nearbyData.results.slice(0, 3)) {
            const spotName = spot.name;
            const spotGoogleData = await fetchGooglePlacesData(spotName);
            const spotCrowdData = analyzeCrowdLevel(spotGoogleData, null, null);
            nearbyLocations.push({
              location: spotName,
              crowdLevel: spotCrowdData.crowdLevel,
              confidence: spotCrowdData.confidence
            });
          }
        }
      }
    }
    // --- ここまで周辺スポット取得 ---

    // AI による混雑状況の分析
    const crowdData = analyzeCrowdLevel(googleData, twitterData, instagramData);
    crowdData.location = location || 'Current Location';
    crowdData.nearbyLocations = nearbyLocations;

    return {
      success: true,
      data: crowdData
    };

  } catch (error) {
    console.error('Error in getRealTimeCrowdData:', error);
    return {
      success: false,
      error: 'Failed to analyze crowd data'
    };
  }
}

// バッチ処理用の関数（定期的な更新用）
export async function updateCrowdDataBatch(): Promise<void> {
  // 主要な観光地のリスト
  const popularLocations = [
    'Tokyo Tower',
    'Shibuya Crossing',
    'Senso-ji Temple',
    'Tokyo Skytree',
    'Tsukiji Market',
    'Harajuku',
    'Ginza',
    'Roppongi Hills'
  ];

  for (const location of popularLocations) {
    try {
      // 直接データを取得して分析
      const [googleData, twitterData, instagramData] = await Promise.all([
        fetchGooglePlacesData(location),
        fetchTwitterData(location),
        Promise.resolve(null) // Instagram API をコメントアウト
      ]);

      // AI による混雑状況の分析
      const crowdData = analyzeCrowdLevel(googleData, twitterData, instagramData);
      crowdData.location = location;

      // データベースに保存する処理をここに追加
      console.log(`Updated crowd data for ${location}: ${crowdData.crowdLevel}`);
    } catch (error) {
      console.error(`Error updating crowd data for ${location}:`, error);
    }
  }
} 