// ============================================================
// 健康経営優良法人2026 公式評価項目データ
// 出所: 経済産業省「健康経営優良法人2026 認定要件（評価項目）」
// https://www.meti.go.jp/policy/mono_info_service/healthcare/kenkoukeiei_yuryouhouzin.html
// ============================================================
//
// 構造:
//   CATEGORIES (大項目: 全5項目)
//     └ items (評価項目: 全29項目 ※4-2「健康白書の作成・公開」のみ
//              公式認定要件にはない弊社独自の追加項目)
//          - midCategory : 中項目（大項目3のみ存在）
//          - subCategory : 小項目（公式表の「小項目」列）
//          - text        : 評価項目（公式表の「評価項目」列。利用者に見える文章）
//          - selectableNo: ①〜⑰の番号（選択項目のみ。必須項目は null）
//          - requiredLarge   : 大規模法人で必須かどうか
//          - requiredWhite500: 健康経営銘柄・ホワイト500で必須かどうか
//          - canSupport      : フロム・シェフでサポート可能かどうか
//          - supportLabel    : 対応可能なフロム・シェフのサービス名
//          - hint            : 各項目の説明補足
// ============================================================

export const CATEGORIES = [
  // --------------------------------------------------------
  // 大項目1: 経営理念・方針
  // --------------------------------------------------------
  {
    id: "cat1",
    label: "経営理念・方針",
    icon: "🏢",
    color: "#1A3A5C",
    items: [
      {
        id: "1-1",
        midCategory: null,
        subCategory: "健康経営の戦略、社内外への情報開示",
        text: "健康経営の方針等の社内外への発信",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: true,
        supportLabel: "健康宣言の作成・発信支援・健康白書作成サポート",
        hint: "健康経営の方針を文書化し、自社HPや統合報告書等で社内外に発信していることが必要です。",
      },
      {
        id: "1-2",
        midCategory: null,
        subCategory: "健康経営の戦略、社内外への情報開示",
        text: "健康経営の推進方針の浸透",
        selectableNo: null,
        requiredLarge: false,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "経営層から従業員まで方針を浸透させる仕組み（社内報、研修、朝礼等での発信）が求められます。",
      },
      {
        id: "1-3",
        midCategory: null,
        subCategory: "健康経営の戦略、社内外への情報開示",
        text: "従業員パフォーマンス指標及び測定方法の開示",
        selectableNo: null,
        requiredLarge: false,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "プレゼンティーズム・アブセンティーズム・ワークエンゲージメント等の指標と測定方法の開示が求められます。",
      },
      {
        id: "1-4",
        midCategory: null,
        subCategory: "自社従業員を超えた健康増進に関する取り組み",
        text: "トップランナーとして健康経営の普及に取り組んでいること",
        selectableNo: 1,
        requiredLarge: false,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "取引先・地域・業界などへの普及啓発活動の実施が評価されます。",
      },
    ],
  },

  // --------------------------------------------------------
  // 大項目2: 組織体制
  // --------------------------------------------------------
  {
    id: "cat2",
    label: "組織体制",
    icon: "🤝",
    color: "#0F6E56",
    items: [
      {
        id: "2-1",
        midCategory: null,
        subCategory: "経営層の体制",
        text: "健康づくり責任者が役員以上",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "健康経営の責任者を役員以上の役職に任命する体制が必要です。",
      },
      {
        id: "2-2",
        midCategory: null,
        subCategory: "経営層の体制",
        text: "健康経営推進に関する経営レベルの会議での議題・決定",
        selectableNo: null,
        requiredLarge: false,
        requiredWhite500: true,
        canSupport: true,
        supportLabel: "業務サポート",
        hint: "取締役会や経営会議で健康経営の議題・決定がなされていることが求められます。",
      },
      {
        id: "2-3",
        midCategory: null,
        subCategory: "実施体制",
        text: "産業医・保健師の関与",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "施策の立案・実施・評価に産業医・保健師が関与していることが必要です。",
      },
      {
        id: "2-4",
        midCategory: null,
        subCategory: "健保組合等保険者との連携",
        text: "健保組合等保険者との協議・連携",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "加入する健康保険組合等との協議・連携した保健事業が必要です。",
      },
    ],
  },

  // --------------------------------------------------------
  // 大項目3: 制度・施策実行
  // --------------------------------------------------------
  {
    id: "cat3",
    label: "制度・施策実行",
    icon: "🎯",
    color: "#2563EB",
    items: [
      // 中項目: 従業員の健康課題の把握と必要な対策の検討
      {
        id: "3-1",
        midCategory: "従業員の健康課題の把握と必要な対策の検討",
        subCategory: "健康課題に基づいた具体的な目標の設定",
        text: "健康経営の具体的な推進計画",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "課題分析→目標設定→施策→効果検証のPDCAサイクルに基づく推進計画が必要です。",
      },
      {
        id: "3-2",
        midCategory: "従業員の健康課題の把握と必要な対策の検討",
        subCategory: "健診・検診等の活用・推進",
        text: "従業員の健康診断の実施（受診率100%）",
        selectableNo: 2,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "全従業員の健康診断受診率100%が求められます。",
      },
      {
        id: "3-3",
        midCategory: "従業員の健康課題の把握と必要な対策の検討",
        subCategory: "健診・検診等の活用・推進",
        text: "受診勧奨に関する取り組み",
        selectableNo: 3,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "健診結果に基づいた個別フォローや精密検査の受診勧奨の仕組みが必要です。",
      },
      {
        id: "3-4",
        midCategory: "従業員の健康課題の把握と必要な対策の検討",
        subCategory: "健診・検診等の活用・推進",
        text: "50人未満の事業場におけるストレスチェックの実施",
        selectableNo: 4,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "50人未満は努力義務ですが、実施することで加点評価を受けられます。",
      },
      // 中項目: 健康経営の実践に向けた土台づくり
      {
        id: "3-5",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "ヘルスリテラシーの向上",
        text: "管理職または従業員に対する教育機会の設定",
        selectableNo: 5,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "各種研修を実施",
        hint: "健康保持・増進に関する教育（セミナー・eラーニング等）の機会設定が求められます。参加率の測定も重要です。",
      },
      {
        id: "3-6",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "ワークライフバランスの推進",
        text: "適切な働き方の実現及び育児・介護の両立支援の取り組み",
        selectableNo: 6,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "各種研修実施やアンケート調査でサポート",
        hint: "柔軟な働き方の制度整備、育児・介護休業の取得促進等が該当します。",
      },
      {
        id: "3-7",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "職場の活性化",
        text: "コミュニケーションの促進に向けた取り組み",
        selectableNo: 7,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "社内イベント、1on1制度、部署横断交流等が該当します。",
      },
      {
        id: "3-8",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "仕事と治療の両立支援",
        text: "がん等の私病に関する復職・両立支援の取り組み",
        selectableNo: 8,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "業務サポート",
        hint: "がん・難病等の治療と仕事を両立できる制度・環境整備が求められます。",
      },
      {
        id: "3-9",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "性差・年齢に配慮した職場づくり",
        text: "女性の健康保持・増進に向けた取り組み",
        selectableNo: 9,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "女性の健康に関する研修を実施",
        hint: "婦人科検診補助、月経・妊活・更年期等への対応が求められます。",
      },
      {
        id: "3-10",
        midCategory: "健康経営の実践に向けた土台づくり",
        subCategory: "性差・年齢に配慮した職場づくり",
        text: "高年齢従業員の健康や体力の状況に応じた取り組み",
        selectableNo: 10,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "高年齢者の体力測定、転倒防止対策、健康相談等が該当します。",
      },
      // 中項目: 従業員の心と身体の健康づくりに関する具体的対策
      {
        id: "3-11",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "保健指導",
        text: "保健指導の実施及び特定保健指導実施機会の提供に関する取り組み",
        selectableNo: 11,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "生活習慣病予備群への保健指導の機会提供が求められます。参加率の測定も重要です。",
      },
      {
        id: "3-12",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "具体的な健康保持・増進施策",
        text: "食生活の改善に向けた取り組み",
        selectableNo: 12,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "業務サポート",
        hint: "社員食堂でのヘルシーメニュー提供、栄養セミナー等が該当します。",
      },
      {
        id: "3-13",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "具体的な健康保持・増進施策",
        text: "運動機会の増進に向けた取り組み",
        selectableNo: 13,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "各種研修や体力測定を実施",
        hint: "ウォーキングイベント、運動アプリ、スポーツ施設補助等が該当します。",
      },
      {
        id: "3-14",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "具体的な健康保持・増進施策",
        text: "長時間労働者への対応に関する取り組み",
        selectableNo: 14,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "過重労働防止のための面談実施、勤怠管理整備等が該当します。",
      },
      {
        id: "3-15",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "具体的な健康保持・増進施策",
        text: "心の健康保持・増進に関する取り組み",
        selectableNo: 15,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "睡眠とメンタルヘルスの研修を実施",
        hint: "メンタルヘルス研修、相談窓口設置、復職支援、ラインケア研修等が該当します。",
      },
      {
        id: "3-16",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "感染症予防対策",
        text: "感染症予防に関する取り組み",
        selectableNo: 16,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: false,
        supportLabel: null,
        hint: "予防接種補助、感染症対策マニュアル整備等が該当します。",
      },
      {
        id: "3-17",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "喫煙対策",
        text: "喫煙率低下に向けた取り組み",
        selectableNo: 17,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "喫煙率減少のための研修を実施",
        hint: "禁煙外来補助、禁煙プログラム等が該当します。",
      },
      {
        id: "3-18",
        midCategory: "従業員の心と身体の健康づくりに関する具体的対策",
        subCategory: "喫煙対策",
        text: "受動喫煙対策に関する取り組み",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "分煙対策、敷地内禁煙等の受動喫煙防止対策が必須です。",
      },
    ],
  },

  // --------------------------------------------------------
  // 大項目4: 評価・改善
  // --------------------------------------------------------
  {
    id: "cat4",
    label: "評価・改善",
    icon: "📊",
    color: "#D97706",
    items: [
      {
        id: "4-1",
        midCategory: null,
        subCategory: "健康経営の推進に関する効果検証",
        text: "健康経営の実施についての効果検証",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: true,
        supportLabel: "効果検証・健康白書作成を実施",
        hint: "2026年度から「質」の評価にシフト。施策の結果・成果の測定と開示が求められます。",
      },
      // 4-2: 弊社独自の追加項目（経産省公式の評価項目にはありませんが、
      // 効果検証・情報開示の一環として推奨される取り組みです）
      {
        id: "4-2",
        midCategory: null,
        subCategory: "健康経営の推進に関する効果検証",
        text: "健康白書の作成・公開（推奨項目）",
        selectableNo: null,
        requiredLarge: false,
        requiredWhite500: false,
        canSupport: true,
        supportLabel: "健康白書作成サポート",
        hint: "健康白書（健康経営の方針・施策・成果をまとめた報告書）の作成と社内外への公開。経年での変化を可視化でき、ステークホルダーへの説明にも有効です。※ 経産省公式の評価項目ではありませんが、効果検証を「見える化」する推奨取り組みとしてフロム・シェフがサポートします。",
      },
    ],
  },

  // --------------------------------------------------------
  // 大項目5: 法令遵守・リスクマネジメント
  // --------------------------------------------------------
  {
    id: "cat5",
    label: "法令遵守・リスクマネジメント",
    icon: "⚖️",
    color: "#7C3AED",
    items: [
      {
        id: "5-1",
        midCategory: null,
        subCategory: null,
        text: "定期健診の実施、50人以上事業場でのストレスチェック実施、労基法・労安衛法違反による送検なし等",
        selectableNo: null,
        requiredLarge: true,
        requiredWhite500: true,
        canSupport: false,
        supportLabel: null,
        hint: "法令遵守は認定の絶対要件。違反があると認定の対象外となります。",
      },
    ],
  },
];

// 全評価項目のフラット配列（検索・絞り込み用）
export const ALL_ITEMS = CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    ...item,
    categoryId: cat.id,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    categoryIcon: cat.icon,
  }))
);

// ID から評価項目を取得するヘルパー
export function getItemById(id) {
  return ALL_ITEMS.find((item) => item.id === id);
}

// フロム・シェフが対応可能な項目のID一覧
export const SUPPORTABLE_ITEM_IDS = ALL_ITEMS
  .filter((item) => item.canSupport)
  .map((item) => item.id);
