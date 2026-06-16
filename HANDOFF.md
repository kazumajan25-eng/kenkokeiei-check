# 引き継ぎドキュメント (Handoff)

> このドキュメントは、本プロジェクトを別のAIアシスタント（Codex / ChatGPT / GitHub Copilot 等）に引き継ぐためのものです。
> このファイルを **必ず最初に読んで** から作業してください。

---

## 🆕 0. 最新ステータス (2026-06-15 更新)

### いま、ここまで進んでいます

- ✅ Cloudflare Pages 本番公開済み: https://kenkokeiei-check.com/
- ✅ Cloudflare Pages 既定URL: https://kenkokeiei-check.pages.dev/
- ✅ 旧Vercel公開URL: https://kenkokeiei-check.vercel.app/
- ✅ 問い合わせ導線は Googleフォームに変更済み（フッター等のCTAから新しいタブで開く）
- ✅ index.html に OGP メタタグ設定済み（public/ogp.svg あり）
- ✅ **デザイン全面刷新が完了（Claude Code実施・コミット済み）**
- ✅ Cloudflare Pages 移行用のファイル変更を実施（`public/_redirects` / OGP / README / HANDOFF 更新）
- ✅ Cloudflare Pages の実URLが確定（仮設定の OGP URL と一致）
- ✅ GA4計測を追加（測定ID: `G-YNLM7T710T`。ページ表示・セルフチェック完了・問い合わせクリック等をイベント送信）
- ✅ セルフチェックを大規模法人部門 / 中小規模法人部門で分岐（業種・従業員数で判定）
- ✅ Google検索登録用に `public/sitemap.xml` / `public/robots.txt` を追加
- ⏸️ プレスリリース（PR TIMES）を近日発出予定

### ✅ デザイン刷新の反映内容（2026-06-15・Claude Code実施）

デザイン改修は **GitHub に commit / push 済み** です。
今後この周辺を触るときは、以下の変更を前提として作業してください。

変更内容（機能・データの意味は一切変えていない）:

- `src/index.css` — CSS変数によるデザイントークン（紺＋ティール＋グレー階調）
- `src/components/icons.jsx` — **新規**。絵文字を置き換えた線画SVGアイコン集
- `src/components/Header.jsx` — 運営者表記追加・アンダーライン式タブ
- `src/components/Footer.jsx` — 会社情報の段を追加（CONTACT_URLは実メールのまま維持）
- `src/components/CaseSearch.jsx` — 業種大分類フィルタ・選択中条件チップ・「⑰1」表示バグ修正・カードCTAを1個に整理
- `src/components/SelfCheck.jsx` — 必須バッジ2種分離・ドーナツグラフ・未回答ジャンプ
- `src/data/cases.js` — 末尾に業種大分類マップを**追記**（既存27社データは無変更）
- `src/App.jsx` — URLハッシュ連動のタブ切替（#cases / #check）

`npm run build` 成功・PC/モバイル表示確認済み。
**次の作業**: Cloudflare 公開後の最終表示確認 → プレスリリースへ公開URL差し込み → 必要なら独自ドメイン設定。

### デザイン刷新後のルール（重要）

- 色は CSS変数（`src/index.css` の `--navy-*` / `--teal-*` / `--ink-*` 等)を使う。直接カラーコードを書かない
- アイコンは `src/components/icons.jsx` から import。**絵文字をUIに使わない**
- ティール（teal）は「フロム・シェフ対応可」とCTA専用のアクセント色
- `categories.js` の `color` / `icon`（絵文字）フィールドはデータとして残っているが**UIでは未使用**。削除も使用再開もしない
- 業種の絞り込みは `cases.js` 末尾の `INDUSTRY_CATEGORY_BY_CASE`（大分類）を使用。事例を追加したらこのマップにも必ず追加する

### 並行進行中: プレスリリース

- 既存案ファイル: `~/Desktop/フロム・シェフ資料/10_【各法人別資料】/260606_PR TIMES プレスリリース案.docx`
- Claude側で編集案を提案済み（タイトル・新セクション・今後について）
- 掲載URL: https://kenkokeiei-check.com/

### Codex Desktop 利用時の注意

- ChatGPT アカウント版の Codex Desktop では **`gpt-5.4` モデルは利用不可**
  - エラー: `The 'gpt-5.4' model is not supported when using Codex with a ChatGPT account.`
  - **対処**: 画面右下のモデル選択を「中（Medium）」など別のものに切り替えてから再送信
