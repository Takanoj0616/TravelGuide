import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { sampleQuestions, sampleAnswers } from './questions';

export const registerSampleQuestions = async () => {
  try {
    console.log('Q&A掲示板のサンプルデータを登録中...');
    
    // 既存の質問をチェック
    const questionsSnapshot = await getDocs(collection(db, 'questions'));
    const existingQuestions = questionsSnapshot.docs.map(doc => doc.data().title);
    
    const questionsToAdd = sampleQuestions.filter(q => !existingQuestions.includes(q.title));
    
    if (questionsToAdd.length === 0) {
      console.log('Q&A掲示板のサンプルデータは既に登録済みです');
      return;
    }
    
    // 質問を登録
    const questionIds: string[] = [];
    for (const questionData of questionsToAdd) {
      const docRef = await addDoc(collection(db, 'questions'), questionData);
      questionIds.push(docRef.id);
      console.log(`質問を登録: ${questionData.title}`);
    }
    
    // 回答を登録
    for (let i = 0; i < questionsToAdd.length; i++) {
      const questionId = questionIds[i];
      const questionIndex = sampleQuestions.indexOf(questionsToAdd[i]);
      const questionKey = `question${questionIndex + 1}`;
      
      if (sampleAnswers[questionKey]) {
        for (const answerData of sampleAnswers[questionKey]) {
          await addDoc(collection(db, 'questions', questionId, 'answers'), answerData);
          console.log(`回答を登録: ${answerData.authorName}`);
        }
      }
    }
    
    console.log(`Q&A掲示板のサンプルデータ登録完了: ${questionsToAdd.length}件の質問を追加`);
    
  } catch (error) {
    console.error('Q&A掲示板のサンプルデータ登録エラー:', error);
  }
}; 