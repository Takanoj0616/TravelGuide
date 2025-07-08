// Vercel Serverless Function
import type { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';

// OpenAIのクライアントを初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handler(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.log(`[${new Date().toISOString()}] Received request for /api/generate-route`);

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { itinerary } = request.body;

  if (!itinerary || !Array.isArray(itinerary) || itinerary.length === 0) {
    return response.status(400).json({ message: 'Itinerary data is missing or invalid.' });
  }
  
  console.log('Received itinerary:', JSON.stringify(itinerary, null, 2));

  try {
    const spotNames = itinerary.map(spot => spot.name).join('、');
    const firstSpotName = itinerary[0].name;

    const prompt = `
      あなたはプロの旅行プランナーです。以下の条件に従って、日本の旅行プランを作成してください。

      # 条件
      - 訪れる場所: ${spotNames}
      - 出発点: ${firstSpotName}
      - 移動手段: 主に公共交通機関（電車、バス）を利用
      - 出力形式: JSON

      # 作成する旅行プランの詳細
      1.  **optimal_route**: 巡回セールスマン問題のように、全スポットを効率的に回るための最適な順番のリスト。各ステップにはスポット名と簡単な説明（なぜその順番なのか）を含める。
      2.  **transportation_details**: 各スポット間の移動手段と、予想される所要時間の詳細。
      3.  **recommendations**: ルートの途中で立ち寄れるおすすめのランチスポットやカフェ、隠れた名所などを3つ提案する。各提案には名前、カテゴリ、短い説明を含める。

      # JSONフォーマットの例
      {
        "title": "東京満喫の旅",
        "optimal_route": [
          { "spot_name": "東京駅", "order_reason": "旅の起点として便利。" },
          { "spot_name": "築地市場", "order_reason": "朝食を楽しむため、午前中の訪問が最適。" }
        ],
        "transportation_details": [
          { "from": "東京駅", "to": "築地市場", "method": "電車（東京メトロ日比谷線）", "duration_minutes": 15 }
        ],
        "recommendations": [
          { "name": "寿司大", "category": "ランチ", "description": "新鮮なネタが自慢の寿司屋です。" }
        ]
      }
    `;

    console.log('Sending prompt to OpenAI...');
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
    });
    
    const result = chatCompletion.choices[0].message.content;
    console.log('Received result from OpenAI:', result);
    
    if (!result) {
      throw new Error('No content received from OpenAI');
    }

    const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
    
    response.status(200).json(parsedResult);

  } catch (error) {
    console.error('Error in /api/generate-route:', error);
    response.status(500).json({ message: 'Failed to generate itinerary', error: (error as Error).message });
  }
}

export default handler; 