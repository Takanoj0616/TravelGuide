export interface Spot {
  time: string;
  spotName: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
}

export interface ModelCourse {
  id: string;
  title: string;
  theme: string;
  area: '東京' | '横浜';
  duration: string;
  summary: string;
  thumbnailUrl: string;
  itinerary: Spot[];
}

export const modelCourses: ModelCourse[] = [
  {
    id: 'tokyo-anime-01',
    title: '秋葉原 アニメ・ゲーム満喫コース',
    theme: 'アニメ・ゲーム',
    area: '東京',
    duration: '約6時間',
    summary: '電気街から隠れた名店まで、秋葉原の魅力を1日で満喫する王道プランです。',
    thumbnailUrl: '/images/courses/tokyo-anime-thumb.jpg',
    itinerary: [
      {
        time: '10:00',
        spotName: '秋葉原電気街',
        description: 'まずはここからスタート。最新ガジェットやアニメグッズが揃います。',
        location: { lat: 35.7022, lng: 139.7741 },
        imageUrl: '/images/spots/akiba-denkigai.jpg',
      },
      {
        time: '12:00',
        spotName: 'お気に入りのメイドカフェでランチ',
        description: '秋葉原ならではの文化体験。非日常的な空間でランチを楽しみましょう。',
        location: { lat: 35.7015, lng: 139.7725 },
        imageUrl: '/images/spots/akiba-maidcafe.jpg',
      },
      {
        time: '14:00',
        spotName: 'ガチャポン会館',
        description: '数百台のガチャガチャがずらり。思わぬお宝が見つかるかも？',
        location: { lat: 35.7009, lng: 139.7718 },
        imageUrl: '/images/spots/akiba-gachapon.jpg',
      },
      {
        time: '16:00',
        spotName: '東京アニメセンター',
        description: 'アニメの企画展やイベントが楽しめる情報発信拠点。',
        location: { lat: 35.6986, lng: 139.7742 },
        imageUrl: '/images/spots/akiba-animecenter.jpg',
      },
    ],
  },
  {
    id: 'yokohama-history-01',
    title: '横浜 みなとみらい歴史散策コース',
    theme: '歴史・文化',
    area: '横浜',
    duration: '約5時間',
    summary: '開港の歴史を感じる建物から美しい庭園まで、横浜の魅力を一日で巡ります。',
    thumbnailUrl: '/images/courses/yokohama-history-thumb.jpg',
    itinerary: [
      {
        time: '11:00',
        spotName: '横浜赤レンガ倉庫',
        description: '歴史的な建造物でおしゃれなショッピングやグルメを楽しめます。',
        location: { lat: 35.455, lng: 139.643 },
        imageUrl: '/images/spots/yokohama-akarenga.jpg',
      },
      {
        time: '13:00',
        spotName: '横浜中華街でランチ',
        description: '世界最大級のチャイナタウンで本格中華に舌鼓。',
        location: { lat: 35.4437, lng: 139.6425 },
        imageUrl: '/images/spots/yokohama-chinatown.jpg',
      },
      {
        time: '15:00',
        spotName: '山下公園',
        description: '港の景色を眺めながらのんびり散策。氷川丸の見学もおすすめです。',
        location: { lat: 35.4468, lng: 139.6482 },
        imageUrl: '/images/spots/yokohama-yamashita.jpg',
      },
      {
        time: '16:30',
        spotName: '三溪園',
        description: '歴史的建造物が巧みに配置された広大な日本庭園。季節の花々も美しい。',
        location: { lat: 35.411, lng: 139.664 },
        imageUrl: '/images/spots/yokohama-sankeien.jpg',
      },
    ],
  },
  {
    id: 'shibuya-trend-01',
    title: '渋谷最旬スポット巡りコース',
    theme: 'トレンド・若者文化',
    area: '東京',
    duration: '約5時間',
    summary: 'ファッション、アート、グルメの最先端を体験。スクランブル交差点から話題のニュースポットまで、渋谷の今を感じるコースです。',
    thumbnailUrl: '/images/courses/shibuya-thumb.jpg',
    itinerary: [
      {
        time: '11:00',
        spotName: 'SHIBUYA SKY',
        description: '渋谷最高峰の展望台から、東京の街並みを一望。開放感あふれる空間で特別な体験を。',
        location: { lat: 35.659, lng: 139.702 },
        imageUrl: '/images/spots/shibuya-sky.jpg',
      },
      {
        time: '12:30',
        spotName: '渋谷スクランブル交差点',
        description: '世界的に有名な交差点。多くの人が行き交う光景は圧巻です。',
        location: { lat: 35.6595, lng: 139.7005 },
        imageUrl: '/images/spots/shibuya-crossing.jpg',
      },
      {
        time: '14:00',
        spotName: 'MIYASHITA PARK',
        description: '公園、商業施設、ホテルが一体となった新しいスタイルのスポット。おしゃれなカフェで一休み。',
        location: { lat: 35.662, lng: 139.701 },
        imageUrl: '/images/spots/shibuya-miyashita.jpg',
      },
    ],
  },
  {
    id: 'shinjuku-urban-01',
    title: '新宿大満喫！都会のオアシスとエンタメコース',
    theme: '都会・エンタメ',
    area: '東京',
    duration: '約7時間',
    summary: '日本一のターミナル駅、新宿の多様な魅力を1日で体験。緑豊かな公園から、眠らない街のネオンまで楽しめます。',
    thumbnailUrl: '/images/courses/shinjuku-thumb.jpg',
    itinerary: [
      {
        time: '10:00',
        spotName: '新宿御苑',
        description: '都会の喧騒を忘れさせる広大な庭園。季節ごとの自然の美しさに癒されます。',
        location: { lat: 35.685, lng: 139.71 },
        imageUrl: '/images/spots/shinjuku-gyoen.jpg',
      },
      {
        time: '13:00',
        spotName: '東京都庁展望室',
        description: '無料で楽しめる絶景スポット。地上202メートルから東京の街を一望できます。',
        location: { lat: 35.689, lng: 139.692 },
        imageUrl: '/images/spots/shinjuku-tocho.jpg',
      },
      {
        time: '15:00',
        spotName: '思い出横丁',
        description: '昭和の雰囲気が残るレトロな飲み屋街。昼から営業しているお店で軽く一杯も。',
        location: { lat: 35.693, lng: 139.699 },
        imageUrl: '/images/spots/shinjuku-omoide.jpg',
      },
      {
        time: '17:00',
        spotName: '新宿ゴールデン街',
        description: '個性的な小さなバーが密集するエリア。ディープな新宿の夜を体験。',
        location: { lat: 35.694, lng: 139.704 },
        imageUrl: '/images/spots/shinjuku-golden-gai.jpg',
      },
    ],
  },
  {
    id: 'ueno-art-01',
    title: '上野でアートと歴史に触れる一日',
    theme: 'アート・歴史',
    area: '東京',
    duration: '約6時間',
    summary: '美術館、博物館、動物園が集まる上野公園を散策。日本の文化と自然を心ゆくまで堪能できるコースです。',
    thumbnailUrl: '/images/courses/ueno-thumb.jpg',
    itinerary: [
      {
        time: '10:00',
        spotName: '上野恩賜公園',
        description: '広大な敷地内に文化施設が点在。不忍池の美しい景色も楽しめます。',
        location: { lat: 35.715, lng: 139.775 },
        imageUrl: '/images/spots/ueno-park.jpg',
      },
      {
        time: '11:00',
        spotName: '東京国立博物館',
        description: '日本の美術と考古に関する収蔵品は国内最大級。国宝や重要文化財も多数。',
        location: { lat: 35.718, lng: 139.776 },
        imageUrl: '/images/spots/ueno-museum.jpg',
      },
      {
        time: '14:00',
        spotName: 'アメヤ横丁 (アメ横)',
        description: '活気あふれる商店街。食品から雑貨まで、様々なお店が軒を連ねます。',
        location: { lat: 35.71, lng: 139.774 },
        imageUrl: '/images/spots/ueno-ameyoko.jpg',
      },
    ],
  },
  {
    id: 'asakusa-tradition-01',
    title: '浅草で下町情緒と伝統文化を味わうコース',
    theme: '伝統・文化',
    area: '東京',
    duration: '約5時間',
    summary: '東京最古のお寺、浅草寺を中心に下町の活気を体感。人力車や食べ歩きも楽しい、古き良き日本の風景がここにあります。',
    thumbnailUrl: '/images/courses/asakusa-thumb.jpg',
    itinerary: [
      {
        time: '10:00',
        spotName: '雷門と浅草寺',
        description: '浅草の象徴である雷門をくぐり、本堂へ。下町の中心で歴史を感じましょう。',
        location: { lat: 35.711, lng: 139.796 },
        imageUrl: '/images/spots/asakusa-sensoji.jpg',
      },
      {
        time: '11:30',
        spotName: '仲見世通り',
        description: '様々なお土産物屋や和菓子屋が並びます。揚げまんじゅうなどの食べ歩きが人気。',
        location: { lat: 35.712, lng: 139.796 },
        imageUrl: '/images/spots/asakusa-nakamise.jpg',
      },
      {
        time: '14:00',
        spotName: '隅田川クルーズ',
        description: '浅草から日の出桟橋まで、水上バスで東京の景色を楽しむ優雅なひととき。',
        location: { lat: 35.71, lng: 139.798 },
        imageUrl: '/images/spots/asakusa-cruise.jpg',
      },
    ],
  },
]; 