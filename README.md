# 健康経営優良法人2026 認定セルフチェック

経済産業省の「健康経営優良法人認定制度」の評価項目に基づき、自社の取り組み状況をセルフチェックできるWebアプリです。

## 技術スタック

- React 19
- Vite 8
- デプロイ先: Vercel

## ローカルでの動かし方

```bash
# 依存パッケージのインストール（初回のみ）
npm install

# 開発サーバ起動（ http://localhost:5173 が開きます ）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## Vercelへのデプロイ手順

### 方法1: GitHub経由（おすすめ）

1. このフォルダをGitHubのリポジトリにアップロード
2. [Vercel](https://vercel.com/) にログインし「Add New Project」
3. 上記リポジトリを選択して「Deploy」を押すだけ
   - フレームワークは自動で「Vite」と認識されます

### 方法2: Vercel CLI を使う場合

```bash
# 初回のみVercel CLIをインストール
npm install -g vercel

# このフォルダ内で実行
vercel        # 初回はプレビューデプロイ
vercel --prod # 本番公開
```

## ファイル構成のポイント

- `src/App.jsx` ... 画面の本体（セルフチェックのロジックと表示）
- `src/main.jsx` ... Reactの起動エントリ
- `src/index.css` ... 最低限のリセットCSSのみ
- `vercel.json` ... Vercel向けの設定（SPAのリロード対応）

## カスタマイズ箇所

`src/App.jsx` 内の以下の定数を、実際の用途に合わせて変更してください。

```js
const CONTACT_URL = "mailto:info@example.com"; // 問い合わせ先メールアドレス
```
