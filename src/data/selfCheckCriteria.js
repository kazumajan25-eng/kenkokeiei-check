// ============================================================
// セルフチェック専用の認定要件データ
// ============================================================
// 出所:
// - kk2026sample_dai.pdf p5: 大規模法人部門の認定要件
// - kk2026sample_chu.pdf p6: 部門区分
// - kk2026sample_chu.pdf p9: 中小規模法人部門の認定要件
// ============================================================

import { CATEGORIES } from "./categories.js";

const baseItems = new Map(
  CATEGORIES.flatMap((category) =>
    category.items.map((item) => [item.id, { ...item }])
  )
);

function item(id, overrides = {}) {
  return {
    ...baseItems.get(id),
    ...overrides,
  };
}

function category(id, items) {
  const base = CATEGORIES.find((cat) => cat.id === id);
  return {
    ...base,
    items,
  };
}

export const CORPORATION_SIZE_RULES = [
  {
    id: "company-manufacturing",
    label: "会社等・士業法人：製造業その他",
    largeFrom: 301,
    smeLabel: "1〜300人以下",
    largeLabel: "301人以上",
  },
  {
    id: "company-wholesale",
    label: "会社等・士業法人：卸売業",
    largeFrom: 101,
    smeLabel: "1〜100人以下",
    largeLabel: "101人以上",
  },
  {
    id: "company-retail",
    label: "会社等・士業法人：小売業",
    largeFrom: 51,
    smeLabel: "1〜50人以下",
    largeLabel: "51人以上",
  },
  {
    id: "company-service",
    label: "会社等・士業法人：サービス業",
    largeFrom: 101,
    smeLabel: "1〜100人以下",
    largeLabel: "101人以上",
  },
  {
    id: "medical-association",
    label: "医療法人・社会福祉法人・社団法人等",
    largeFrom: 101,
    smeLabel: "1〜100人以下",
    largeLabel: "101人以上",
  },
  {
    id: "local-government",
    label: "地方公共団体・公法人・特殊法人等",
    largeFrom: 301,
    smeLabel: "1〜300人以下",
    largeLabel: "301人以上",
  },
  {
    id: "other-manufacturing",
    label: "その他法人：製造業その他",
    largeFrom: 301,
    smeLabel: "1〜300人以下",
    largeLabel: "301人以上",
  },
  {
    id: "other-wholesale",
    label: "その他法人：卸売業",
    largeFrom: 101,
    smeLabel: "1〜100人以下",
    largeLabel: "101人以上",
  },
  {
    id: "other-retail",
    label: "その他法人：小売業",
    largeFrom: 51,
    smeLabel: "1〜50人以下",
    largeLabel: "51人以上",
  },
  {
    id: "other-service",
    label: "その他法人：サービス業",
    largeFrom: 101,
    smeLabel: "1〜100人以下",
    largeLabel: "101人以上",
  },
];

export function classifyCorporationSize(ruleId, employeeCount) {
  const rule = CORPORATION_SIZE_RULES.find((entry) => entry.id === ruleId);
  const count = Number(employeeCount);

  if (!rule || !Number.isFinite(count) || count <= 0) {
    return null;
  }

  return {
    rule,
    count,
    type: count >= rule.largeFrom ? "large" : "sme",
  };
}

const LARGE_CATEGORIES = CATEGORIES.map((cat) => ({
  ...cat,
  items: cat.items.map((entry) =>
    entry.id === "4-2"
      ? {
          ...entry,
          optionalRecommendation: true,
          hint:
            "健康白書は公式の認定要件ではありませんが、効果検証を見える化する推奨取り組みとして確認します。",
        }
      : { ...entry }
  ),
}));

