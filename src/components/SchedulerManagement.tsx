import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Settings, Clock, Activity } from 'lucide-react';

interface SchedulerStatus {
  isRunning: boolean;
  intervalMinutes?: number;
}

const SchedulerManagement: React.FC = () => {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalMinutes, setIntervalMinutes] = useState(15);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/scheduler/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError('ステータスの取得に失敗しました');
    }
  };

  const startScheduler = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scheduler/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intervalMinutes }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setStatus(data.status);
      } else {
        setError(data.error || 'スケジューラーの開始に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const stopScheduler = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scheduler/stop', {
        method: 'POST',
      });
      
      const data = await response.json();
      if (response.ok) {
        setStatus(data.status);
      } else {
        setError(data.error || 'スケジューラーの停止に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const runManualUpdate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scheduler/update', {
        method: 'POST',
      });
      
      const data = await response.json();
      if (response.ok) {
        // 成功メッセージを表示
        console.log('Manual update completed');
      } else {
        setError(data.error || '手動更新に失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // 5秒ごとにステータスを更新
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Settings className="mr-2 h-6 w-6 text-blue-600" />
          リアルタイムデータ管理
        </h2>
        <div className="flex items-center space-x-2">
          <Activity className={`h-4 w-4 ${status?.isRunning ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {status?.isRunning ? '実行中' : '停止中'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* スケジューラー制御 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            スケジューラー設定
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm text-gray-600">
              更新間隔:
            </label>
            <select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              disabled={status?.isRunning}
            >
              <option value={5}>5分</option>
              <option value={10}>10分</option>
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={60}>1時間</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={startScheduler}
              disabled={loading || status?.isRunning}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Play className="mr-2 h-4 w-4" />
              開始
            </button>
            
            <button
              onClick={stopScheduler}
              disabled={loading || !status?.isRunning}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Pause className="mr-2 h-4 w-4" />
              停止
            </button>
            
            <button
              onClick={runManualUpdate}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              手動更新
            </button>
          </div>
        </div>

        {/* 現在の状態 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">現在の状態</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ステータス:</span>
              <span className={`ml-2 font-semibold ${
                status?.isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                {status?.isRunning ? '実行中' : '停止中'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">更新間隔:</span>
              <span className="ml-2 font-semibold">
                {status?.intervalMinutes || 'N/A'} 分
              </span>
            </div>
          </div>
        </div>

        {/* 情報 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-800">機能説明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• SNS・レビューサイトからリアルタイムで混雑状況を収集</li>
            <li>• Google Places、Twitter、Instagram のデータを統合分析</li>
            <li>• AI による混雑度の自動判定</li>
            <li>• 設定した間隔で自動更新</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SchedulerManagement; 