import { Timestamp } from 'firebase/firestore';

export interface TravelStoryData {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags: string[];
  images: string[];
  likes: number;
  views: number;
  isPublic: boolean;
}

export const sampleTravelStories: TravelStoryData[] = [
  {
    title: "東京3日間の思い出深い旅",
    content: "初めての東京旅行で、3日間かけて様々な場所を巡りました。\n\n1日目は浅草寺から始まり、雷門の迫力に圧倒されました。おみくじを引いて、なんと大吉！良い旅のスタートが切れました。\n\n2日目は秋葉原でアニメグッズを買い漁り、夜は東京スカイツリーで夜景を楽しみました。高さ634mからの眺めは本当に素晴らしかったです。\n\n3日目は渋谷のスクランブル交差点を体験し、原宿でファッションショッピング。最後に新宿の高層ビル群を見上げながら、東京の魅力を再確認しました。\n\nまた必ず来たいと思います！",
    authorId: "user1",
    authorName: "旅行好きな田中",
    authorAvatar: "",
    createdAt: Timestamp.fromDate(new Date('2024-01-10T10:00:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-10T10:00:00Z')),
    tags: ["東京", "観光", "浅草", "秋葉原", "渋谷"],
    images: [
      "https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg",
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg"
    ],
    likes: 15,
    views: 120,
    isPublic: true
  },
  {
    title: "横浜中華街で食べ歩きの旅",
    content: "横浜中華街を1日かけて食べ歩きしました。\n\n朝は点心でスタート。蒸し餃子と小籠包が絶品でした。特に小籠包のスープの味が忘れられません。\n\n昼は本格的な北京ダックを食べました。皮がパリパリで、肉が柔らかく、本当に美味しかったです。\n\n午後は中華街の雰囲気を楽しみながら、お土産を買い込みました。杏仁豆腐や月餅など、たくさん買って帰りました。\n\n夜は夜景を見ながら、中華料理店で最後の食事。横浜の夜景と中華料理の組み合わせは最高でした。\n\nまた来たい場所の1つになりました！",
    authorId: "user2",
    authorName: "グルメ探検家",
    authorAvatar: "",
    createdAt: Timestamp.fromDate(new Date('2024-01-12T14:30:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-12T14:30:00Z')),
    tags: ["横浜", "中華街", "グルメ", "食べ歩き"],
    images: [
      "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg"
    ],
    likes: 23,
    views: 89,
    isPublic: true
  },
  {
    title: "川越の小江戸散策記",
    content: "埼玉県川越市の小江戸エリアを散策しました。\n\n時の鐘を中心とした古い街並みが素晴らしく、江戸時代にタイムスリップしたような気分でした。\n\n川越名物のさつまいもを使ったスイーツをたくさん食べました。特にさつまいもアイスが絶品でした。\n\n菓子屋横丁では、昔ながらの駄菓子屋さんが並んでいて、懐かしい気持ちになりました。\n\n川越氷川神社も参拝し、縁結びの御利益をいただきました。\n\n古い街並みと現代的なお店が融合した素敵な街でした。",
    authorId: "user3",
    authorName: "歴史好き",
    authorAvatar: "",
    createdAt: Timestamp.fromDate(new Date('2024-01-15T09:15:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-15T09:15:00Z')),
    tags: ["川越", "小江戸", "歴史", "スイーツ"],
    images: [],
    likes: 8,
    views: 45,
    isPublic: true
  },
  {
    title: "千葉の海辺リゾートでリラックス",
    content: "千葉県の海辺リゾートで2泊3日のリラックス旅をしました。\n\n1日目は九十九里浜で海水浴。波が穏やかで、家族で楽しめました。夕日が美しく、写真をたくさん撮りました。\n\n2日目は房総半島をドライブ。海沿いの道を走りながら、途中で新鮮な海鮮丼を食べました。\n\n3日目は成田山新勝寺に参拝。広大な境内を散策し、お守りを買いました。\n\n海の幸を存分に楽しみ、心身ともにリフレッシュできました。\n\nまた夏に来たいと思います！",
    authorId: "user4",
    authorName: "海好き",
    authorAvatar: "",
    createdAt: Timestamp.fromDate(new Date('2024-01-18T16:45:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-18T16:45:00Z')),
    tags: ["千葉", "海", "リゾート", "ドライブ"],
    images: [
      "https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg"
    ],
    likes: 12,
    views: 67,
    isPublic: true
  },
  {
    title: "東京の隠れた名店を巡る旅",
    content: "東京の隠れた名店を巡るグルメ旅をしました。\n\nまずは築地市場の外市場で、新鮮な寿司を食べました。朝早く行ったので、混雑を避けられました。\n\n次に、下町の隠れたラーメン店を訪れました。行列ができる店でしたが、待った甲斐がありました。\n\n午後は、表参道の隠れたカフェで休憩。落ち着いた雰囲気で、美味しいケーキを楽しみました。\n\n夜は、新宿の路地裏にある居酒屋で、地元の人たちと交流しながら、美味しい日本酒と料理を楽しみました。\n\n観光地ではない、本当の東京の魅力を感じられる旅でした。",
    authorId: "user5",
    authorName: "グルメ探検家",
    authorAvatar: "",
    createdAt: Timestamp.fromDate(new Date('2024-01-20T11:20:00Z')),
    updatedAt: Timestamp.fromDate(new Date('2024-01-20T11:20:00Z')),
    tags: ["東京", "グルメ", "隠れた名店", "下町"],
    images: [],
    likes: 19,
    views: 78,
    isPublic: true
  }
]; 