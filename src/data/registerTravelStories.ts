import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { sampleTravelStories } from './travelStories';

export const registerSampleTravelStories = async () => {
  try {
    console.log('旅行記・体験談のサンプルデータを登録中...');
    
    // 既存の旅行記をチェック
    const storiesSnapshot = await getDocs(collection(db, 'travelStories'));
    const existingStories = storiesSnapshot.docs.map(doc => doc.data().title);
    
    const storiesToAdd = sampleTravelStories.filter(story => !existingStories.includes(story.title));
    
    if (storiesToAdd.length === 0) {
      console.log('旅行記・体験談のサンプルデータは既に登録済みです');
      return;
    }
    
    // 旅行記を登録
    for (const storyData of storiesToAdd) {
      await addDoc(collection(db, 'travelStories'), storyData);
      console.log(`旅行記を登録: ${storyData.title}`);
    }
    
    console.log(`旅行記・体験談のサンプルデータ登録完了: ${storiesToAdd.length}件の旅行記を追加`);
    
  } catch (error) {
    console.error('旅行記・体験談のサンプルデータ登録エラー:', error);
  }
}; 