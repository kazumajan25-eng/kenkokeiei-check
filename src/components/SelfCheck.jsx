// ============================================================
// セルフチェック画面
// ============================================================
// 旧 App.jsx のロジックを基に、新しい公式CATEGORIES (24項目) を使う形にリファクタ
// ============================================================

import { useState, useRef } from "react";
import { CATEGORIES } from "../data/categories.js";
import { CONTACT_URL } from "./Footer.jsx";

// スコア計算
function calcScore(answers) {
  let total = 0,
    done = 0,
    supportNeeded = [];
  CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      total++;
      if (answers[item.id] === "yes") done++;
      if (
        (answers[item.id] === "no" || answers[item.id] === "unknown") &&
        item.canSupport
      ) {
        supportNeeded.push({ ...item, catLabel: cat.label, catColor: cat.color });
      }
    });
  });
  const pct = Math.round((done / total) * 100);
  const rank =
    pct >= 80
      ? { label: "認定圏内の可能性大", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" }
      : pct >= 60
      ? { label: "あと少しで認定圏内", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" }
      : { label: "取り組み強化が必要", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };
  return { total, done, pct, rank, supportNeeded };
}

export default function SelfCheck() {
  const [step, setStep] = useState("intro"); // intro | check | result
  const [catIdx, setCatIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const resultRef = useRef(null);

  const allItems = CATEGORIES.flatMap((c) => c.items);
  const answeredCount = Object.keys(answers).length;
  const totalItems = allItems.length;
  const progress = Math.round((answeredCount / totalItems) * 100);

  const currentCat = CATEGORIES[catIdx];
  const isLastCat = catIdx === CATEGORIES.length - 1;

  const answer = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));

  const finish = () => {
    setStep("result");
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const score = step === "result" ? calcScore(answers) : null;

  const btnBase = {
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px 40px" }}>
      {/* 進捗バー（チェック中のみ表示） */}
      {step === "check" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>
              回答進捗
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1A3A5C" }}>
              {answeredCount}/{totalItems} ({progress}%)
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "#e2e8f0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#4ADE80",
                borderRadius: 3,
                transition: "width .3s",
              }}
            />
          </div>
        </div>
      )}

      {/* Intro */}
      {step === "intro" && (
        <div>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 28px",
              boxShadow: "0 2px 20px rgba(0,0,0,.07)",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: 22,
                fontWeight: 800,
                color: "#1A3A5C",
              }}
            >
              健康経営優良法人の認定、<br />
              御社は取得できますか？
            </h2>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              経済産業省「健康経営優良法人認定制度」の評価項目に基づき、
              自社の取り組み状況を約3〜5分でセルフチェックできます。
              チェック後、フロム・シェフが支援できる項目を一覧で確認し、そのままお問い合わせいただけます。
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                { icon: "⏱", label: "所要時間", val: "約3〜5分" },
                { icon: "📋", label: "チェック項目", val: `${totalItems}項目` },
                { icon: "🆓", label: "料金", val: "無料" },
              ].map(({ icon, label, val }) => (
                <div
                  key={label}
                  style={{
                    background: "#F0F4FF",
                    borderRadius: 10,
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C" }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("check")}
              style={{
                ...btnBase,
                width: "100%",
                padding: "14px",
                fontSize: 16,
                background: "#1A3A5C",
                color: "#fff",
                borderRadius: 10,
              }}
            >
              🚀 チェックを開始する（無料）
            </button>
          </div>

          {/* カテゴリ一覧 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: "0 2px 14px rgba(0,0,0,.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              チェックするカテゴリ
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "#f8fafc",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
                      {cat.items.length}項目
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Check */}
      {step === "check" && (
        <div>
          {/* カテゴリタブ */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 16,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {CATEGORIES.map((cat, i) => {
              const done = cat.items.every((item) => answers[item.id]);
              return (
                <button
                  key={cat.id}
                  onClick={() => setCatIdx(i)}
                  style={{
                    ...btnBase,
                    padding: "6px 14px",
                    fontSize: 12,
                    background: catIdx === i ? cat.color : "#fff",
                    color: catIdx === i ? "#fff" : "#64748b",
                    border: `1.5px solid ${catIdx === i ? cat.color : "#e2e8f0"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.icon} {cat.label}
                  {done && (
                    <span
                      style={{
                        marginLeft: 4,
                        color: catIdx === i ? "#fff" : "#16a34a",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 現在カテゴリ */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,.06)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span style={{ fontSize: 26 }}>{currentCat.icon}</span>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                    color: currentCat.color,
                  }}
                >
                  {currentCat.label}
                </h2>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                  {currentCat.items.length}項目 ·
                  各項目に「はい／いいえ／わからない」で回答してください
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {currentCat.items.map((item) => {
                // 必須かどうかの判定
                const isRequired = item.requiredLarge || item.requiredWhite500;
                return (
                  <div
                    key={item.id}
                    style={{
                      border: `1.5px solid ${
                        answers[item.id] ? "#e2e8f0" : "#f1f5f9"
                      }`,
                      borderRadius: 12,
                      padding: "16px",
                      background:
                        answers[item.id] === "yes"
                          ? "#f0fdf4"
                          : answers[item.id] === "no"
                          ? "#fef2f2"
                          : "#fafafa",
                    }}
                  >
                    {/* 小項目 (公式表の小項目を補助情報として表示) */}
                    {item.subCategory && (
                      <div
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          marginBottom: 6,
                          fontWeight: 600,
                        }}
                      >
                        {item.midCategory && `${item.midCategory} / `}
                        {item.subCategory}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      {isRequired && (
                        <span
                          style={{
                            background: "#dc2626",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          必須
                        </span>
                      )}
                      {item.selectableNo && (
                        <span
                          style={{
                            background: "#2563EB",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          選択{item.selectableNo}
                        </span>
                      )}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#0f172a",
                          fontWeight: 500,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>

                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: 11,
                        color: "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      💡 {item.hint}
                    </p>

                    {item.canSupport && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#16a34a",
                          marginBottom: 10,
                          fontWeight: 600,
                          background: "#f0fdf4",
                          padding: "6px 10px",
                          borderRadius: 6,
                          display: "inline-block",
                        }}
                      >
                        🤝 フロム・シェフ対応可: {item.supportLabel}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { val: "yes", label: "✅ はい", bg: "#16a34a" },
                        { val: "no", label: "❌ いいえ", bg: "#dc2626" },
                        { val: "unknown", label: "❓ わからない", bg: "#94a3b8" },
                      ].map(({ val, label, bg }) => (
                        <button
                          key={val}
                          onClick={() => answer(item.id, val)}
                          style={{
                            ...btnBase,
                            flex: 1,
                            padding: "8px 4px",
                            fontSize: 12,
                            background:
                              answers[item.id] === val ? bg : "#f1f5f9",
                            color:
                              answers[item.id] === val ? "#fff" : "#64748b",
                            border:
                              answers[item.id] === val
                                ? `2px solid ${bg}`
                                : "2px solid #e2e8f0",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ナビボタン */}
          <div style={{ display: "flex", gap: 10 }}>
            {catIdx > 0 && (
              <button
                onClick={() => setCatIdx((c) => c - 1)}
                style={{
                  ...btnBase,
                  flex: 1,
                  background: "#fff",
                  color: "#1A3A5C",
                  border: "2px solid #1A3A5C",
                }}
              >
                ← 前のカテゴリ
              </button>
            )}
            {!isLastCat ? (
              <button
                onClick={() => setCatIdx((c) => c + 1)}
                style={{
                  ...btnBase,
                  flex: 1,
                  background: currentCat.color,
                  color: "#fff",
                }}
              >
                次のカテゴリへ →
              </button>
            ) : (
              <button
                onClick={finish}
                style={{
                  ...btnBase,
                  flex: 1,
                  background: "#1A3A5C",
                  color: "#fff",
                  padding: "12px",
                }}
              >
                📊 結果を見る
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && score && (
        <div ref={resultRef}>
          {/* スコアカード */}
          <div
            style={{
              background: score.rank.bg,
              border: `2px solid ${score.rank.border}`,
              borderRadius: 16,
              padding: "24px",
              marginBottom: 16,
              boxShadow: "0 2px 20px rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: score.rank.color,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 16px ${score.rank.color}44`,
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {score.pct}%
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,.8)",
                    fontWeight: 700,
                  }}
                >
                  充足率
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: score.rank.color,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {score.rank.label}
                </div>
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 4,
                  }}
                >
                  {score.done} / {score.total} 項目 対応済み
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  未対応・不明のうち{" "}
                  <span style={{ color: score.rank.color, fontWeight: 700 }}>
                    {score.supportNeeded.length}項目
                  </span>{" "}
                  はフロム・シェフでサポート可能です
                </div>
              </div>
            </div>
          </div>

          {/* フロム・シェフでサポートできる項目 */}
          {score.supportNeeded.length > 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 16,
                boxShadow: "0 2px 14px rgba(0,0,0,.05)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 4px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                🤝 フロム・シェフでサポートできる項目
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b" }}>
                以下の項目について、フロム・シェフのサービスで対応が可能です。気になる項目からお問い合わせください。
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {score.supportNeeded.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: item.catColor,
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        {item.catLabel}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: "#334155",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                    <a
                      href={`${CONTACT_URL}?subject=${encodeURIComponent(
                        `【${item.supportLabel}】のお問い合わせ`
                      )}`}
                      style={{
                        ...btnBase,
                        background: "#1A3A5C",
                        color: "#fff",
                        fontSize: 12,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      📩 {item.supportLabel}を相談する
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* カテゴリ別スコア */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 16,
              boxShadow: "0 2px 14px rgba(0,0,0,.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              📊 カテゴリ別 充足状況
            </h3>
            {CATEGORIES.map((cat) => {
              const catDone = cat.items.filter(
                (i) => answers[i.id] === "yes"
              ).length;
              const catPct = Math.round((catDone / cat.items.length) * 100);
              return (
                <div key={cat.id} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: cat.color,
                      }}
                    >
                      {cat.icon} {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: cat.color,
                      }}
                    >
                      {catDone}/{cat.items.length}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "#e2e8f0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${catPct}%`,
                        height: "100%",
                        background: cat.color,
                        borderRadius: 4,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                setStep("intro");
                setCatIdx(0);
                setAnswers({});
              }}
              style={{
                ...btnBase,
                flex: 1,
                background: "#fff",
                color: "#1A3A5C",
                border: "2px solid #1A3A5C",
              }}
            >
              ← 最初からやり直す
            </button>
            <button
              onClick={() => window.print()}
              style={{
                ...btnBase,
                flex: 1,
                background: "#1A3A5C",
                color: "#fff",
              }}
            >
              🖨️ 結果を印刷 / PDF保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