- 利用環境: macOS, Node v24, npm 11

---

## 1. プロジェクト概要

| 項目 | 内容 |
|---|---|
| 名前 | kenkokeiei-check |
| 目的 | 健康経営の好事例検索とセルフチェックができるガイドサイト |
| 想定運営 | 株式会社フロム・シェフ |
| 利用者 | 認定取得を目指す企業の担当者 |
| 機能 | (1) 認定企業の取り組み事例検索 (2) 自社のセルフチェック |
| ホスティング | Cloudflare Pages（公開済: https://kenkokeiei-check.com/ ） |
| リポジトリ | https://github.com/kazumajan25-eng/kenkokeiei-check |

---

## 2. 技術スタック

- **Vite 8 + React 19**（JavaScript、TypeScriptは未使用）
- 状態管理: React の `useState` のみ（Redux/Zustand等の外部ライブラリなし）
- スタイル: **インラインstyle**（CSS Modules / styled-components 等は未使用）
- データ: 静的JSファイル（`src/data/categories.js`, `src/data/cases.js`）
- バックエンドなし（Supabase等はPhase 2で導入予定）
- Node.js: v24.x で動作確認済み

---

## 3. ファイル構成

```
kenkokeiei-check/
├── HANDOFF.md              # 本ファイル
├── README.md
├── package.json
├── vite.config.js
├── MIGRATION_TO_CLOUDFLARE.md  # Cloudflare Pages移行手順
├── index.html              # title・description・OGP設定
├── public/
│   ├── _redirects          # Cloudflare Pages向けSPAリダイレクト
│   └── ogp.svg             # OGP仮画像
└── src/
    ├── App.jsx             # タブ切替の親コンポーネント（URLハッシュ連動）
    ├── main.jsx
    ├── index.css           # デザイントークンと全体スタイル
    ├── data/
    │   ├── categories.js   # 公式評価項目データ（29項目）
    │   └── cases.js        # 認定企業の取り組み事例（27社）
    └── components/
        ├── Header.jsx      # 共通ヘッダー（タブ切替）
        ├── Footer.jsx      # 共通フッター（CTA）
        ├── SelfCheck.jsx   # セルフチェック画面
        ├── CaseSearch.jsx  # 事例検索画面
        └── icons.jsx       # SVGアイコン
```

---

## 4. 主要な設計判断（Decision Log）

### 4-1. 評価項目は経産省公式に準拠
- 大項目5つ × 評価項目28（公式）+ 1（独自）= **全29項目**
- 出所: 経済産業省「健康経営優良法人2026 認定要件」
  https://www.meti.go.jp/policy/mono_info_service/healthcare/kenkoukeiei_yuryouhouzin.html
- **項目4-2「健康白書の作成・公開」だけは弊社独自の推奨項目** （公式の評価項目ではない）

### 4-2. フロム・シェフ対応可項目は12項目に厳選
ユーザー（フロム・シェフ）の指定により以下の12項目のみ `canSupport: true`:

| ID | 評価項目 | サービス名 |
|---|---|---|
| 1-1 | 健康経営の方針等の社内外への発信 | 健康宣言の作成・発信支援・健康白書作成サポート |
| 2-2 | 経営レベル会議での議題・決定 | 業務サポート |
| 3-5 | 教育機会の設定 | 各種研修を実施 |
| 3-6 | 働き方・両立支援 | 各種研修実施やアンケート調査でサポート |
| 3-8 | がん等両立支援 | 業務サポート |
| 3-9 | 女性の健康 | 女性の健康に関する研修を実施 |
| 3-12 | 食生活改善 | 業務サポート |
| 3-13 | 運動機会増進 | 各種研修や体力測定を実施 |
| 3-15 | 心の健康 | 睡眠とメンタルヘルスの研修を実施 |
| 3-17 | 喫煙率低下 | 喫煙率減少のための研修を実施 |
| 4-1 | 効果検証 | 効果検証・健康白書作成を実施 |
| 4-2 | 健康白書の作成・公開（推奨） | 健康白書作成サポート |

⚠️ **`canSupport` の追加/削除はユーザー（フロム・シェフ）に確認なしに変更しないこと**

### 4-3. データ管理方針
- 事例データは `.js` ファイルで手動管理（現Phase 1）
- Phase 2 で Supabase 導入予定（管理画面で事例追加可能に）
- 各事例には必ず `sourceUrl` と `sourceName` を含めること（著作権・出典明示のため）

