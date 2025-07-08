import { Request, Response } from 'express';
import { db } from './config/firebase.js';
import { doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';


export const getTravelStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, error: '無効なIDです' });
    }
    
    const storyRef = doc(db, 'travelStories', id);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return res.status(404).json({ success: false, error: '旅行記が見つかりません' });
    }
    
    // 閲覧数を増加
    await updateDoc(storyRef, {
      views: increment(1)
    });
    
    const storyData = {
      id: storySnap.id,
      ...storySnap.data()
    };
    
    res.status(200).json({ success: true, data: storyData });
  } catch (error) {
    console.error('旅行記取得エラー:', error);
    res.status(500).json({ success: false, error: '旅行記の取得に失敗しました' });
  }
};

export const updateTravelStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, images, isPublic, authorId } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: '無効なIDです' });
    }
    
    const storyRef = doc(db, 'travelStories', id);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return res.status(404).json({ success: false, error: '旅行記が見つかりません' });
    }
    
    // 投稿者のみ編集可能
    if (storySnap.data().authorId !== authorId) {
      return res.status(403).json({ success: false, error: '編集権限がありません' });
    }
    
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;
    if (images) updateData.images = images;
    if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
    
    await updateDoc(storyRef, updateData);
    
    res.status(200).json({ success: true, message: '旅行記を更新しました' });
  } catch (error) {
    console.error('旅行記更新エラー:', error);
    res.status(500).json({ success: false, error: '旅行記の更新に失敗しました' });
  }
};

export const deleteTravelStory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorId } = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: '無効なIDです' });
    }
    
    const storyRef = doc(db, 'travelStories', id);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return res.status(404).json({ success: false, error: '旅行記が見つかりません' });
    }
    
    // 投稿者のみ削除可能
    if (storySnap.data().authorId !== authorId) {
      return res.status(403).json({ success: false, error: '削除権限がありません' });
    }
    
    await deleteDoc(storyRef);
    
    res.status(200).json({ success: true, message: '旅行記を削除しました' });
  } catch (error) {
    console.error('旅行記削除エラー:', error);
    res.status(500).json({ success: false, error: '旅行記の削除に失敗しました' });
  }
}; 