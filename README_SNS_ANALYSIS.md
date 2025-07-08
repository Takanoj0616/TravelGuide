# SNS・レビューサイトのリアルタイム解析機能

## 概要

この機能は、SNSやレビューサイトの情報をリアルタイムで解析し、観光地やレストランなどの混雑状況を自動判定するシステムです。

## 実装ステップ

### 1. データソースの選定とAPI調査 ✅

**対応データソース：**
- **Google Places API** - レビューと混雑状況
- **Twitter API v2** - リアルタイム投稿
- **Instagram Basic Display API** - 写真投稿
- **LINE API** - 位置情報ベースの投稿（オプション）
- **ぐるなびAPI** - 飲食店情報（オプション）
- **食べログAPI** - レストラン情報（オプション）

### 2. バックエンドAPIの実装 ✅

**実装済みファイル：**
- `api/api/social-crowd-analyzer.ts` - メインの解析ロジック
- `api/scheduler.ts` - 定期的なデータ更新スケジューラー
- `api/index.ts` - APIエンドポイントの追加

**APIエンドポイント：**
- `GET /api/crowd-analysis/:location` - 特定の場所の混雑状況を取得
- `GET /api/crowd-analysis?lat=&lng=&radius=` - 座標ベースで混雑状況を取得
- `GET /api/scheduler/status` - スケジューラーの状態を取得
- `POST /api/scheduler/start` - スケジューラーを開始
- `POST /api/scheduler/stop` - スケジューラーを停止
- `POST /api/scheduler/update` - 手動でデータを更新

### 3. フロントエンドの実装 ✅

**実装済みコンポーネント：**
- `src/components/CrowdStatus.tsx` - リアルタイム混雑状況表示
- `src/components/SchedulerManagement.tsx` - スケジューラー管理画面

### 4. 環境変数の設定 ✅

**必要なAPIキー：**
```bash
# Google Places API
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Twitter API v2
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# Instagram Basic Display API
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

# その他のオプションAPI
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
GURUNAVI_API_KEY=your_gurunavi_api_key_here
TABELOG_API_KEY=your_tabelog_api_key_here
```

## 使用方法

### 1. 環境設定

1. `env.example` を `.env` にコピー
2. 必要なAPIキーを設定
3. サーバーを起動

```bash
cp env.example .env
# .envファイルを編集してAPIキーを設定
npm run dev
```

### 2. リアルタイム混雑状況の表示

```tsx
import CrowdStatus from './components/CrowdStatus';

// 特定の場所の混雑状況を表示
<CrowdStatus location="Tokyo Tower" />

// 現在地の混雑状況を表示
<CrowdStatus lat={35.6762} lng={139.6503} />

// 自動更新を有効化
<CrowdStatus location="Shibuya Crossing" autoRefresh={true} />
```

### 3. スケジューラーの管理

```tsx
import SchedulerManagement from './components/SchedulerManagement';

// スケジューラー管理画面を表示
<SchedulerManagement />
```

## 機能詳細

### AI解析アルゴリズム

1. **Google Places データ分析**
   - 評価スコア（4.0以上で高混雑判定）
   - レビュー数（100以上で信頼度向上）
   - レビュー内容のキーワード分析（「混雑」「crowded」など）

2. **Twitter データ分析**
   - 場所に関連するツイート数
   - 投稿頻度による混雑度推定

3. **Instagram データ分析**
   - 場所に関連する投稿数
   - 写真投稿の頻度分析

4. **統合分析**
   - 各データソースの重み付け
   - 信頼度スコアの計算
   - 最終的な混雑度判定

### 混雑度レベル

- **low** (空いている) - 緑色
- **medium** (やや混雑) - 黄色
- **high** (混雑) - オレンジ色
- **very_high** (大混雑) - 赤色

## 今後の拡張予定

### 1. 追加データソース
- **LINE位置情報API** - より詳細な位置情報
- **ぐるなびAPI** - 飲食店特化の情報
- **食べログAPI** - レストラン評価
- **Google Trends** - 検索トレンド分析

### 2. 高度なAI機能
- **自然言語処理** - レビュー内容の詳細分析
- **画像認識** - 写真から混雑状況を判定
- **時系列分析** - 時間帯別の混雑パターン予測
- **機械学習** - 過去データからの学習

### 3. リアルタイム機能
- **WebSocket** - リアルタイムデータ配信
- **プッシュ通知** - 混雑状況の変化通知
- **地図連携** - 地図上での混雑状況表示

### 4. データベース統合
- **PostgreSQL** - 履歴データの保存
- **Redis** - キャッシュ機能
- **Elasticsearch** - 全文検索機能

## トラブルシューティング

### よくある問題

1. **APIキーエラー**
   - 環境変数が正しく設定されているか確認
   - APIキーの権限設定を確認

2. **データが取得できない**
   - ネットワーク接続を確認
   - APIの利用制限に達していないか確認

3. **スケジューラーが動作しない**
   - サーバーのログを確認
   - 手動更新でテスト

### ログの確認

```bash
# APIサーバーのログを確認
npm run dev

# スケジューラーの状態を確認
curl http://localhost:3001/api/scheduler/status
```

## セキュリティ考慮事項

1. **APIキーの管理**
   - 環境変数での管理
   - 本番環境での暗号化

2. **レート制限**
   - API呼び出しの制限
   - エラーハンドリング

3. **データプライバシー**
   - 個人情報の取り扱い
   - GDPR準拠

## パフォーマンス最適化

1. **キャッシュ機能**
   - Redis によるキャッシュ
   - データの有効期限設定

2. **並行処理**
   - 複数APIの並行呼び出し
   - 非同期処理の最適化

3. **データベース最適化**
   - インデックスの設定
   - クエリの最適化 