// ============================================================
// セルフチェック画面
// ============================================================
// - 公式評価項目（29項目）に「はい／いいえ／わからない」で回答
// - 必須バッジは「必須（大規模法人）」と「銘柄・500必須」を区別
// - 未回答がある状態で結果に進もうとすると、未回答項目へ案内
// - 結果画面はドーナツグラフで充足率を表示
// ============================================================

import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "../data/categories.js";
import { buildContactUrl } from "./Footer.jsx";
import { trackContactClick, trackEvent } from "../utils/analytics.js";
import {
  IconCheck,
  IconX,
  IconHelp,
  IconClock,
  IconList,
  IconHandshake,
  IconMail,
  IconPrinter,
  IconRefresh,
  IconArrowRight,
  IconInfo,
  CATEGORY_ICONS,
  circledNumber,
} from "./icons.jsx";

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
        supportNeeded.push({ ...item, catLabel: cat.label });
      }
    });
  });
  const pct = Math.round((done / total) * 100);
  const rank =
    pct >= 80
      ? {
          label: "認定圏内の可能性大",
          color: "var(--green-600)",
          bg: "var(--green-50)",
          border: "#86efac",
        }
      : pct >= 60
      ? {
          label: "あと少しで認定圏内",
          color: "var(--amber-700)",
          bg: "var(--amber-50)",
          border: "#fcd34d",
        }
      : {
          label: "取り組み強化が必要",
          color: "var(--red-600)",
          bg: "var(--red-50)",
          border: "#fca5a5",
        };
  return { total, done, pct, rank, supportNeeded };
}

// 充足率ドーナツグラフ（マウント後にアニメーション）
function Donut({ pct, color }) {
  const C = 2 * Math.PI * 42; // 円周
  const [offset, setOffset] = useState(C);
  useEffect(() => {
    const t = setTimeout(() => setOffset(C * (1 - pct / 100)), 150);
    return () => clearTimeout(t);
  }, [pct, C]);
  return (
    <svg width="120" height="120" viewBox="0 0 100 100" aria-label={`充足率${pct}%`}>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="var(--line-200)"
        strokeWidth="10"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1.1s ease" }}
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        fontSize="21"
        fontWeight="900"
        fill={color}
      >
        {pct}%
      </text>
      <text x="50" y="64" textAnchor="middle" fontSize="8" fill="var(--ink-500)">
        充足率
      </text>
    </svg>
  );
}

