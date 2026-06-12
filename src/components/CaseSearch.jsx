// ============================================================
// 事例検索コンポーネント
// ============================================================
// - 業種は「大分類」（6分類）で絞り込み。詳細業種はカード内に表示
// - 評価項目チェックボックスでAND絞り込み
// - 選択中の条件はチップとして結果一覧の上に表示（個別解除可）
// - フロム・シェフ対応可項目はティール色で統一表現
// ============================================================

import { useState, useMemo } from "react";
import {
  CATEGORIES,
  ALL_ITEMS,
  getItemById,
  SUPPORTABLE_ITEM_IDS,
} from "../data/categories.js";
import {
  CASES,
  INDUSTRY_CATEGORIES,
  getIndustryCategory,
} from "../data/cases.js";
import { buildContactUrl } from "./Footer.jsx";
import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconAward,
  IconHandshake,
  IconList,
  IconChart,
  IconExternalLink,
  IconMail,
  IconInfo,
  IconFilter,
  CATEGORY_ICONS,
  circledNumber,
} from "./icons.jsx";

export default function CaseSearch() {
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [industryFilter, setIndustryFilter] = useState("all");
  const [supportOnlyFilter, setSupportOnlyFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // 大分類ごとの件数（チップに表示）
  const industryCounts = useMemo(() => {
    const counts = {};
    CASES.forEach((c) => {
      const cat = getIndustryCategory(c);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  // 絞り込み結果
  const filteredCases = useMemo(() => {
    return CASES.filter((c) => {
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const hay = (c.companyName + c.industry).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (industryFilter !== "all" && getIndustryCategory(c) !== industryFilter)
        return false;
      if (selectedItemIds.size > 0) {
        const covered = new Set(c.initiatives.map((i) => i.itemId));
        for (const id of selectedItemIds) {
          if (!covered.has(id)) return false;
        }
      }
      if (supportOnlyFilter) {
        const hasSupportable = c.initiatives.some((i) =>
          SUPPORTABLE_ITEM_IDS.includes(i.itemId)
        );
        if (!hasSupportable) return false;
      }
      return true;
    });
  }, [searchText, industryFilter, selectedItemIds, supportOnlyFilter]);

  const toggleItem = (id) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 600,
    background: "var(--teal-50)",
    color: "var(--teal-700)",
    border: "1px solid var(--teal-300)",
    borderRadius: 20,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 40px" }}>
      {/* ヒーロー */}
      <section
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-card)",
          padding: "28px 28px 24px",
          marginBottom: 16,
          boxShadow: "var(--shadow-card)",
          borderTop: "4px solid var(--navy-800)",
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 22,
            fontWeight: 800,
            color: "var(--navy-800)",
            lineHeight: 1.5,
          }}
        >
          認定企業の取り組み事例を探す
        </h2>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 14,
            color: "var(--ink-700)",
            lineHeight: 1.9,
            maxWidth: 780,
            textWrap: "pretty",
          }}
        >
          健康経営優良法人に認定された企業
          <strong style={{ color: "var(--navy-800)" }}>
            {CASES.length}社
          </strong>
          の取り組みを、経済産業省の評価項目（{ALL_ITEMS.length}
          項目）に沿って整理しています。
          <span style={{ whiteSpace: "nowrap" }}>業種や評価項目で絞り込んで、</span>
          <span style={{ whiteSpace: "nowrap" }}>自社の参考になる事例を見つけてください。</span>
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--ink-500)",
          }}
        >
          <IconInfo size={13} />
          健康経営銘柄・ホワイト500・ブライト500の認定企業を含みます
        </div>
      </section>

      {/* 検索・絞り込み */}
      <section
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-card)",
          padding: "20px 24px",
          marginBottom: 12,
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* テキスト検索 */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-400)",
              display: "flex",
            }}
          >
            <IconSearch size={16} />
          </span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="会社名・業種で検索（例: 製紙、IT、タニタ…）"
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              fontSize: 14,
              border: "1.5px solid var(--line-200)",
              borderRadius: 10,
              outline: "none",
            }}
          />
        </div>

        {/* 業種（大分類） */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--ink-500)",
              marginBottom: 8,
            }}
          >
            業種で絞り込み
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["all", ...INDUSTRY_CATEGORIES].map((ind) => {
              const active = industryFilter === ind;
              const label =
                ind === "all"
                  ? `すべて (${CASES.length})`
                  : `${ind} (${industryCounts[ind] || 0})`;
              return (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  style={{
                    padding: "7px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    border: active
                      ? "1.5px solid var(--navy-800)"
                      : "1.5px solid var(--line-200)",
                    borderRadius: 8,
                    background: active ? "var(--navy-800)" : "#fff",
                    color: active ? "#fff" : "var(--ink-700)",
                    transition: "all .15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* フロム・シェフ対応可トグル */}
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={supportOnlyFilter}
            onChange={(e) => setSupportOnlyFilter(e.target.checked)}
            style={{ cursor: "pointer", accentColor: "var(--teal-600)" }}
          />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--teal-700)",
            }}
          >
            <IconHandshake size={14} />
            フロム・シェフがサポートできる取り組みを含む事例のみ
          </span>
        </label>
      </section>

      {/* 評価項目フィルタ（アコーディオン） */}
      <section
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-card)",
          marginBottom: 16,
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setFilterOpen((v) => !v)}
          style={{
            width: "100%",
            padding: "16px 24px",
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--ink-900)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <IconFilter size={15} />
            評価項目で絞り込み
            {selectedItemIds.size > 0 && (
              <span
                style={{
                  background: "var(--navy-800)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: 10,
                }}
              >
                {selectedItemIds.size}項目
              </span>
            )}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              color: "var(--ink-400)",
              fontWeight: 600,
            }}
          >
            {filterOpen ? "閉じる" : "開く"}
            {filterOpen ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </span>
        </button>

        {filterOpen && (
          <div
            style={{
              padding: "0 24px 22px",
              borderTop: "1px solid var(--line-100)",
            }}
          >
            <p
              style={{
                margin: "14px 0 16px",
                fontSize: 12,
                color: "var(--ink-500)",
                lineHeight: 1.7,
              }}
            >
              チェックを入れた評価項目に<strong>すべて</strong>
              取り組んでいる事例だけを表示します。
              <span style={{ color: "var(--teal-700)" }}>
                （
                <IconHandshake size={11} style={{ verticalAlign: "-1px" }} />
                マークはフロム・シェフがサポートできる項目です）
              </span>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 18,
              }}
            >
              {CATEGORIES.map((cat) => {
                const CatIcon = CATEGORY_ICONS[cat.id];
                return (
                  <div key={cat.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 8,
                        paddingBottom: 7,
                        borderBottom: "2px solid var(--navy-800)",
                        color: "var(--navy-800)",
                      }}
                    >
                      <CatIcon size={15} />
                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                        {cat.label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      {cat.items.map((item) => (
                        <label
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            padding: "6px 8px",
                            borderRadius: 7,
                            cursor: "pointer",
                            background: selectedItemIds.has(item.id)
                              ? "var(--teal-50)"
                              : "transparent",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItemIds.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            style={{
                              marginTop: 3,
                              cursor: "pointer",
                              accentColor: "var(--navy-800)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: "var(--ink-700)",
                              lineHeight: 1.6,
                            }}
                          >
                            {item.selectableNo && (
                              <span
                                style={{
                                  color: "var(--navy-700)",
                                  fontWeight: 700,
                                  marginRight: 4,
                                }}
                              >
                                選択{circledNumber(item.selectableNo)}
                              </span>
                            )}
                            {item.text}
                            {item.canSupport && (
                              <span
                                style={{
                                  marginLeft: 5,
                                  color: "var(--teal-600)",
                                  display: "inline-flex",
                                  verticalAlign: "-2px",
                                }}
                              >
                                <IconHandshake size={13} />
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 結果サマリー + 選択中チップ */}
      <div style={{ marginBottom: 14, padding: "0 4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: activeFilterCount > 0 ? 10 : 0,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900)" }}>
            検索結果{" "}
            <span style={{ color: "var(--navy-800)", fontSize: 18 }}>
              {filteredCases.length}
            </span>{" "}
            / {CASES.length} 社
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--ink-500)",
                background: "transparent",
                border: "1.5px solid var(--line-200)",
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              <IconX size={12} />
              すべての条件をクリア
            </button>
          )}
        </div>

        {/* 選択中の条件チップ */}
        {activeFilterCount > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {searchText.trim() && (
              <button onClick={() => setSearchText("")} style={{ ...chipStyle, cursor: "pointer", border: "1px solid var(--line-200)", background: "var(--line-100)", color: "var(--ink-700)" }}>
                「{searchText.trim()}」
                <IconX size={11} />
              </button>
            )}
            {industryFilter !== "all" && (
              <button onClick={() => setIndustryFilter("all")} style={{ ...chipStyle, cursor: "pointer", border: "1px solid var(--line-200)", background: "var(--line-100)", color: "var(--ink-700)" }}>
                業種: {industryFilter}
                <IconX size={11} />
              </button>
            )}
            {supportOnlyFilter && (
              <button onClick={() => setSupportOnlyFilter(false)} style={{ ...chipStyle, cursor: "pointer" }}>
                サポート可のみ
                <IconX size={11} />
              </button>
            )}
            {[...selectedItemIds].map((id) => {
              const item = getItemById(id);
              if (!item) return null;
              const short =
                item.text.length > 16 ? item.text.slice(0, 16) + "…" : item.text;
              return (
                <button key={id} onClick={() => toggleItem(id)} style={{ ...chipStyle, cursor: "pointer" }}>
                  {short}
                  <IconX size={11} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 事例カード一覧 */}
      {filteredCases.length === 0 ? (
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-card)",
            padding: "60px 24px",
            textAlign: "center",
            color: "var(--ink-400)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
            <IconSearch size={32} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: "var(--ink-700)" }}>
            該当する事例が見つかりませんでした
          </div>
          <div style={{ fontSize: 13 }}>
            チェックを1つ外すか、業種を「すべて」に戻してお試しください
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

  // 一覧表示では認定バッジを2個まで + 「+N」
  const shownCerts = expanded
    ? caseData.certifications
    : caseData.certifications.slice(0, 2);
  const hiddenCertCount = caseData.certifications.length - shownCerts.length;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* カード概要 */}
      <div style={{ padding: "20px 24px", cursor: "pointer" }} onClick={onToggleExpand}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3
              style={{
                margin: "0 0 2px",
                fontSize: 17,
                fontWeight: 800,
                color: "var(--ink-900)",
              }}
            >
              {caseData.companyName}
            </h3>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-500)",
                marginBottom: 10,
              }}
            >
              {caseData.industry}
              {caseData.employeeScale && ` ・ ${caseData.employeeScale}法人`}
            </div>

            {/* 認定区分バッジ */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                marginBottom: 10,
              }}
            >
              {shownCerts.map((cert, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "var(--amber-50)",
                    color: "var(--amber-700)",
                    padding: "3px 9px",
                    borderRadius: 5,
                    border: "1px solid #f3dfb8",
                  }}
                >
                  <IconAward size={11} />
                  {cert}
                </span>
              ))}
              {hiddenCertCount > 0 && (
                <span
                  title={caseData.certifications.join(" / ")}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ink-500)",
                    padding: "3px 8px",
                    borderRadius: 5,
                    border: "1px solid var(--line-200)",
                  }}
                >
                  +{hiddenCertCount}
                </span>
              )}
            </div>

            {/* 健康宣言 */}
            {caseData.declaration && (
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  color: "var(--ink-700)",
                  lineHeight: 1.7,
                  display: "-webkit-box",
                  WebkitLineClamp: expanded ? "unset" : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {caseData.declaration}
              </p>
            )}

            {/* 件数表示 */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "var(--ink-500)",
                }}
              >
                <IconList size={13} />
                取り組み{" "}
                <strong style={{ color: "var(--navy-800)" }}>
                  {caseData.initiatives.length}件
                </strong>
              </span>
              {supportableCount > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--teal-700)",
                  }}
                >
                  <IconHandshake size={13} />
                  フロム・シェフ対応可 <strong>{supportableCount}件</strong>
                </span>
              )}
            </div>
          </div>

          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              fontWeight: 700,
              padding: "9px 16px",
              background: expanded ? "var(--navy-800)" : "var(--line-100)",
              color: expanded ? "#fff" : "var(--navy-800)",
              border: "none",
              borderRadius: "var(--radius-btn)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {expanded ? "閉じる" : "詳細を見る"}
            {expanded ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* 展開部 */}
      {expanded && (
        <div
          style={{
            padding: "0 24px 24px",
            borderTop: "1px solid var(--line-100)",
          }}
        >
          {/* サポート可サマリー */}
          {supportableCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                padding: "10px 14px",
                background: "var(--teal-50)",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--teal-700)",
              }}
            >
              <IconHandshake size={15} />
              この事例の取り組みのうち {supportableCount} 件は、フロム・シェフでも同様のサポートが可能です
            </div>
          )}

          {/* 推進体制 */}
          {caseData.promotionStructure && (
            <div style={{ marginTop: 18 }}>
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  margin: "0 0 8px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-900)",
                }}
              >
                <IconUsersInline />
                推進体制
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--ink-700)",
                  lineHeight: 1.8,
                  background: "var(--line-100)",
                  padding: "12px 16px",
                  borderRadius: 9,
                }}
              >
                {caseData.promotionStructure}
              </p>
            </div>
          )}

          {/* 取り組み一覧 */}
          <div style={{ marginTop: 18 }}>
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                margin: "0 0 12px",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--ink-900)",
              }}
            >
              <IconList size={14} />
              取り組み一覧
            </h4>
            {CATEGORIES.map((cat) => {
              const inits = initiativesByCategory.get(cat.id) || [];
              if (inits.length === 0) return null;
              const CatIcon = CATEGORY_ICONS[cat.id];
              return (
                <div key={cat.id} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 7,
                      color: "var(--navy-800)",
                    }}
                  >
                    <CatIcon size={14} />
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>
                      {cat.label}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {inits.map((init, idx) => {
                      const supportable = init.itemDetail.canSupport;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "10px 14px",
                            background: supportable
                              ? "var(--teal-50)"
                              : "var(--line-100)",
                            borderRadius: 8,
                            borderLeft: supportable
                              ? "3px solid var(--teal-600)"
                              : "3px solid var(--line-200)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11.5,
                              color: "var(--ink-500)",
                              fontWeight: 600,
                              marginBottom: 2,
                            }}
                          >
                            {init.itemDetail.text}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "var(--ink-900)",
                              lineHeight: 1.7,
                            }}
                          >
                            {init.summary}
                          </div>
                          {supportable && (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                marginTop: 6,
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: "var(--teal-700)",
                              }}
                            >
                              <IconHandshake size={12} />
                              フロム・シェフ対応可：{init.itemDetail.supportLabel}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  margin: "0 0 10px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--ink-900)",
                }}
              >
                <IconChart size={14} />
                公開されている主なKPI
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                  gap: 8,
                }}
              >
                {Object.entries(caseData.kpis).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      padding: "10px 14px",
                      background: "var(--line-100)",
                      borderRadius: 9,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-500)",
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
                        color: "var(--navy-800)",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA + 出典 */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--line-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href={buildContactUrl(`事例: ${caseData.companyName}`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--teal-600)",
                color: "#fff",
                padding: "11px 20px",
                borderRadius: "var(--radius-btn)",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <IconMail size={14} />
              この事例のような取り組みを相談する
            </a>
            <a
              href={caseData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "var(--ink-500)",
                textDecoration: "underline",
              }}
            >
              出典: {caseData.sourceName}
              <IconExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// 推進体制見出し用の小さなアイコン（IconUsersのサイズ違い再利用）
function IconUsersInline() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
