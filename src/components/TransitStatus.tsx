import React, { useEffect, useState } from 'react';
import { fetchTransitStatus } from '../api/fetchTransitStatus';

const levelColor = {
  normal: 'bg-green-200 text-green-800',
  delay: 'bg-yellow-200 text-yellow-800',
  stop: 'bg-red-200 text-red-800',
};

const TransitStatus: React.FC = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransitStatus()
      .then((data) => {
        setLines(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">交通機関のリアルタイム運行情報</h2>
      {loading && <p>運行情報を取得中...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-4">
          {lines.length === 0 ? (
            <li className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold">主要路線</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${levelColor.normal}`}>
                平常運転
              </span>
            </li>
          ) : (
            lines.map((line) => (
              <li key={line.name} className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold">{line.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${levelColor.delay}`}>
                  {line.company}：{line.lastupdate_gmt ? '遅延' : '情報取得'}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-400">※データは国土交通省オープンデータAPIを利用しています。</p>
    </div>
  );
};

export default TransitStatus; 