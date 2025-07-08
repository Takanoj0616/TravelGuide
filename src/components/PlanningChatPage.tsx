import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { PlanningSession } from '../types/planning';
import { localPlanners } from '../data/planners';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessageData {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

// 1つのメッセージを表示するコンポーネント
const ChatMessage = ({ text, isSender, senderName }: { text: string; isSender: boolean; senderName: string }) => (
  <div className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
      <span className="text-xs text-gray-500 px-1">{senderName}</span>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSender ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <p>{text}</p>
      </div>
    </div>
  </div>
);

export const PlanningChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<PlanningSession | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const bottomOfMessagesRef = useRef<HTMLDivElement>(null);

  // セッション情報を取得
  useEffect(() => {
    if (!sessionId) {
      setError('セッションIDが見つかりません。');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const sessionDocRef = doc(db, 'planningSessions', sessionId);
        const sessionDoc = await getDoc(sessionDocRef);

        if (sessionDoc.exists()) {
          setSession({ id: sessionDoc.id, ...sessionDoc.data() } as PlanningSession);
        } else {
          setError('指定された相談セッションが見つかりません。');
        }
      } catch (err) {
        console.error('Error fetching session details:', err);
        setError('セッション情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // メッセージをリアルタイムで取得
  useEffect(() => {
    if (!sessionId) return;

    const q = query(
      collection(db, 'planningSessions', sessionId, 'messages'),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: ChatMessageData[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ChatMessageData);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [sessionId]);

  // 新しいメッセージが来たら一番下にスクロール
  useEffect(() => {
    bottomOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) return;

    // 仮のユーザーID
    const currentUserId = 'user-abc';

    try {
      await addDoc(collection(db, 'planningSessions', sessionId, 'messages'), {
        text: newMessage,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      // ここでユーザーにエラーを通知することもできます
    }
  };

  if (loading) {
    return <div className="text-center py-20">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  const planner = session?.plannerId ? localPlanners.find(p => p.id === session.plannerId) : null;
  const currentUserName = "あなた"; // 仮のユーザー名

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">
          {planner ? `${planner.name}さんとのチャット` : 'プランナーと相談中'}
        </h1>
        <p className="text-sm text-gray-500 truncate">
          {session?.userRequest.destinations.join('・')}への旅
        </p>
      </header>

      {/* Message Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            text={msg.text}
            isSender={msg.senderId === currentUserName} // 'user-abc'と比較
            senderName={msg.senderId === currentUserName ? currentUserName : planner?.name || 'プランナー'}
          />
        ))}
        <div ref={bottomOfMessagesRef} />
      </main>

      {/* Input Form */}
      <footer className="bg-white p-4 border-t border-gray-200 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder="メッセージを入力..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}; 