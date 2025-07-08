import { Timestamp } from 'firebase/firestore';

export interface QuestionData {
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  tags: string[];
  resolved: boolean;
}

export interface AnswerData {
  body: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
  isBestAnswer: boolean;
}

export const sampleQuestions: QuestionData[] = [
  {
    title: "東京でおすすめのラーメン店を教えてください",
    body: "初めて東京に来ます。本格的なラーメンを食べたいのですが、おすすめの店を教えてください。\n\n予算は1000円前後で、渋谷や新宿周辺で探しています。\n\nよろしくお願いします！",
    authorId: "user1",
    authorName: "旅行者A",
    createdAt: Timestamp.fromDate(new Date('2024-01-15T10:00:00Z')),
    tags: ["グルメ", "ラーメン", "渋谷", "新宿"],
    resolved: true
  },
  {
    title: "成田空港から東京駅への最適な移動方法",
    body: "成田空港から東京駅まで移動する予定です。\n\n時間とコストを考慮した最適な移動方法を教えてください。\n\n荷物は大きめのスーツケース1つです。",
    authorId: "user2",
    authorName: "観光客B",
    createdAt: Timestamp.fromDate(new Date('2024-01-16T14:30:00Z')),
    tags: ["交通", "成田空港", "東京駅", "移動"],
    resolved: false
  },
  {
    title: "浅草寺周辺で着物レンタルできる店",
    body: "浅草寺周辺で着物レンタルをしたいと思っています。\n\n英語対応可能で、着付けサービスも含まれている店を探しています。\n\n予約は必要でしょうか？",
    authorId: "user3",
    authorName: "外国人旅行者C",
    createdAt: Timestamp.fromDate(new Date('2024-01-17T09:15:00Z')),
    tags: ["着物", "浅草", "レンタル", "体験"],
    resolved: false
  },
  {
    title: "秋葉原でアニメグッズを買うならどこ？",
    body: "秋葉原でアニメグッズを買いたいです。\n\n特に人気アニメのフィギュアやグッズを探しています。\n\n免税対応している店も教えてください。",
    authorId: "user4",
    authorName: "アニメファンD",
    createdAt: Timestamp.fromDate(new Date('2024-01-18T16:45:00Z')),
    tags: ["秋葉原", "アニメ", "ショッピング", "免税"],
    resolved: true
  },
  {
    title: "東京で温泉に入れる場所",
    body: "東京で温泉に入りたいです。\n\n都内で温泉に入れる施設を教えてください。\n\n日帰りで利用できるところが希望です。",
    authorId: "user5",
    authorName: "温泉好きE",
    createdAt: Timestamp.fromDate(new Date('2024-01-19T11:20:00Z')),
    tags: ["温泉", "日帰り", "リラックス"],
    resolved: false
  }
];

export const sampleAnswers: { [questionId: string]: AnswerData[] } = {
  "question1": [
    {
      body: "渋谷の「一蘭」がおすすめです！\n\n本格的な博多ラーメンで、スープが濃厚で美味しいです。\n\n価格も1000円前後で、渋谷駅から徒歩5分の好立地です。\n\n平日のランチタイムは少し混みますが、それ以外は比較的空いています。",
      authorId: "local1",
      authorName: "東京在住者",
      createdAt: Timestamp.fromDate(new Date('2024-01-15T12:00:00Z')),
      isBestAnswer: true
    },
    {
      body: "新宿の「らーめん はる」も良いですよ。\n\n醤油ラーメンが人気で、スープがさっぱりしていて飲みやすいです。\n\n新宿駅東口から徒歩3分で、夜遅くまで営業しているので便利です。",
      authorId: "local2",
      authorName: "ラーメン通",
      createdAt: Timestamp.fromDate(new Date('2024-01-15T13:30:00Z')),
      isBestAnswer: false
    }
  ],
  "question4": [
    {
      body: "秋葉原の「アニメイト」がおすすめです！\n\n最新のアニメグッズが豊富で、フィギュアも充実しています。\n\n免税対応もしているので、パスポートを持参してください。\n\nJR秋葉原駅から徒歩5分の好立地です。",
      authorId: "anime1",
      authorName: "アニメ店員",
      createdAt: Timestamp.fromDate(new Date('2024-01-18T18:00:00Z')),
      isBestAnswer: true
    },
    {
      body: "「らしんばん」もチェックしてみてください。\n\n中古品も扱っているので、レアなグッズが見つかるかもしれません。\n\n複数店舗があるので、時間があれば回ってみることをおすすめします。",
      authorId: "collector1",
      authorName: "コレクター",
      createdAt: Timestamp.fromDate(new Date('2024-01-18T19:15:00Z')),
      isBestAnswer: false
    }
  ]
}; 