### 4-4. スタイル方針
- 基本はインラインstyleで統一（CSS Modulesやstyled-componentsへの移行はユーザー要望時のみ）
- 色は `src/index.css` の CSS変数（`--navy-*` / `--teal-*` / `--ink-*` 等）を使う
- UIのアイコンは `src/components/icons.jsx` のSVGアイコンを使い、絵文字は使わない
- ティールは「フロム・シェフ対応可」と CTA のアクセント用に限定
- 日本語フォント: `Hiragino Kaku Gothic ProN`, `Meiryo`

### 4-5. 問い合わせ導線は本番値
- 現状: Googleフォーム
- 場所: `src/components/Footer.jsx` の `CONTACT_FORM_URL` / `buildContactUrl`
- フッターなど汎用CTAはパラメータなし、事例・セルフチェックCTAは「気になった項目・事例」欄に事前入力する
- **ユーザー確認なしにフォームURLや事前入力項目を変更しないこと**

### 4-6. セルフチェックは法人規模別に分岐
- 場所: `src/data/selfCheckCriteria.js`
- 大規模法人部門: `kk2026sample_dai.pdf` p5 の認定要件を基準
- 中小規模法人部門: `kk2026sample_chu.pdf` p9 の認定要件を基準
- 部門区分: `kk2026sample_chu.pdf` p6 の業種・従業員数表を基準
- 小規模事業者向け特例は、ユーザー指示により本セルフチェックでは扱わない
- 資本金によって申請部門を選べるケースはあるが、本セルフチェックでは従業員数の目安で判定する
- `src/data/categories.js` の既存評価項目と `canSupport` 本体は変更しない

---

## 5. データソース（事例27社）

| # | 会社 | 業種 | URL |
|---|---|---|---|
| 1 | 大同特殊鋼 | 特殊鋼製造 | daido.co.jp |
| 2 | 大王製紙 | 製紙 | daio-paper.co.jp |
| 3 | SUMCO | 半導体 | sumcosi.com |
| 4 | 正興電機製作所 | 電機 | seiko-denki.co.jp |
| 5 | DNP | 印刷・情報通信 | global.dnp |
| 6 | 双日 | 総合商社 | sojitz.com |
| 7 | 丸井グループ | 小売・FinTech | 0101maruigroup.co.jp |
| 8 | コーナン商事 | HC | hc-kohnan.com |
| 9 | SCSK | IT | scsk.jp |
| 10 | 花王 | 化学・日用品 | kao.com |
| 11 | ロート製薬 | 製薬 | rohto.co.jp |
| 12 | キリンHD | 飲料 | kirinholdings.com |
| 13 | SOMPO HD | 保険 | sompo-hd.com |
| 14 | TOTO | 住宅設備 | jp.toto.com |
| 15 | H.U.グループ | 医療検査 | hugp.com |
| 16 | 大東建託パートナーズ | 不動産 | kentaku-partners.co.jp |
| 17 | 第一工業製薬 | 化学 | dks-web.co.jp |
| 18 | 古野電気 | 舶用機器 | furuno.co.jp |
| 19 | 清原 | 服飾資材 | kiyohara.co.jp |
| 20 | 日本国土開発 | 建設 | n-kokudo.co.jp |
| 21 | ニッタ | 製造 | nittagroup.com |
| 22 | タニタ | 健康機器 | tanita.co.jp |
| 23 | トーエネック | 設備工事 | toenec.co.jp |
| 24 | 高舘組 | 建設 | takadategumi.co.jp |
| 25 | 太陽工業 | 膜構造 | taiyokogyo.co.jp |
| 26 | リーフワークス | IT | leafworks.jp |
| 27 | 京応 | 保険代理・Web | keio-web.com |

---

## 6. 完了済み（Done）

- [x] Viteプロジェクト雛形
- [x] タブUI（事例検索／セルフチェック）
- [x] 公式29評価項目の構造化（categories.js）
- [x] 27社の事例データ収集・評価項目IDへのマッピング
- [x] 事例検索UI（業種フィルタ・評価項目絞り込み・フロム・シェフ対応可絞り込み・テキスト検索）
- [x] セルフチェックUI（29項目対応、結果画面のCTA、進捗バー）
- [x] 共通フッターCTA
- [x] フロム・シェフ対応可項目を12項目に整理
- [x] 健康白書の作成・公開（4-2）を独自項目として追加
- [x] GitHub リポジトリ作成・push（初回コミット）
- [x] Vercel 本番公開
- [x] CONTACT_URL を実運用メールに変更
- [x] OGPメタタグと `public/ogp.svg` を追加
- [x] デザイン全面刷新（コミット・push済み）
- [x] Cloudflare Pages 移行用のファイル変更
- [x] Cloudflare Pages 本番公開

