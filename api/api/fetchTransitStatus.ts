export async function fetchTransitStatus() {
  // 国土交通省のサンプルAPIエンドポイント（実際のURLは要確認）
  const url = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error('運行情報の取得に失敗しました');
  return res.json();
} 