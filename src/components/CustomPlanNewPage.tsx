import React from 'react';

const CustomPlanNewPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-4">新規相談</h1>
      <p className="mb-8 text-gray-600">旅行プランの相談を新規で開始します。ご希望の内容を入力してください。</p>
      {/* ここに相談フォームなどを追加予定 */}
      <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
        相談フォームは今後追加予定です。
      </div>
    </div>
  );
};

export default CustomPlanNewPage; 