const SME_CATEGORIES = [
  category("cat1", [
    item("1-1", {
      text: "健康宣言の社内外への発信及び経営者自身の健診受診",
      requiredSme: true,
      hint:
        "中小規模法人部門では、健康宣言を社内外へ発信し、経営者自身も健診を受診していることが必須です。",
    }),
  ]),
  category("cat2", [
    item("2-1", {
      text: "健康づくり担当者の設置",
      requiredSme: true,
      hint:
        "健康経営を進める担当者を設置し、社内で推進できる体制を作っていることが必要です。",
    }),
    item("2-4", {
      text: "求めに応じた40歳以上の従業員の健診データの提供",
      requiredSme: true,
      hint:
        "保険者等から求められた場合に、40歳以上の従業員の健診データを提供できる体制が必要です。",
    }),
  ]),
  category("cat3", [
    item("3-1", {
      requiredSme: true,
      hint:
        "健康課題を踏まえて、目標・施策・振り返りを含む推進計画を持っていることが必要です。",
    }),
    item("3-2", {
      text: "従業員の健康診断の実施（受診率実質100%）",
      selectableNo: 1,
      requirementGroup: "health-issues",
      hint:
        "対象従業員が定期健康診断を実質100%受診できているかを確認します。",
    }),
    item("3-3", {
      text: "受診勧奨の取り組み",
      selectableNo: 2,
      requirementGroup: "health-issues",
    }),
    item("3-4", {
      selectableNo: 3,
      requirementGroup: "health-issues",
    }),
    item("3-5", {
      selectableNo: 4,
      requirementGroup: "foundation",
    }),
    item("3-6", {
      id: "3-6-work",
      displayId: "3-6",
      text: "適切な働き方実現に向けた取り組み",
      selectableNo: 5,
      requirementGroup: "foundation",
      hint:
        "長時間労働の抑制、有給休暇取得促進、柔軟な勤務制度など、働き方を整える取り組みを確認します。",
    }),
    item("3-6", {
      id: "3-6-care",
      displayId: "3-6",
      text: "仕事と育児または介護の両立支援の取り組み",
      selectableNo: 6,
      requirementGroup: "foundation",
      hint:
        "育児・介護と仕事を両立しやすくする制度や周知、利用促進の取り組みを確認します。",
    }),
    item("3-7", {
      selectableNo: 7,
      requirementGroup: "foundation",
    }),
    item("3-8", {
      selectableNo: 8,
      requirementGroup: "foundation",
    }),
    item("3-9", {
      selectableNo: 9,
      requirementGroup: "foundation",
    }),
    item("3-10", {
      selectableNo: 10,
      requirementGroup: "foundation",
    }),
    item("3-11", {
      selectableNo: 11,
      requirementGroup: "health-actions",
      text: "保健指導の実施または特定保健指導実施機会の提供に関する取り組み",
    }),
    item("3-12", {
      selectableNo: 12,
      requirementGroup: "health-actions",
    }),
    item("3-13", {
      selectableNo: 13,
      requirementGroup: "health-actions",
    }),
    item("3-14", {
      selectableNo: 14,
      requirementGroup: "health-actions",
    }),
    item("3-15", {
      selectableNo: 15,
      requirementGroup: "health-actions",
    }),
    item("3-16", {
      selectableNo: 16,
      requirementGroup: "health-actions",
    }),
    item("3-17", {
      selectableNo: 17,
      requirementGroup: "health-actions",
    }),
    item("3-18", {
      requiredSme: true,
    }),
  ]),
  category("cat4", [
    item("4-1", {
      text: "健康経営の取り組みに対する評価・改善",
      requiredSme: true,
      hint:
        "取り組みを実施して終わりにせず、結果を振り返り、次の改善につなげているかを確認します。",
    }),
    item("4-2", {
      optionalRecommendation: true,
      hint:
        "健康白書は公式の認定要件ではありませんが、効果検証を見える化する推奨取り組みとして確認します。",
    }),
  ]),
  category("cat5", [
    item("5-1", {
      requiredSme: true,
    }),
  ]),
];

export const SELF_CHECK_CONFIGS = {
  large: {
    type: "large",
    label: "大規模法人部門",
    sourceLabel: "大規模法人部門: kk2026sample_dai.pdf p5",
    categories: LARGE_CATEGORIES,
    requirementSummary: [
      "必須項目をすべて実施",
      "評価項目①〜⑰のうち14項目以上を実施",
      "健康経営銘柄・ホワイト500は追加の必須項目あり",
    ],
    criteria: {
      requiredFlag: "requiredLarge",
      selectionGroups: [
        {
          id: "large-selectable",
          label: "評価項目①〜⑰",
          min: 14,
          itemIds: LARGE_CATEGORIES.flatMap((cat) => cat.items)
            .filter((entry) => entry.selectableNo)
            .map((entry) => entry.id),
        },
      ],
    },
  },
  sme: {
    type: "sme",
    label: "中小規模法人部門",
    sourceLabel: "中小規模法人部門: kk2026sample_chu.pdf p9",
    categories: SME_CATEGORIES,
    requirementSummary: [
      "必須項目をすべて実施",
      "①〜③のうち2項目以上を実施",
      "④〜⑩のうち2項目以上を実施",
      "⑪〜⑰のうち4項目以上を実施",
      "小規模事業者向け特例は本チェックでは扱わない",
    ],
    criteria: {
      requiredFlag: "requiredSme",
      selectionGroups: [
        {
          id: "health-issues",
          label: "①〜③ 健康課題の把握",
          min: 2,
          itemIds: ["3-2", "3-3", "3-4"],
        },
        {
          id: "foundation",
          label: "④〜⑩ 土台づくり",
          min: 2,
          itemIds: ["3-5", "3-6-work", "3-6-care", "3-7", "3-8", "3-9", "3-10"],
        },
        {
          id: "health-actions",
          label: "⑪〜⑰ 具体的対策",
          min: 4,
          itemIds: ["3-11", "3-12", "3-13", "3-14", "3-15", "3-16", "3-17"],
        },
      ],
    },
  },
};

export function getSelfCheckConfig(type) {
  return SELF_CHECK_CONFIGS[type] || SELF_CHECK_CONFIGS.large;
}

export function summarizeRequirementProgress(config, answers) {
  const items = config.categories.flatMap((cat) =>
    cat.items.map((entry) => ({ ...entry, catLabel: cat.label }))
  );
  const requiredItems = items.filter((entry) => entry[config.criteria.requiredFlag]);
  const missingRequired = requiredItems.filter((entry) => answers[entry.id] !== "yes");
  const groups = config.criteria.selectionGroups.map((group) => {
    const groupItems = items.filter((entry) => group.itemIds.includes(entry.id));
    const done = groupItems.filter((entry) => answers[entry.id] === "yes").length;

    return {
      ...group,
      total: groupItems.length,
      done,
      ok: done >= group.min,
    };
  });

  return {
    requiredTotal: requiredItems.length,
    requiredDone: requiredItems.length - missingRequired.length,
    missingRequired,
    groups,
    ok: missingRequired.length === 0 && groups.every((group) => group.ok),
  };
}
