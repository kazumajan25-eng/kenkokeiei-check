# Cloudflare Pages 移行 指示書

> このドキュメントは、本サイトをVercelから **Cloudflare Pages** に切り替えるための指示書です。
> Codex / Claude / GitHub Copilot 等のAIアシスタントが読んで実行することを想定しています。
> 作業前に **必ず `HANDOFF.md` を一読** してください。

---

## 0. 経緯と方針

- **当初**: Vercel公開を予定していた（`vercel.json`, `index.html` のOGP URLが `kenkokeiei-check.vercel.app` を指す状態）
- **方針変更の理由**: Vercel の無料(Hobby)プランは **規約上、商用利用NG**。フロム・シェフ社の事業サイトとして使うため、Cloudflare Pages（無料・商用OK）に切り替える
- **コスト**: Cloudflare Pages は無料・商用利用可・帯域無制限・ビルド500回/月
- **独自ドメイン**: 後日 XDomain で取得し、Cloudflare に紐付ける予定（今回の作業範囲外）

---

## 1. やってもらうこと（全体像）

### Codex（AIアシスタント）側の作業
1. SPAルーティング用の `public/_redirects` を作成
2. `vercel.json` を削除（Cloudflareでは使われないため不要）
3. `index.html` のOGP URLを Cloudflare Pages 用のプレースホルダに変更
4. `README.md` のデプロイ方法説明を Cloudflare Pages に書き換え
5. `HANDOFF.md` の関連箇所を更新
6. ローカルで `npm run build` が通ることを確認
7. 上記をコミットしてGitHubに push（ユーザー承認後）

### ユーザー（人間）側の作業
1. Cloudflare アカウント作成（無料）
2. Cloudflare Pages のダッシュボードで「Create application」→「Connect to Git」
3. リポジトリ `kazumajan25-eng/kenkokeiei-check` を選択
4. ビルド設定を入力（後述）
5. デプロイ完了後、表示される `xxxxxx.pages.dev` のURLをCodexに伝える
6. Codexが index.html の og:url / og:image をその実URLに書き換える
7. 再度コミット & push → 自動再デプロイ

---

## 2. Codex への具体的なファイル変更指示

### 2-1. `public/_redirects` を新規作成

ファイルパス: `public/_redirects`

内容（1行のみ。これだけでSPAのリロード対応OK）:

```
/*    /index.html   200
```

### 2-2. `vercel.json` を削除

```bash
rm vercel.json
```

Cloudflare Pages はこのファイルを参照しないため不要。残しておくとリポジトリ内に意図不明な設定ファイルが残る形になるので削除推奨。

### 2-3. `index.html` のOGP URL更新

現状（Vercel前提）:

```html
<meta property="og:url" content="https://kenkokeiei-check.vercel.app/" />
<meta property="og:image" content="https://kenkokeiei-check.vercel.app/ogp.svg" />
<meta name="twitter:image" content="https://kenkokeiei-check.vercel.app/ogp.svg" />
```

**変更後（暫定プレースホルダ）**:

```html
<meta property="og:url" content="https://kenkokeiei-check.pages.dev/" />
<meta property="og:image" content="https://kenkokeiei-check.pages.dev/ogp.svg" />
<meta name="twitter:image" content="https://kenkokeiei-check.pages.dev/ogp.svg" />
```

> ⚠️ `kenkokeiei-check.pages.dev` はあくまで予測値。実際のURLは Cloudflare の自動生成によって異なる可能性があります。ユーザーが実URLを伝えてきたら、その値で再度書き換えてください。

### 2-4. `README.md` のデプロイ説明を書き換え

`## Vercelへのデプロイ手順` セクションを以下に差し替え:

```markdown
## Cloudflare Pages へのデプロイ手順

### 方法1: GitHub経由（おすすめ）

1. https://dash.cloudflare.com/ にログイン（無料アカウント作成）
2. 左メニューから「Workers & Pages」→「Create application」→「Pages」タブ
3. 「Connect to Git」→ GitHubと連携
4. リポジトリ `kazumajan25-eng/kenkokeiei-check` を選択
5. ビルド設定:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 「Save and Deploy」を押すと数分で公開
7. デフォルトドメイン `xxx.pages.dev` でアクセス可能

### 独自ドメインを使う場合

1. Cloudflare Pages の Settings → Custom domains
2. 取得済みのドメインを入力
3. DNS設定を Cloudflare の指示通りに変更（XDomainの場合はXDomain側で）
4. 数時間でSSL自動設定・反映
```

### 2-5. `HANDOFF.md` の更新

セクション 0「最新ステータス」内、Vercel関連の記述を Cloudflare Pages に修正:

- 「Vercel に本番デプロイ」→「Cloudflare Pages に本番デプロイ」
- 「ホスティング | Vercel（設定済・未デプロイ）」→「ホスティング | Cloudflare Pages（移行中）」

セクション 9「ローカル起動・ビルド・デプロイ」内のVercel CLIコマンドを以下に置き換え:

```bash
# Cloudflare Pages はGitHub連携で自動デプロイされるため
# 通常はローカルコマンド不要。確認用ローカルビルドは下記:
npm run build           # dist/ に出力
npx wrangler pages dev dist  # ローカルでCloudflare Pages相当のプレビュー（任意）
```

---

## 3. 動作確認

すべての変更後、以下を実行してエラーがないこと確認:

```bash
cd ~/Desktop/kenkokeiei-check
npm run build
```

成功すれば `dist/` フォルダに以下が生成されているはず:
- `dist/index.html`（更新したOGPタグ入り）
- `dist/_redirects`（SPA用リダイレクト）
- `dist/assets/*.js`, `dist/assets/*.css`

---

## 4. コミット & Push

ユーザーに以下のメッセージで確認:

> Cloudflare Pages 移行のための4ファイル変更が完了しました。
> コミット&pushしてよいですか？
> - 追加: public/_redirects
> - 削除: vercel.json
> - 修正: index.html (OGP URLをpages.devに)
> - 修正: README.md (デプロイ手順)
> - 修正: HANDOFF.md (Vercel→Cloudflare)

承認後、以下のコミットメッセージで:

```
Vercel から Cloudflare Pages へホスティング切替

- public/_redirects 追加（SPA向けリダイレクト）
- vercel.json 削除（Cloudflare Pagesでは不要）
- index.html の OGP URL を pages.dev に変更
- README.md と HANDOFF.md のデプロイ説明を Cloudflare Pages 用に更新

理由: Vercel の Hobby プランは商用利用NG のため、
無料で商用利用可能な Cloudflare Pages に切替
```

---

## 5. デプロイ後の最終仕上げ（ユーザー作業後）

ユーザーが Cloudflare で公開し、実URLを伝えてきたら:

1. `index.html` の `og:url` と `og:image` を実URLに書き換え
2. `HANDOFF.md` の「最新ステータス」に公開URL を追記
3. コミット & push（コミットメッセージ例: `公開URLを Cloudflare の実URLに更新`）

これで完成。プレスリリースに掲載するURLも確定。

---

## 6. 注意事項

- **環境変数は今のところ不要**（バックエンドAPIを呼んでいないため）
- **ビルド時のNode バージョン**: Cloudflare Pages はデフォルトでNode 18系。問題があれば `package.json` に `"engines": { "node": ">=18" }` を追加可能だが、現状の依存関係なら明示不要
- **`favicon.svg` は既存のViteデフォルト**: ユーザー要望があれば差し替え
- **`ogp.svg` はまだ存在しない**: プレースホルダURLになっているが、後日作成してアップロード予定。それまでSNSシェア時の画像は表示されない可能性あり
