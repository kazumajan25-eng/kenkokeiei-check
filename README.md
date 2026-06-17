# 健康経営チェック&事例マップ

健康経営に取り組む企業の好事例を学び、
経済産業省の「健康経営優良法人認定制度」の評価項目に沿って自社のセルフチェックができるWebアプリです。

## 技術スタック

- React 19
- Vite 8
- デプロイ先: Cloudflare Pages（公開済み: https://kenkokeiei-check.com/）

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

## Cloudflare Pages へのデプロイ手順

### 方法1: GitHub経由（おすすめ）

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログインします
2. 「Workers & Pages」→「Create application」→「Pages」を開きます
3. 「Connect to Git」で GitHub と連携します
4. リポジトリ `kazumajan25-eng/kenkokeiei-check` を選びます
5. ビルド設定を入力します
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 「Save and Deploy」で公開します

### 独自ドメインを使う場合

1. Cloudflare Pages の `Settings` → `Custom domains` を開きます
2. 利用するドメインを入力します
3. DNS設定を Cloudflare の案内どおりに変更します
4. SSL は自動で設定されます

## ファイル構成のポイント

- `src/App.jsx` ... タブ切替の親コンポーネント（URLハッシュ連動）
- `src/main.jsx` ... Reactの起動エントリ
- `src/index.css` ... デザイントークンと全体スタイル
- `src/components/icons.jsx` ... UIで使うSVGアイコン
- `src/components/ContactFormModal.jsx` ... サイト内問い合わせフォーム
- `src/utils/contact.js` ... GoogleフォームURLと事前入力URLの共通管理
- `public/_redirects` ... Cloudflare Pages 向けのSPAリダイレクト設定

## カスタマイズ箇所

問い合わせフォームは `src/utils/contact.js` で管理しています。
事例カード・セルフチェック・フッターのCTAは、サイト内モーダルで同じGoogleフォームを開きます。

```js
const CONTACT_URL = buildContactUrl();
```
