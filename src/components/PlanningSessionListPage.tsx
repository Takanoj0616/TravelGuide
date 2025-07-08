import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlanningSession, PlanningSessionStatus } from '../types/planning';
import { localPlanners } from '../data/planners';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';

// サンプルの相談データは不要になったので削除

const statusText: { [key in PlanningSessionStatus]: string } = {
    REQUESTING: 'プランナーを探しています',
    MATCHED: 'プランナーが見つかりました',
    IN_PROGRESS: 'プラン相談中',
    COMPLETED: 'プラン完成',
    CANCELED: 'キャンセル済み',
};

export const PlanningSessionListPage: React.FC = () => {
  const [sessions, setSessions] = useState<PlanningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ログインユーザーIDを仮定
    const userId = 'user-abc';

    // まず、インデックスなしでも動作するクエリを試す
    const q = query(
      collection(db, 'planningSessions'),
      where('userId', '==', userId)
      // orderBy('createdAt', 'desc') を一時的にコメントアウト
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const sessionsData: PlanningSession[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sessionsData.push({
            id: doc.id,
            ...data,
            // FirestoreのTimestampをDateに変換
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          } as PlanningSession);
        });
        
        // クライアント側でソート（インデックスなしでも動作）
        sessionsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setSessions(sessionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sessions:', err);
        console.error('Error details:', {
          code: err.code,
          message: err.message,
          stack: err.stack
        });
        
        // インデックスエラーの場合は特別なメッセージを表示
        if (err.code === 'failed-precondition' || err.code === 'unimplemented') {
          setError('データベースの設定が完了していません。しばらく時間をおいてから再度お試しください。');
        } else {
          setError(`相談履歴の取得に失敗しました: ${err.message}`);
        }
        setLoading(false);
      }
    );

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  const getPlannerName = (plannerId: string) => {
    return localPlanners.find(p => p.id === plannerId)?.name || '不明';
  };

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                旅の相談履歴
            </h1>
            <Link
                to="/custom-plan/new"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
                新しい旅を相談する
            </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {sessions.length === 0 ? (
                <div className="text-center py-20 px-4">
                    <h2 className="text-xl font-medium text-gray-900">まだ相談履歴がありません</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        「新しい旅を相談する」ボタンから、最初のプラン作成をリクエストしてみましょう！
                    </p>
                </div>
            ) : (
                <ul role="list" className="divide-y divide-gray-200">
                    {sessions.map((session) => (
                    <li key={session.id}>
                        <Link to={`/custom-plan/chat/${session.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                                {session.userRequest.destinations.join('・')}への旅
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {statusText[session.status]}
                                </p>
                            </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                {session.userRequest.duration}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                担当: {session.plannerId ? getPlannerName(session.plannerId) : '---'}
                                </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                依頼日: {new Date(session.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            </div>
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