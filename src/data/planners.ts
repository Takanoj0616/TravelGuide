export interface LocalPlanner {
  id: string;
  name: string;
  avatarUrl: string;
  specialties: string[];
  introduction: string;
}

export const localPlanners: LocalPlanner[] = [
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