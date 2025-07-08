# TravelGuide

## セットアップ

### 環境変数の設定

1. `env.example`ファイルを`.env`にコピーしてください：
   ```bash
   cp env.example .env
   ```

2. `.env`ファイルを開いて、必要なAPIキーを設定してください：
   - `GOOGLE_PLACES_API_KEY`: Google Places APIのキー
   - `TWITTER_BEARER_TOKEN`: Twitter API v2のベアラートークン
   - `INSTAGRAM_ACCESS_TOKEN`: Instagram Basic Display APIのアクセストークン
   - その他必要に応じてAPIキーを設定

### 重要な注意事項

**⚠️ `.env`ファイルは絶対にGitにコミットしないでください！**

このファイルには機密情報が含まれており、既に`.gitignore`に追加されています。

### インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```