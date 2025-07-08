import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  increment,
  DocumentData,
  Query,
  serverTimestamp
} from 'firebase/firestore';

// 型定義
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  spotId: string;
  spotName: string;
  likes?: number;
}

export interface CreateReviewData {
  rating: number;
  content: string;
  images?: string[];
  spotId: string;
  spotName: string;
}

// 口コミ一覧を取得
export const getReviews = async (spotId?: string): Promise<Review[]> => {
  try {
    let q: Query<DocumentData> = collection(db, 'reviews');
    
    if (spotId) {
      q = query(q, where('spotId', '==', spotId));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// 口コミを投稿
export const createReview = async (reviewData: CreateReviewData): Promise<Review> => {
  try {
    // 口コミデータを保存
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
      likes: 0
    });

    // 作成した口コミのデータを取得
    const reviewDoc = await getDoc(reviewRef);
    return {
      id: reviewRef.id,
      ...reviewDoc.data()
    } as Review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// 口コミを更新
export const updateReview = async (reviewId: string, reviewData: Partial<CreateReviewData>): Promise<Review> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    
    await updateDoc(reviewRef, {
      ...reviewData,
      updatedAt: serverTimestamp()
    });

    const updatedDoc = await getDoc(reviewRef);
    return {
      id: reviewId,
      ...updatedDoc.data()
    } as Review;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// 口コミを削除
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// 口コミのいいねを追加/削除
export const toggleReviewLike = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error toggling review like:', error);
    throw error;
  }
};

// 口コミの統計情報を取得
export const getReviewStats = async (spotId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('spotId', '==', spotId)
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => doc.data() as Review);
    
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    return {
      averageRating,
      totalReviews,
      ratingDistribution
    };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
}; 