export default function SelfCheck() {
  const [step, setStep] = useState("intro"); // intro | check | result
  const [catIdx, setCatIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flashId, setFlashId] = useState(null);
  const resultRef = useRef(null);

  const allItems = CATEGORIES.flatMap((c) => c.items);
  const answeredCount = Object.keys(answers).length;
  const totalItems = allItems.length;
  const progress = Math.round((answeredCount / totalItems) * 100);
  const unansweredCount = totalItems - answeredCount;

  const currentCat = CATEGORIES[catIdx];
  const isLastCat = catIdx === CATEGORIES.length - 1;

  const answer = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));

  const startCheck = () => {
    trackEvent("self_check_start", {
      total_items: totalItems,
    });
    setStep("check");
  };

  const finish = () => {
    const nextScore = calcScore(answers);
    const answered = Object.keys(answers).length;

    trackEvent("self_check_complete", {
      score_percent: nextScore.pct,
      completed_items: nextScore.done,
      total_items: nextScore.total,
      answered_items: answered,
      unanswered_items: nextScore.total - answered,
      support_needed_count: nextScore.supportNeeded.length,
      result_label: nextScore.rank.label,
    });

    setStep("result");
    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  // 最初の未回答項目へジャンプ
  const jumpToFirstUnanswered = () => {
    for (let i = 0; i < CATEGORIES.length; i++) {
      const item = CATEGORIES[i].items.find((it) => !answers[it.id]);
      if (item) {
        setCatIdx(i);
        setFlashId(item.id);
        setTimeout(() => {
          document
            .getElementById(`sc-item-${item.id}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
        setTimeout(() => setFlashId(null), 1800);
        return;
      }
    }
  };

  const score = step === "result" ? calcScore(answers) : null;

  const btnBase = {
    padding: "9px 18px",
    borderRadius: "var(--radius-btn)",
    fontSize: 13,
    fontWeight: 700,
    border: "none",
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px 40px" }}>
      {/* 進捗バー（チェック中のみ） */}
      {step === "check" && (
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            padding: "12px 18px",
            marginBottom: 16,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-500)" }}>
              回答状況
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--navy-800)" }}>
              {answeredCount} / {totalItems} 項目（{progress}%）
            </span>
          </div>
          <div
            style={{
              height: 7,
              background: "var(--line-200)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--teal-600)",
                borderRadius: 4,
                transition: "width .3s",
              }}
            />
          </div>
        </div>
      )}

      {/* ---------------- Intro ---------------- */}
      {step === "intro" && (
        <div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-card)",
              padding: "32px 30px",
              boxShadow: "var(--shadow-card)",
              marginBottom: 16,
              borderTop: "4px solid var(--navy-800)",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--navy-800)",
                lineHeight: 1.6,
              }}
            >
              健康経営優良法人の認定、
              <br />
              御社は取得できますか？
            </h2>
            <p
              style={{
                margin: "0 0 22px",
                fontSize: 14,
                color: "var(--ink-700)",
                lineHeight: 1.9,
              }}
            >
              経済産業省「健康経営優良法人認定制度」の評価項目に基づき、
              自社の取り組み状況を約3〜5分でセルフチェックできます。
              チェック後、フロム・シェフが支援できる項目を一覧で確認し、そのままお問い合わせいただけます。
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {[
                { Icon: IconClock, label: "所要時間", val: "約3〜5分" },
                { Icon: IconList, label: "チェック項目", val: `${totalItems}項目` },
                { Icon: IconCheck, label: "料金", val: "無料" },
              ].map(({ Icon, label, val }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--line-100)",
                    borderRadius: 10,
                    padding: "16px 10px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "var(--navy-800)",
                      marginBottom: 6,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)", marginBottom: 2 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--navy-800)" }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={startCheck}
              style={{
                ...btnBase,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "15px",
                fontSize: 15,
                background: "var(--navy-800)",
                color: "#fff",
                borderRadius: 10,
              }}
            >
              チェックを開始する（無料）
              <IconArrowRight size={16} />
            </button>
          </div>

          {/* カテゴリ一覧 */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-card)",
              padding: "22px 26px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--ink-900)",
              }}
            >
              チェックするカテゴリ
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const CatIcon = CATEGORY_ICONS[cat.id];
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      background: "var(--line-100)",
                      borderRadius: 9,
                    }}
                  >
                    <span style={{ color: "var(--navy-800)", display: "flex" }}>
                      <CatIcon size={17} />
                    </span>
                    <div>
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "var(--navy-800)",
                        }}
                      >
                        {cat.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--ink-400)",
                          marginLeft: 8,
                        }}
                      >
                        {cat.items.length}項目
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Check ---------------- */}
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
              const active = catIdx === i;
              const CatIcon = CATEGORY_ICONS[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setCatIdx(i)}
                  style={{
                    ...btnBase,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    fontSize: 12.5,
                    background: active ? "var(--navy-800)" : "#fff",
                    color: active ? "#fff" : "var(--ink-500)",
                    border: `1.5px solid ${active ? "var(--navy-800)" : "var(--line-200)"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <CatIcon size={13} />
                  {cat.label}
                  {done && (
                    <span
                      style={{
                        display: "flex",
                        color: active ? "var(--teal-300)" : "var(--teal-600)",
                      }}
                    >
                      <IconCheck size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 現在カテゴリ */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-card)",
              padding: "24px",
              boxShadow: "var(--shadow-card)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--line-100)",
              }}
            >
              <span style={{ color: "var(--navy-800)", display: "flex" }}>
                {(() => {
                  const CatIcon = CATEGORY_ICONS[currentCat.id];
                  return <CatIcon size={24} />;
                })()}
              </span>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--navy-800)",
                  }}
                >
                  {currentCat.label}
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ink-400)" }}>
                  {currentCat.items.length}項目 ·
                  各項目に「はい／いいえ／わからない」で回答してください
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {currentCat.items.map((item) => (
                <div
                  key={item.id}
                  id={`sc-item-${item.id}`}
                  className={flashId === item.id ? "flash" : undefined}
                  style={{
                    border: "1.5px solid var(--line-200)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    background:
                      answers[item.id] === "yes"
                        ? "var(--green-50)"
                        : answers[item.id] === "no"
                        ? "var(--red-50)"
                        : "#fff",
                  }}
                >
                  {/* 小項目（補助情報） */}
                  {item.subCategory && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-400)",
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {item.midCategory && `${item.midCategory} ／ `}
                      {item.subCategory}
                    </div>
                  )}

                  {/* バッジ + 設問 */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                      marginBottom: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.requiredLarge && (
                      <span
                        style={{
                          background: "var(--red-600)",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      >
                        必須
                      </span>
                    )}
                    {!item.requiredLarge && item.requiredWhite500 && (
                      <span
                        title="健康経営銘柄・ホワイト500を目指す場合に必須"
                        style={{
                          background: "#fff",
                          color: "var(--navy-700)",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: 4,
                          border: "1.5px solid var(--navy-700)",
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      >
                        銘柄・500必須
                      </span>
                    )}
                    {item.selectableNo && (
                      <span
                        style={{
                          background: "var(--line-100)",
                          color: "var(--ink-500)",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      >
                        選択{circledNumber(item.selectableNo)}
                      </span>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        color: "var(--ink-900)",
                        fontWeight: 600,
                        lineHeight: 1.7,
                        flex: 1,
                        minWidth: 200,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>

                  <p
                    style={{
                      display: "flex",
                      gap: 6,
                      margin: "0 0 10px",
                      fontSize: 12,
                      color: "var(--ink-500)",
                      lineHeight: 1.7,
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: 3 }}>
                      <IconInfo size={12} />
                    </span>
                    {item.hint}
                  </p>

                  {item.canSupport && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "var(--teal-700)",
                        marginBottom: 12,
                        fontWeight: 700,
                        background: "var(--teal-50)",
                        padding: "5px 12px",
                        borderRadius: 7,
                      }}
                    >
                      <IconHandshake size={13} />
                      フロム・シェフ対応可: {item.supportLabel}
                    </div>
                  )}

                  {/* 回答ボタン */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      {
                        val: "yes",
                        label: "はい",
                        Icon: IconCheck,
                        bg: "var(--teal-600)",
                      },
                      {
                        val: "no",
                        label: "いいえ",
                        Icon: IconX,
                        bg: "var(--red-600)",
                      },
                      {
                        val: "unknown",
                        label: "わからない",
                        Icon: IconHelp,
                        bg: "var(--ink-500)",
                      },
                    ].map(({ val, label, Icon, bg }) => {
                      const selected = answers[item.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => answer(item.id, val)}
                          style={{
                            ...btnBase,
                            flex: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: "9px 4px",
                            fontSize: 13,
                            background: selected ? bg : "#fff",
                            color: selected ? "#fff" : "var(--ink-500)",
                            border: selected
                              ? `2px solid ${bg}`
                              : "2px solid var(--line-200)",
                          }}
                        >
                          <Icon size={13} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ナビボタン */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {catIdx > 0 && (
              <button
                onClick={() => setCatIdx((c) => c - 1)}
                style={{
                  ...btnBase,
                  flex: 1,
                  minWidth: 140,
                  background: "#fff",
                  color: "var(--navy-800)",
                  border: "2px solid var(--navy-800)",
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
                  minWidth: 140,
                  background: "var(--navy-800)",
                  color: "#fff",
                }}
              >
                次のカテゴリへ →
              </button>
            ) : unansweredCount > 0 ? (
              <button
                onClick={jumpToFirstUnanswered}
                style={{
                  ...btnBase,
                  flex: 1,
                  minWidth: 180,
                  background: "var(--amber-700)",
                  color: "#fff",
                  padding: "12px",
                }}
              >
                未回答が{unansweredCount}件あります — 回答に戻る
              </button>
            ) : (
              <button
                onClick={finish}
                style={{
                  ...btnBase,
                  flex: 1,
                  minWidth: 140,
                  background: "var(--navy-800)",
                  color: "#fff",
                  padding: "12px",
                }}
              >
                結果を見る
              </button>
            )}
          </div>

          {/* 未回答でも結果を見たい場合の逃げ道 */}
          {isLastCat && unansweredCount > 0 && (
            <p style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={finish}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  color: "var(--ink-400)",
                  textDecoration: "underline",
                }}
              >
                未回答のまま結果を見る（未回答は「未対応」として集計されます）
              </button>
            </p>
          )}
        </div>
      )}

      {/* ---------------- Result ---------------- */}
      {step === "result" && score && (
        <div ref={resultRef}>
          {/* スコアカード */}
          <div
            style={{
              background: score.rank.bg,
              border: `2px solid ${score.rank.border}`,
              borderRadius: "var(--radius-card)",
              padding: "26px 28px",
              marginBottom: 16,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <Donut pct={score.pct} color={score.rank.color} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    fontSize: 12,
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
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--ink-900)",
                    marginBottom: 6,
                  }}
                >
                  {score.done} / {score.total} 項目 対応済み
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-700)", lineHeight: 1.7 }}>
                  未対応・不明のうち{" "}
                  <strong style={{ color: "var(--teal-700)" }}>
                    {score.supportNeeded.length}項目
                  </strong>{" "}
                  はフロム・シェフでサポート可能です
                </div>
              </div>
            </div>
          </div>

          {/* サポート可能項目 */}
          {score.supportNeeded.length > 0 && (
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-card)",
                padding: "22px 26px",
                marginBottom: 16,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "0 0 6px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--ink-900)",
                }}
              >
                <span style={{ color: "var(--teal-600)", display: "flex" }}>
                  <IconHandshake size={17} />
                </span>
                フロム・シェフでサポートできる項目
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--ink-500)" }}>
                以下の項目はフロム・シェフのサービスで対応が可能です。気になる項目からお問い合わせください。
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {score.supportNeeded.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid var(--line-200)",
                      borderLeft: "3px solid var(--teal-600)",
                      borderRadius: 10,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--ink-400)",
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        {item.catLabel}
                      </div>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: 13.5,
                          color: "var(--ink-900)",
                          fontWeight: 600,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.text}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--teal-700)", fontWeight: 600 }}>
                        {item.supportLabel}
                      </p>
                    </div>
                    <a
                      href={buildContactUrl(`項目: ${item.id} ${item.text}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackContactClick("self_check_item", {
                          item_id: item.id,
                          item_name: item.text,
                        })
                      }
                      style={{
                        ...btnBase,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--teal-600)",
                        color: "#fff",
                        fontSize: 12.5,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <IconMail size={13} />
                      相談する
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* カテゴリ別スコア */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-card)",
              padding: "22px 26px",
              marginBottom: 16,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--ink-900)",
              }}
            >
              カテゴリ別 充足状況
            </h3>
            {CATEGORIES.map((cat) => {
              const catDone = cat.items.filter(
                (i) => answers[i.id] === "yes"
              ).length;
              const catPct = Math.round((catDone / cat.items.length) * 100);
              const CatIcon = CATEGORY_ICONS[cat.id];
              return (
                <div key={cat.id} style={{ marginBottom: 13 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--navy-800)",
                      }}
                    >
                      <CatIcon size={13} />
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--navy-800)",
                      }}
                    >
                      {catDone}/{cat.items.length}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "var(--line-200)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${catPct}%`,
                        height: "100%",
                        background: "var(--navy-700)",
                        borderRadius: 4,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 操作ボタン */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setStep("intro");
                setCatIdx(0);
                setAnswers({});
              }}
              style={{
                ...btnBase,
                flex: 1,
                minWidth: 160,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "#fff",
                color: "var(--navy-800)",
                border: "2px solid var(--navy-800)",
              }}
            >
              <IconRefresh size={14} />
              最初からやり直す
            </button>
            <button
              onClick={() => window.print()}
              style={{
                ...btnBase,
                flex: 1,
                minWidth: 160,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "var(--navy-800)",
                color: "#fff",
              }}
            >
              <IconPrinter size={14} />
              結果を印刷 / PDF保存
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "var(--ink-400)",
              marginTop: 20,
            }}
          >
            ※ 本チェックは参考情報です。最終的な認定可否は経済産業省・日本健康会議の審査によります。
          </p>
        </div>
      )}
    </div>
  );
}
