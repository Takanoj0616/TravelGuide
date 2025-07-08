import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

interface Question {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  tags?: string[];
  resolved?: boolean;
}

export const QuestionListPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Question[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
      setQuestions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Q&A掲示板</h1>
          <Link
            to="/questions/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            質問を投稿する
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="text-center py-10">読み込み中...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">まだ質問がありません</div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {questions.map((q) => (
                <li key={q.id}>
                  <Link to={`/questions/${q.id}`} className="block hover:bg-gray-50 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-blue-700 truncate">{q.title}</h2>
                      {q.resolved && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">解決済み</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>投稿者: {q.authorName}</span>
                      <span className="mx-2">|</span>
                      <span>{q.createdAt && q.createdAt.toDate().toLocaleString()}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionListPage; 