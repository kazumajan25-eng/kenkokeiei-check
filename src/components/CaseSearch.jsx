// ============================================================
// 事例検索コンポーネント
// ============================================================
// 評価項目チェックボックスで絞り込み + 業種/規模フィルタ + テキスト検索
// 各事例カードを展開して詳細表示
// フロム・シェフ対応可項目には CTA を表示
// ============================================================

import { useState, useMemo } from "react";
import { CATEGORIES, ALL_ITEMS, getItemById, SUPPORTABLE_ITEM_IDS } from "../data/categories.js";
import { CASES } from "../data/cases.js";
import { CONTACT_URL } from "./Footer.jsx";

export default function CaseSearch() {
  // 絞り込み状態
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [industryFilter, setIndustryFilter] = useState("all");
  const [supportOnlyFilter, setSupportOnlyFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // 業種一覧（自動抽出）
  const industries = useMemo(() => {
    const set = new Set();
    CASES.forEach((c) => set.add(c.industry));
    return ["all", ...Array.from(set)];
  }, []);

  // 絞り込み結果
  const filteredCases = useMemo(() => {
    return CASES.filter((c) => {
      // テキスト検索
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const hay = (c.companyName + c.industry).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      // 業種フィルタ
      if (industryFilter !== "all" && c.industry !== industryFilter) return false;
      // 評価項目フィルタ（選択した項目をすべて持つ事例のみ）
      if (selectedItemIds.size > 0) {
        const covered = new Set(c.initiatives.map((i) => i.itemId));
        for (const id of selectedItemIds) {
          if (!covered.has(id)) return false;
        }
      }
      // フロム・シェフ対応可フィルタ
      if (supportOnlyFilter) {
        const hasSupportable = c.initiatives.some((i) =>
          SUPPORTABLE_ITEM_IDS.includes(i.itemId)
        );
        if (!hasSupportable) return false;
      }
      return true;
    });
  }, [searchText, industryFilter, selectedItemIds, supportOnlyFilter]);

  // 評価項目のトグル
  const toggleItem = (id) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // フィルタリセット
  const resetFilters = () => {
    setSelectedItemIds(new Set());
    setIndustryFilter("all");
    setSupportOnlyFilter(false);
    setSearchText("");
  };

  const activeFilterCount =
    selectedItemIds.size +
    (industryFilter !== "all" ? 1 : 0) +
    (supportOnlyFilter ? 1 : 0) +
    (searchText.trim() ? 1 : 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 40px" }}>
      {/* イントロ */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "20px 24px",
          marginBottom: 16,
          boxShadow: "0 2px 14px rgba(0,0,0,.05)",
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 20,
            fontWeight: 800,
            color: "#1A3A5C",
          }}
        >
          🔍 健康経営の実践事例を探す
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
          {CASES.length}社の認定企業の取り組みを、公式評価項目（{ALL_ITEMS.length}項目）から絞り込んで検索できます。
        </p>
      </div>

      {/* 検索バー & クイックフィルタ */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        }}
      >
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="🔍 会社名・業種で検索（例: 製紙、IT、トヨタ...）"
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 14,
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 12,
          }}
        />

        {/* クイックフィルタ: 業種 */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              marginBottom: 6,
            }}
          >
            業種
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  border:
                    industryFilter === ind
                      ? "1.5px solid #1A3A5C"
                      : "1.5px solid #e2e8f0",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: industryFilter === ind ? "#1A3A5C" : "#fff",
                  color: industryFilter === ind ? "#fff" : "#64748b",
                }}
              >
                {ind === "all" ? "すべて" : ind}
              </button>
            ))}
          </div>
        </div>

        {/* フロム・シェフ対応可トグル */}
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "6px 0",
          }}
        >
          <input
            type="checkbox"
            checked={supportOnlyFilter}
            onChange={(e) => setSupportOnlyFilter(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
            🤝 フロム・シェフ対応可項目がある事例のみ表示
          </span>
        </label>
      </div>

      {/* 評価項目フィルタ（アコーディオン） */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,.05)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setFilterOpen((v) => !v)}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          <span>
            📋 評価項目で絞り込み
            {selectedItemIds.size > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  background: "#2563EB",
                  color: "#fff",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 10,
                }}
              >
                {selectedItemIds.size}項目選択中
              </span>
            )}
          </span>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>
            {filterOpen ? "▲ 閉じる" : "▼ 開く"}
          </span>
        </button>

        {filterOpen && (
          <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f1f5f9" }}>
            <p
              style={{
                margin: "12px 0",
                fontSize: 11,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              チェックを入れた評価項目を <strong>すべて</strong>{" "}
              取り組んでいる事例だけを表示します（AND検索）。
            </p>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                    paddingBottom: 6,
                    borderBottom: `2px solid ${cat.color}`,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: cat.color,
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {cat.items.map((item) => (
                    <label
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "6px 8px",
                        borderRadius: 6,
                        cursor: "pointer",
                        background: selectedItemIds.has(item.id)
                          ? "#F0F4FF"
                          : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItemIds.has(item.id)}
                        onChange={() => toggleItem(item.id)}
                        style={{ marginTop: 2, cursor: "pointer" }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: "#334155",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.selectableNo && (
                          <span
                            style={{
                              color: "#2563EB",
                              fontWeight: 700,
                              marginRight: 4,
                            }}
                          >
                            ⑰{item.selectableNo}
                          </span>
                        )}
                        {item.text}
                        {item.canSupport && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 10,
                              color: "#16a34a",
                              fontWeight: 600,
                            }}
                          >
                            🤝
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 結果サマリー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          padding: "0 4px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
          検索結果: {filteredCases.length} / {CASES.length} 社
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#dc2626",
              background: "transparent",
              border: "1.5px solid #fca5a5",
              padding: "5px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            ✕ 絞り込みをリセット（{activeFilterCount}）
          </button>
        )}
      </div>

      {/* 事例カード一覧 */}
      {filteredCases.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "60px 24px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            該当する事例が見つかりませんでした
          </div>
          <div style={{ fontSize: 12 }}>
            絞り込み条件を緩めてお試しください
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredCases.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              expanded={expandedCaseId === c.id}
              onToggleExpand={() =>
                setExpandedCaseId(expandedCaseId === c.id ? null : c.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 事例カード（個別）
// ============================================================
function CaseCard({ caseData, expanded, onToggleExpand }) {
  const supportableCount = caseData.initiatives.filter((i) =>
    SUPPORTABLE_ITEM_IDS.includes(i.itemId)
  ).length;

  // 取り組みをカテゴリ別にグルーピング
  const initiativesByCategory = useMemo(() => {
    const map = new Map();
    CATEGORIES.forEach((cat) => map.set(cat.id, []));
    caseData.initiatives.forEach((init) => {
      const item = getItemById(init.itemId);
      if (!item) return;
      map.get(item.categoryId)?.push({ ...init, itemDetail: item });
    });
    return map;
  }, [caseData]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 14px rgba(0,0,0,.06)",
        overflow: "hidden",
        transition: "box-shadow .2s",
      }}
    >
      {/* カード概要 */}
      <div
        style={{
          padding: "20px 24px",
          cursor: "pointer",
        }}
        onClick={onToggleExpand}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 17,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {caseData.companyName}
            </h3>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                marginBottom: 10,
              }}
            >
              {caseData.industry}
              {caseData.employeeScale && ` ・ ${caseData.employeeScale}`}
            </div>

            {/* 認定区分バッジ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {caseData.certifications.map((cert, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "#FFF4E6",
                    color: "#B45309",
                    padding: "3px 8px",
                    borderRadius: 4,
                    border: "1px solid #FCD9A6",
                  }}
                >
                  🏆 {cert}
                </span>
              ))}
            </div>

            {/* 健康宣言（短く） */}
            {caseData.declaration && (
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 12,
                  color: "#334155",
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: expanded ? "unset" : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                💬 {caseData.declaration}
              </p>
            )}

            {/* 取り組み数表示 */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>
                📋 取り組み{" "}
                <strong style={{ color: "#1A3A5C" }}>
                  {caseData.initiatives.length}件
                </strong>
              </span>
              {supportableCount > 0 && (
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
                  🤝 フロム・シェフ対応可{" "}
                  <strong>{supportableCount}件</strong>
                </span>
              )}
            </div>
          </div>

          <button
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 14px",
              background: expanded ? "#1A3A5C" : "#F0F4FF",
              color: expanded ? "#fff" : "#1A3A5C",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {expanded ? "▲ 閉じる" : "▼ 詳細を見る"}
          </button>
        </div>
      </div>

      {/* 展開部 */}
      {expanded && (
        <div
          style={{
            padding: "0 24px 24px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          {/* 推進体制 */}
          {caseData.promotionStructure && (
            <div style={{ marginTop: 18 }}>
              <h4
                style={{
                  margin: "0 0 6px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                🏛️ 推進体制
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#475569",
                  lineHeight: 1.7,
                  background: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: 8,
                }}
              >
                {caseData.promotionStructure}
              </p>
            </div>
          )}

          {/* 取り組み（カテゴリ別） */}
          <div style={{ marginTop: 18 }}>
            <h4
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ✨ 取り組み一覧
            </h4>
            {CATEGORIES.map((cat) => {
              const inits = initiativesByCategory.get(cat.id) || [];
              if (inits.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{cat.icon}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: cat.color,
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {inits.map((init, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 12px",
                          background: "#fafafa",
                          borderRadius: 8,
                          borderLeft: `3px solid ${cat.color}`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: cat.color,
                            fontWeight: 700,
                            marginBottom: 2,
                          }}
                        >
                          {init.itemDetail.text}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#334155",
                            lineHeight: 1.6,
                          }}
                        >
                          → {init.summary}
                        </div>
                        {/* フロム・シェフ対応可CTA */}
                        {init.itemDetail.canSupport && (
                          <div style={{ marginTop: 8 }}>
                            <a
                              href={`${CONTACT_URL}?subject=${encodeURIComponent(
                                `【${init.itemDetail.supportLabel}】のお問い合わせ`
                              )}`}
                              style={{
                                display: "inline-block",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#fff",
                                background: "#16a34a",
                                padding: "5px 12px",
                                borderRadius: 6,
                                textDecoration: "none",
                              }}
                            >
                              🤝 同じ取り組みをフロム・シェフで:{" "}
                              {init.itemDetail.supportLabel}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPI */}
          {caseData.kpis && Object.keys(caseData.kpis).length > 0 && (
            <div style={{ marginTop: 18 }}>
              <h4
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                📊 主要KPI
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 8,
                }}
              >
                {Object.entries(caseData.kpis).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      padding: "10px 14px",
                      background: "#F0F4FF",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#1A3A5C",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 出典 */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "1px solid #f1f5f9",
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            出典:{" "}
            <a
              href={caseData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563EB", textDecoration: "underline" }}
            >
              {caseData.sourceName} ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
