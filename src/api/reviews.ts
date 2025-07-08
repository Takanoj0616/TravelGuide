import { db } from '../config/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  spotId: string;
  spotName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: any;
}

const reviewsCollection = collection(db, 'reviews');

// 口コミを取得する
export const getReviews = async (): Promise<Review[]> => {
  const q = query(reviewsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

// 口コミを作成する
export const createReview = async (reviewData: {
  rating: number;
  content: string;
  images: File[];
  spotId: string;
  spotName: string;
}) => {
  // Assume user is handled by context or passed in
  const userId = 'temp_user_id'; 
  const userName = 'temp_user_name';

  const imageUrls = await Promise.all(
    reviewData.images.map(async (image) => {
      const storageRef = ref(storage, `reviews/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    })
  );

  await addDoc(reviewsCollection, {
    userId,
    userName,
    spotId: reviewData.spotId,
    spotName: reviewData.spotName,
    rating: reviewData.rating,
    content: reviewData.content,
    images: imageUrls,
    createdAt: serverTimestamp(),
  });
}; 