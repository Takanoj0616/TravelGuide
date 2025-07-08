import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const mockUser = {
  id: 'user1',
  name: 'ゲストユーザー',
};

interface Question {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  tags?: string[];
  resolved?: boolean;
}

interface Answer {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  isBestAnswer?: boolean;
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchQuestion = async () => {
      const docRef = doc(db, 'questions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestion({ id: docSnap.id, ...docSnap.data() } as Question);
      }
      setLoading(false);
    };
    fetchQuestion();
    const answersRef = collection(db, 'questions', id, 'answers');
    const q = query(answersRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Answer[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Answer));
      setAnswers(data);
    });
    return () => unsubscribe();
  }, [id]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!answerBody.trim()) {
      setError('回答内容を入力してください');
      return;
    }
    setPosting(true);
    try {
      await addDoc(collection(db, 'questions', id!, 'answers'), {
        body: answerBody,
        authorId: mockUser.id,
        authorName: mockUser.name,
        createdAt: serverTimestamp(),
        isBestAnswer: false,
      });
      setAnswerBody('');
    } catch (_err) {
      setError('回答の投稿に失敗しました');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }
  if (!question) {
    return <div className="text-center py-10 text-red-500">質問が見つかりません</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded p-6 mb-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">{question.title}</h1>
          <div className="text-gray-700 mb-4 whitespace-pre-line">{question.body}</div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>投稿者: {question.authorName}</span>
            <span className="mx-2">|</span>
            <span>{question.createdAt && question.createdAt.toDate().toLocaleString()}</span>
            {question.resolved && (
              <span className="ml-4 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">解決済み</span>
            )}
          </div>
          {question.tags && question.tags.length > 0 && (
            <div className="mt-2">
              {question.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-2">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">回答</h2>
          {answers.length === 0 ? (
            <div className="text-gray-500 mb-4">まだ回答がありません</div>
          ) : (
            <ul className="space-y-4">
              {answers.map(ans => (
                <li key={ans.id} className="border-b pb-2">
                  <div className="text-gray-800 whitespace-pre-line">{ans.body}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>回答者: {ans.authorName}</span>
                    <span className="mx-2">|</span>
                    <span>{ans.createdAt && ans.createdAt.toDate().toLocaleString()}</span>
                    {ans.isBestAnswer && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">ベストアンサー</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-bold mb-4">回答する</h2>
          <form onSubmit={handleAnswerSubmit}>
            <textarea
              value={answerBody}
              onChange={e => setAnswerBody(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              rows={4}
              placeholder="あなたの回答を入力してください"
              required
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={posting}
            >
              {posting ? '投稿中...' : '投稿する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage; 