---

## 7. TODO（未完了 / 優先度順）

### 🔴 短期（Phase 1完成までに）

- [x] デザイン刷新 + Cloudflare移行準備の差分をコミット & push
- [ ] Cloudflare Pages 公開後の実機表示確認
- [ ] サントリー・ANA など取得失敗企業の手動追加（テキストを手で入力）
- [ ] 花王・ロート製薬の事例データ補完（initiatives が薄い）
- [ ] モバイル表示の細かい確認・調整
- [ ] favicon を適切なものに変更

### 🟡 中期（Phase 2）

- [ ] **Supabase導入**（事例DB化・管理画面）
- [ ] 事例数を50〜100社に拡大
- [ ] セルフチェック結果の保存機能（メール送信 or URL共有）
- [ ] 業種フィルタの複数選択化
- [ ] カテゴリ別スコアのレーダーチャート表示

### 🟢 長期（Phase 3）

- [ ] 健康白書のテンプレ自動生成
- [ ] PDF出力（セルフチェック結果・サポート可項目レポート）
- [ ] フロム・シェフ社内のCRM連携
- [ ] アクセス解析（よく検索される項目の可視化）

---

## 8. 既知の問題・注意点

- **サントリー公式サイトは bot 拒否（HTTP 403）** で WebFetch 不可
- **経産省の事例集PDF**（meigara2024_report.pdf, jirei2025.pdf）は WebFetch でテキスト抽出不可
  - 解決策: ローカルにダウンロード→poppler-utils 等で処理、または手動抽出
- 花王・ロート製薬は概要ページしか取れず、initiatives が他社より薄い
- 中項目「3- 中項目」は categories.js では item の `midCategory` フィールドで持っているが、UIでは subCategoryと連結して小さく表示する程度（強調表示はしていない）

---

## 9. ローカル起動・ビルド・デプロイ

```bash
# 初回のみ
cd ~/Desktop/kenkokeiei-check
npm install

# 開発サーバ起動 (http://localhost:5173)
npm run dev

# 本番ビルド確認
npm run build

# Cloudflare Pages は GitHub 連携で自動デプロイ
npm run build

# 任意: Cloudflare Pages 相当のローカル確認
npx wrangler pages dev dist
```

---

## 10. Codex/ChatGPT/Copilot への引き継ぎプロンプト例

以下のテキストを引き継ぎ先のAIに最初に渡してください:

```
このリポジトリは健康経営の好事例検索とセルフチェックができるガイドサイトです。
Vite + React (JavaScript) で構築されており、TypeScriptは未使用です。

GitHub: https://github.com/kazumajan25-eng/kenkokeiei-check

作業を始める前に、必ずリポジトリ直下の HANDOFF.md を熟読してください。
特に以下に注意してください:

1. 評価項目 (src/data/categories.js) は経産省公式に準拠している
   - ただし「4-2 健康白書の作成・公開」だけは弊社独自の追加項目
   - canSupport フィールドの値はユーザー（フロム・シェフ）が厳密に定義済み
     勝手に true/false を変更しないこと

2. 事例データ (src/data/cases.js) は各企業の公式サイトを出典としており、
   各事例に sourceUrl と sourceName を必ず含めること（出典明示）

3. CONTACT_URL は本番の値（k.aoi@fromsheff-howsports.co.jp）が設定済み
   - ユーザー確認なしに変更しないこと

4. デザイン刷新後は src/index.css のCSS変数と
   src/components/icons.jsx のSVGアイコンを使う
   - UIで絵文字を使わないこと

5. ユーザーは非エンジニアです。専門用語を避け日本語でわかりやすく
   説明してください。返答も日本語でお願いします。

今回の依頼内容: 【ここに依頼内容を書く】
```

---

## 11. 過去の作業ログ（参考）

- 初期構想: 当初はセルフチェック単体だったが、ユーザー判断で
  「事例検索DBをメインに、セルフチェックは別タブ」の構成に変更
- データ収集: ユーザー提供の26URLから27社抽出（うちサントリーとANAは取得失敗）
- フロム・シェフ対応可マッピング: 当初はclaudeが推定で設定 → ユーザー指定により12項目に再整理
