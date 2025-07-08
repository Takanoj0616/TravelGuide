import { createReview } from '../api/reviews';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  increment,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface SocialStats {
  twitterShares: number;
  facebookShares: number;
  instagramShares: number;
}

// 口コミ投稿
const handleSubmit = async (reviewData: any) => {
  try {
    const review = await createReview(reviewData);
    console.log('Review created:', review);
  } catch (error) {
    console.error('Error creating review:', error);
  }
};

// SNS共有用のインターフェース
interface ShareData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

// Twitter共有用のURLを生成
export const getTwitterShareUrl = (data: ShareData): string => {
  const text = encodeURIComponent(`${data.title}\n${data.description}`);
  const url = encodeURIComponent(data.url);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
};

// Facebook共有用のURLを生成
export const getFacebookShareUrl = (data: ShareData): string => {
  const url = encodeURIComponent(data.url);
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
};

// Instagram共有用のURLを生成（Instagramは直接のシェアURLがないため、アプリのダウンロードページに誘導）
export const getInstagramShareUrl = (): string => {
  return 'https://www.instagram.com/';
};

// SNS共有の統計情報を取得
const getSocialStats = async (reviewId: string): Promise<SocialStats> => {
  const docRef = doc(db, 'socialStats', reviewId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return { twitterShares: 0, facebookShares: 0, instagramShares: 0 };
  }
  const stats = docSnap.data() as SocialStats;
  return stats;
};

// SNS共有を記録
export const recordShare = async (
  reviewId: string,
  platform: 'twitter' | 'facebook' | 'instagram'
): Promise<void> => {
  try {
    const statsRef = collection(db, 'shareStats');
    const q = query(statsRef, where('reviewId', '==', reviewId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // 新しい統計レコードを作成
      await addDoc(statsRef, {
        reviewId,
        twitterShares: platform === 'twitter' ? 1 : 0,
        facebookShares: platform === 'facebook' ? 1 : 0,
        instagramShares: platform === 'instagram' ? 1 : 0,
        createdAt: serverTimestamp()
      });
    } else {
      // 既存の統計レコードを更新
      const docRef = querySnapshot.docs[0].ref;
      const updateData: { [key: string]: any } = {};
      updateData[`${platform}Shares`] = increment(1);
      await updateDoc(docRef, updateData);
    }
  } catch (error) {
    console.error('Error recording share:', error);
    throw error;
  }
}; 