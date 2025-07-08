import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Firebaseのdbインスタンスをインポート
import Confetti from 'react-confetti'; // 追加: npm install react-confetti
import { useNavigate } from 'react-router-dom';

// サンプルプランナーデータ
const samplePlanners = [
  {
    id: 'planner-01',
    name: 'Yuki',
    avatarUrl: '/images/avatars/yuki.jpg',
    specialties: ['東京', 'グルメ', 'アニメ'],
    introduction: '東京生まれ、東京育ちのYukiです！最新のグルメ情報から、地元の人しか知らないようなマニアックなアニメの聖地まで、あなたの「好き」に合わせた最高のプランを提案します。一緒にとっておきの東京を探しましょう！',
  },
  {
    id: 'planner-02',
    name: 'Hiro',
    avatarUrl: '/images/avatars/hiro.jpg',
    specialties: ['横浜', '歴史', '夜景', 'ドライブ'],
    introduction: '横浜の魅力に取りつかれて10年。開港の歴史が薫る街並みから、ロマンチックな夜景スポットまで、車での移動も得意です。あなたのペースに合わせて、思い出に残る横浜の旅をデザインします。',
  },
];

async function registerPlanners() {
  for (const planner of samplePlanners) {
    await setDoc(doc(db, 'planners', planner.id), planner);
  }
  alert('プランナー情報をFirestoreに登録しました！');
}

export const CustomPlanRequestPage: React.FC = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'waiting' | 'matched'>('idle');
  const [matchedPlanner, setMatchedPlanner] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [matchedSessionId, setMatchedSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStatus('waiting');
    try {
      const userId = 'user-abc';
      const sessionRef = await addDoc(collection(db, 'planningSessions'), {
        userId,
        status: 'REQUESTING',
        userRequest: {
          destinations: destinations.split(',').map(d => d.trim()),
          duration,
          interests,
          budget,
          notes,
        },
        createdAt: serverTimestamp(),
        plannerId: '',
      });
      const plannersSnap = await getDocs(collection(db, 'planners'));
      const planners = plannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (planners.length > 0) {
        const matched = planners[0];
        await updateDoc(sessionRef, { plannerId: matched.id, status: 'MATCHED' });
        setMatchedPlanner(matched);
        setMatchedSessionId(sessionRef.id);
        setSubmitStatus('matched');
      } else {
        setSubmitStatus('waiting');
      }
    } catch (error) {
      setSubmitError('リクエストの送信に失敗しました。時間をおいて再度お試しください。');
      setSubmitStatus('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitStatus === 'matched' && matchedSessionId) {
      const timer = setTimeout(() => {
        navigate(`/custom-plan/chat/${matchedSessionId}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, matchedSessionId, navigate]);

  if (submitStatus === 'matched' && matchedPlanner) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* 派手な紙吹雪 */}
        <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />
        {/* チェックマークアニメーション */}
        <div className="flex justify-center mb-6">
          <svg className="w-24 h-24 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="#d1fae5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-green-600 mb-4 animate-bounce">マッチしました！</h1>
        <p className="text-lg text-gray-700 mb-4 animate-fade-in">
          あなたの担当プランナー: <span className="font-bold">{matchedPlanner.name}</span>
        </p>
        <img src={matchedPlanner.avatarUrl} alt={matchedPlanner.name} className="mx-auto rounded-full w-24 h-24 mb-4 shadow-lg border-4 border-green-300 animate-fade-in" />
        <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">{matchedPlanner.introduction}</p>
      </div>
    );
  }

  if (submitStatus === 'waiting') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">リクエストありがとうございます！</h1>
          <p className="text-lg text-gray-600 mb-8">
            最適な旅のプランナーを探しています。<br />
            担当が決まりましたら、通知にてお知らせいたします。
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">旅のプラン作成をリクエスト</h1>
            <p className="mt-4 text-xl text-gray-600">
                現地の日本人エキスパートと、あなただけの特別な旅を創りましょう。
            </p>
            <button
              type="button"
              onClick={registerPlanners}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              プランナー情報をFirestoreに登録（管理者用）
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
              <label htmlFor="destinations" className="block text-sm font-medium text-gray-700">
                行きたい場所・エリア
              </label>
              <input
                type="text"
                id="destinations"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 東京、箱根、京都 (複数可)"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                旅行の期間
              </label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 3日間、1週間"
                required
              />
            </div>
            
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                興味・関心のあること
              </label>
              <input
                type="text"
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: グルメ、温泉、アニメ、歴史的建造物"
                required
              />
            </div>
            
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                一人あたりの予算感
              </label>
              <input
                type="text"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: 10万円"
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                その他、要望や伝えておきたいこと (任意)
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="例: アレルギー情報、歩くのが苦手、子供連れ"
              />
            </div>

            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {submitError}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isSubmitting ? '送信中...' : 'この内容でプランナーを探す'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}; 