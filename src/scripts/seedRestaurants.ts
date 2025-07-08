import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirnameの代用
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JSONファイルを直接読み込む
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const sampleRestaurants = [
  {
    name: '一の倉 上野店',
    station: '京成上野駅 367m',
    type: '居酒屋、海鮮、焼き鳥',
  },
  {
    name: 'クンビラ',
    station: '恵比寿駅 155m',
    type: 'ネパール料理、鍋、居酒屋',
  },
  {
    name: '焼肉清江苑 別邸 るあう',
    station: '池袋駅 362m',
    type: '焼肉、ホルモン、韓国料理',
  },
  {
    name: '真八酒場',
    station: '上野駅 468m',
    type: '居酒屋',
  },
  {
    name: 'O\u2019denbar うまみ 麻布十番',
    station: '麻布十番駅 352m',
    type: 'おでん、居酒屋、海鮮',
  },
  {
    name: '産地直送 五丁目酒場',
    station: '赤坂駅 208m',
    type: '居酒屋、かき、海鮮',
  },
  {
    name: '焼肉 ミート大将',
    station: '豊洲駅 428m',
    type: '焼肉、居酒屋、ホルモン',
  },
  {
    name: '美味しいお肉の店 やまの',
    station: '秋葉原駅 150m',
    type: '焼肉、牛タン、居酒屋',
  },
  {
    name: '四十八漁場 山王パークタワー店',
    station: '溜池山王駅 68m',
    type: '海鮮、居酒屋、日本酒バー',
  },
  {
    name: '完全個室居酒屋 和禅 新宿西口店',
    station: '新宿西口駅 118m',
    type: '居酒屋、焼き鳥、海鮮',
  },
  {
    name: '中目黒 Bistro Bolero',
    station: '祐天寺駅 495m',
    type: 'ビストロ、バル',
  },
  {
    name: '天ぷら新宿つな八 つのはず庵',
    station: '新宿三丁目駅 100m',
    type: '天ぷら、日本料理、海鮮',
  },
  {
    name: '個室 塊肉×農園野菜　Nick&Noojoo 新橋本店',
    station: '新橋駅 184m',
    type: 'バル、居酒屋、ダイニングバー',
  },
  {
    name: 'そばえもん 大崎店',
    station: '大崎駅 107m',
    type: '居酒屋、天ぷら、そば',
  },
  {
    name: 'ビースト原田',
    station: '立川駅 265m',
    type: '居酒屋、食堂、からあげ',
  },
  {
    name: 'S Spiral',
    station: '神泉駅 150m',
    type: 'シーフード、海鮮、イタリアン',
  },
  {
    name: 'Petalo 渋谷ストリーム',
    station: '渋谷駅 225m',
    type: 'バル、イタリアン、ビアバー',
  },
  {
    name: '三田和食酒場 やすらぎ',
    station: '三田駅 295m',
    type: '居酒屋、焼き鳥、小籠包',
  },
  {
    name: '魚吉酒場 池袋店',
    station: '池袋駅 312m',
    type: '居酒屋、海鮮、焼き鳥',
  },
  {
    name: '蕎麦と酒蔵 稲田屋 霞が関コモンゲート店',
    station: '虎ノ門駅 296m',
    type: '居酒屋、そば、海鮮',
  },
  {
    name: '升亀 品川店',
    station: '品川駅 372m',
    type: '居酒屋、日本酒バー、鍋',
  },
];

async function seed() {
  const colRef = db.collection('restaurants');
  for (const rest of sampleRestaurants) {
    await colRef.add(rest);
    console.log(`Added: ${rest.name}`);
  }
  console.log('全ての飲食店データを登録しました！');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}); 