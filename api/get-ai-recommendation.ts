import type { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handler(
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { preferences } = request.body;

  if (!preferences) {
    return response.status(400).json({ message: 'Preferences data is missing.' });
  }

  try {
    const prompt = `
      あなたは日本の優秀な観光プランナーです。ユーザーの希望に沿って、最適な観光スポットを提案してください。

      # 指示
      - ユーザーの「希望エリア」を最優先してください。提案するスポットは、必ず「希望エリア」内、もしくは公共交通機関で30分以内に移動できる場所を選んでください。
      - 提案するスポットは、ユーザーの「興味」に合致するものにしてください。
      - 各スポットについて、以下の詳細情報も必ず含めてください：
        - 住所
        - アクセス方法（最寄り駅やバス停、徒歩何分など）
        - 公式サイトURL（なければ"なし"と記載）
        - 営業時間（例: 10:00〜18:00、年中無休 など）
        - 特徴やポイント（箇条書きで3つ以上）
        - 混雑度（例: 空いている/普通/混雑）
        - 口コミ例（実際の利用者の声を想定して1つ）
      - 提案は3つ、指定されたJSON形式で出力してください。

      # ユーザーの希望
      - 興味: ${preferences.interests}
      - 予算: ${preferences.budget}
      - 滞在日数: ${preferences.duration}
      - 希望エリア: ${preferences.location}

      # 出力形式
      {
        "recommendations": [
          {
            "title": "アクティビティや場所の名前",
            "description": "なぜこのスポットがおすすめなのか、ユーザーの興味と関連付けて具体的に説明してください。",
            "location": "具体的な場所（最寄り駅など）",
            "address": "住所",
            "access": "アクセス方法（最寄り駅やバス停、徒歩何分など）",
            "officialSite": "公式サイトURL（なければ'なし'）",
            "businessHours": "営業時間（例: 10:00〜18:00、年中無休 など）",
            "features": ["特徴やポイント1", "特徴やポイント2", "特徴やポイント3"],
            "crowdLevel": "混雑度（例: 空いている/普通/混雑）",
            "reviewExample": "口コミ例（実際の利用者の声を想定して1つ）",
            "duration": "滞在時間の目安",
            "cost": "費用の目安"
          }
        ]
      }
    `;

    // Note: The model used here is different from the original component
    // because gpt-3.5-turbo-instruct is not optimized for JSON output.
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 1.0,
    });

    const result = chatCompletion.choices[0].message.content;
    
    if (!result) {
      throw new Error('No content received from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    
    response.status(200).json(parsedResult);

  } catch (error) {
    console.error('Error calling OpenAI API for recommendations:', error);
    response.status(500).json({ message: 'Failed to get recommendations', error: (error as Error).message });
  }
}

export default handler; 