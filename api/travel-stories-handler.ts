import { Request, Response } from 'express';
import { db } from './config/firebase.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export const getTravelStories = async (req: Request, res: Response) => {
  try {
    // 旅行記一覧を取得
    const storiesRef = collection(db, 'travelStories');
    const q = query(storiesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    console.error('旅行記取得エラー:', error);
    res.status(500).json({ success: false, error: '旅行記の取得に失敗しました' });
  }
};

export const createTravelStory = async (req: Request, res: Response) => {
  try {
    const { title, content, authorId, authorName, authorAvatar, tags, images, isPublic } = req.body;
    
    // バリデーション
    if (!title || !content || !authorId || !authorName) {
      return res.status(400).json({ 
        success: false, 
        error: 'タイトル、本文、投稿者情報は必須です' 
      });
    }
    
    // 旅行記を登録
    const storyData = {
      title,
      content,
      authorId,
      authorName,
      authorAvatar: authorAvatar || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      tags: tags || [],
      images: images || [],
      likes: 0,
      views: 0,
      isPublic: isPublic !== false // デフォルトは公開
    };
    
    const docRef = await addDoc(collection(db, 'travelStories'), storyData);
    
    res.status(201).json({ 
      success: true, 
      data: { id: docRef.id, ...storyData }
    });
  } catch (error) {
    console.error('旅行記投稿エラー:', error);
    res.status(500).json({ success: false, error: '旅行記の投稿に失敗しました' });
  }
}; 