import { useState, useRef } from "react";

// ============================================================
// 評価項目データ（kenkokeiei_data.jsから移植）
// 実際のプロジェクトでは import { CATEGORIES } from "./kenkokeiei_data"
// ============================================================
const CATEGORIES = [
  {
    id: "cat1", label: "経営理念・体制", icon: "🏢", color: "#1A3A5C",
    items: [
      { id: "c1-1", text: "健康宣言を社内外に発信している（HP・統合報告書等）", required: true, canSupport: true, supportLabel: "健康宣言の策定・発信支援", hint: "健康経営の方針を文書化し、自社HPや求人媒体に掲載することが必要です。" },
      { id: "c1-2", text: "健康づくり責任者が役員以上に設置されている", required: true, canSupport: false, hint: "役員を健康づくり責任者に任命する社内体制の整備が必要です。" },
      { id: "c1-3", text: "健康経営を経営レベルの会議で議題にしている", required: false, canSupport: true, supportLabel: "健康経営コンサルティング", hint: "取締役会や経営会議の議事録に健康経営関連の議題を記録しておく必要があります。" },
      { id: "c1-4", text: "従業員のパフォーマンス指標・測定方法を開示している", required: false, canSupport: true, supportLabel: "ウェルネスレポート自動生成", hint: "プレゼンティーズムやアブセンティーズムの測定・開示が求められます。" },
    ],
  },
  {
    id: "cat2", label: "健康課題の把握と対策", icon: "🔍", color: "#0F6E56",
    items: [
      { id: "c2-1", text: "定期健康診断の受診率が100%である", required: true, canSupport: false, hint: "全従業員の健診受診を徹底することが必須です。" },
      { id: "c2-2", text: "受診勧奨の取り組みを実施している", required: true, canSupport: true, supportLabel: "ウェルネスレポート自動生成", hint: "健診結果に基づいた個別フォローや受診勧奨の仕組みが必要です。" },
      { id: "c2-3", text: "50人以上の事業場でストレスチェックを実施している", required: true, canSupport: true, supportLabel: "ウェルネスチャットbot", hint: "50人以上の事業場では法定のストレスチェックが義務です。" },
      { id: "c2-4", text: "50人未満の事業場でもストレスチェックを実施している", required: false, canSupport: true, supportLabel: "ウェルネスチャットbot", hint: "50人未満は努力義務ですが、実施で加点評価を受けられます。" },
      { id: "c2-5", text: "健康課題に基づいた具体的な目標・推進計画を策定している", required: true, canSupport: true, supportLabel: "健康経営コンサルティング", hint: "データ分析→課題特定→目標設定のPDCAが求められます。" },
    ],
  },
  {
    id: "cat3", label: "健康増進・具体的施策", icon: "💪", color: "#2563EB",
    items: [
      { id: "c3-1", text: "保健指導の実施、または特定保健指導の機会を提供している", required: true, canSupport: true, supportLabel: "ウェルネスレポート自動生成", hint: "生活習慣病予備群への保健指導が求められます。" },
      { id: "c3-2", text: "食生活の改善に向けた取り組みを実施している", required: false, canSupport: false, hint: "食堂でのヘルシーメニュー、栄養セミナー等が該当します。" },
      { id: "c3-3", text: "運動機会の増進に向けた取り組みを実施している", required: false, canSupport: true, supportLabel: "フィットネス事業・運動促進支援", hint: "ウォーキングイベント、スポーツ施設補助等が該当します。" },
      { id: "c3-4", text: "メンタルヘルス不調者への対応に関する取り組みを実施している", required: false, canSupport: true, supportLabel: "ウェルネスチャットbot", hint: "相談窓口設置、復職支援、管理職研修等が該当します。" },
      { id: "c3-5", text: "女性の健康保持・増進に向けた取り組みを実施している", required: false, canSupport: true, supportLabel: "健康経営コンサルティング", hint: "婦人科検診補助、更年期対応等が求められます。" },
      { id: "c3-6", text: "長時間労働者への対応に関する取り組みを実施している", required: false, canSupport: false, hint: "過重労働防止の面談実施、勤怠管理整備等が該当します。" },
      { id: "c3-7", text: "感染症予防に関する取り組みを実施している", required: false, canSupport: false, hint: "予防接種補助、感染症対策マニュアルの整備等が該当します。" },
      { id: "c3-8", text: "喫煙率低下・受動喫煙対策に関する取り組みを実施している", required: false, canSupport: false, hint: "禁煙支援プログラム、分煙対策等が該当します。" },
    ],
  },
  {
    id: "cat4", label: "ヘルスリテラシー・組織文化", icon: "📚", color: "#7C3AED",
    items: [
      { id: "c4-1", text: "管理職または従業員への健康教育・研修の機会を設けている", required: false, canSupport: true, supportLabel: "健康経営コンサルティング", hint: "参加率の測定が求められます。セミナー・eラーニング等が該当します。" },
      { id: "c4-2", text: "コミュニケーション促進に向けた取り組みを実施している", required: false, canSupport: true, supportLabel: "ウェルネスチャットbot", hint: "社内イベント、1on1制度、部署横断交流等が該当します。" },
      { id: "c4-3", text: "仕事と治療の両立支援の取り組みがある", required: false, canSupport: true, supportLabel: "健康経営コンサルティング", hint: "がん・糖尿病等の治療と仕事を両立できる制度・環境整備が求められます。" },
      { id: "c4-4", text: "産業医・保健師が健康増進施策に関与している", required: false, canSupport: true, supportLabel: "産業医・保健師連携支援", hint: "施策の立案・実施・評価への専門職の関与が必要です。" },
    ],
  },
  {
    id: "cat5", label: "評価・改善・法令遵守", icon: "📊", color: "#D97706",
    items: [
      { id: "c5-1", text: "健康経営施策の効果検証を実施している（PDCAを回している）", required: false, canSupport: true, supportLabel: "ウェルネスレポート自動生成", hint: "2026年度から「質」の評価にシフト。施策の結果・成果の測定・開示が重要です。" },
      { id: "c5-2", text: "健保組合等保険者と協議・連携している", required: false, canSupport: false, hint: "加入健保との連携した保健事業が評価されます。" },
      { id: "c5-3", text: "定期健診を実施している（労安衛法の遵守）", required: true, canSupport: false, hint: "法定の定期健診実施は必須要件です。" },
      { id: "c5-4", text: "労基法・労安衛法に係る違反により送検されていない", required: true, canSupport: false, hint: "法令違反があると認定の対象外となります。" },
    ],
  },
];

const CONTACT_URL = "mailto:info@example.com"; // ← 実際の問い合わせ先に変更

// スコア計算
function calcScore(answers) {
  let total = 0, done = 0, supportNeeded = [];
  CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      total++;
      if (answers[item.id] === "yes") done++;
      if (answers[item.id] === "no" && item.canSupport) supportNeeded.push({ ...item, catLabel: cat.label, catColor: cat.color });
      if (answers[item.id] === "unknown" && item.canSupport) supportNeeded.push({ ...item, catLabel: cat.label, catColor: cat.color });
    });
  });
  const pct = Math.round((done / total) * 100);
  const rank = pct >= 80 ? { label: "認定圏内の可能性大", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" }
    : pct >= 60 ? { label: "あと少しで認定圏内", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" }
    : { label: "取り組み強化が必要", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };
  return { total, done, pct, rank, supportNeeded };
}

export default function App() {
  const [step, setStep] = useState("intro"); // intro | check | result
  const [catIdx, setCatIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const resultRef = useRef(null);

  const allItems = CATEGORIES.flatMap(c => c.items);
  const answeredCount = Object.keys(answers).length;
  const totalItems = allItems.length;
  const progress = Math.round((answeredCount / totalItems) * 100);

  const currentCat = CATEGORIES[catIdx];
  const catAnswered = currentCat.items.every(i => answers[i.id]);
  const isLastCat = catIdx === CATEGORIES.length - 1;

  const answer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const finish = () => {
    setStep("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const score = step === "result" ? calcScore(answers) : null;

  const btnBase = { padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none" };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Hiragino Kaku Gothic ProN','Meiryo',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1A3A5C,#2563EB)", padding: "18px 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,.6)" }}>健康経営優良法人2026</div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>認定セルフチェック</h1>
            </div>
          </div>
          {step === "check" && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)", marginBottom: 4 }}>回答進捗 {answeredCount}/{totalItems}</div>
              <div style={{ width: 160, height: 6, background: "rgba(255,255,255,.2)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#4ADE80", borderRadius: 3, transition: "width .3s" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* Intro */}
        {step === "intro" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,.07)", marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 800, color: "#1A3A5C" }}>
                健康経営優良法人の認定、<br />御社は取得できますか？
              </h2>
              <p style={{ margin: "0 0 20px", fontSize: 14, color: "#475569", lineHeight: 1.8 }}>
                経済産業省が推進する「健康経営優良法人認定制度」の評価項目に基づき、
                自社の取り組み状況を約3〜5分でセルフチェックできます。
                チェック後、弊社が支援できる項目を一覧で確認し、そのままお問い合わせいただけます。
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { icon: "⏱", label: "所要時間", val: "約3〜5分" },
                  { icon: "📋", label: "チェック項目", val: `${totalItems}項目` },
                  { icon: "🆓", label: "料金", val: "無料" },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: "#F0F4FF", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3A5C" }}>{val}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("check")} style={{ ...btnBase, width: "100%", padding: "14px", fontSize: 16, background: "#1A3A5C", color: "#fff", borderRadius: 10 }}>
                🚀 チェックを開始する（無料）
              </button>
            </div>

            {/* カテゴリ一覧 */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>チェックするカテゴリ</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f8fafc", borderRadius: 8 }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{cat.label}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{cat.items.length}項目</span>
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
            <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {CATEGORIES.map((cat, i) => {
                const done = cat.items.every(item => answers[item.id]);
                return (
                  <button key={cat.id} onClick={() => setCatIdx(i)}
                    style={{ ...btnBase, padding: "6px 14px", fontSize: 12, background: catIdx === i ? cat.color : "#fff", color: catIdx === i ? "#fff" : "#64748b", border: `1.5px solid ${catIdx === i ? cat.color : "#e2e8f0"}`, whiteSpace: "nowrap", position: "relative" }}>
                    {cat.icon} {cat.label}
                    {done && <span style={{ marginLeft: 4, color: catIdx === i ? "#fff" : "#16a34a" }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* 現在カテゴリ */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,.06)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 26 }}>{currentCat.icon}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: currentCat.color }}>{currentCat.label}</h2>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{currentCat.items.length}項目 · 各項目に「はい／いいえ／わからない」で回答してください</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {currentCat.items.map((item, i) => (
                  <div key={item.id} style={{ border: `1.5px solid ${answers[item.id] ? "#e2e8f0" : "#f1f5f9"}`, borderRadius: 12, padding: "16px", background: answers[item.id] === "yes" ? "#f0fdf4" : answers[item.id] === "no" ? "#fef2f2" : "#fafafa" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                      {item.required && <span style={{ background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, flexShrink: 0, marginTop: 2 }}>必須</span>}
                      <p style={{ margin: 0, fontSize: 13, color: "#0f172a", fontWeight: 500, lineHeight: 1.6 }}>{item.text}</p>
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>💡 {item.hint}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { val: "yes", label: "✅ はい", bg: "#16a34a" },
                        { val: "no", label: "❌ いいえ", bg: "#dc2626" },
                        { val: "unknown", label: "❓ わからない", bg: "#94a3b8" },
                      ].map(({ val, label, bg }) => (
                        <button key={val} onClick={() => answer(item.id, val)}
                          style={{ ...btnBase, flex: 1, padding: "8px 4px", fontSize: 12, background: answers[item.id] === val ? bg : "#f1f5f9", color: answers[item.id] === val ? "#fff" : "#64748b", border: answers[item.id] === val ? `2px solid ${bg}` : "2px solid #e2e8f0" }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ナビボタン */}
            <div style={{ display: "flex", gap: 10 }}>
              {catIdx > 0 && (
                <button onClick={() => setCatIdx(c => c - 1)} style={{ ...btnBase, flex: 1, background: "#fff", color: "#1A3A5C", border: "2px solid #1A3A5C" }}>
                  ← 前のカテゴリ
                </button>
              )}
              {!isLastCat ? (
                <button onClick={() => setCatIdx(c => c + 1)}
                  style={{ ...btnBase, flex: 1, background: currentCat.color, color: "#fff" }}>
                  次のカテゴリへ →
                </button>
              ) : (
                <button onClick={finish}
                  style={{ ...btnBase, flex: 1, background: "#1A3A5C", color: "#fff", padding: "12px" }}>
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
            <div style={{ background: score.rank.bg, border: `2px solid ${score.rank.border}`, borderRadius: 16, padding: "24px", marginBottom: 16, boxShadow: "0 2px 20px rgba(0,0,0,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: score.rank.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 16px ${score.rank.color}44` }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score.pct}%</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,.8)", fontWeight: 700 }}>充足率</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: score.rank.color, letterSpacing: "0.08em", marginBottom: 4 }}>{score.rank.label}</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{score.done} / {score.total} 項目 対応済み</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    未対応・不明のうち <span style={{ color: score.rank.color, fontWeight: 700 }}>{score.supportNeeded.length}項目</span> は弊社でサポート可能です
                  </div>
                </div>
              </div>
            </div>

            {/* 弊社でサポートできる項目 */}
            {score.supportNeeded.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 16, boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>🤝 弊社でサポートできる項目</h3>
                <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b" }}>以下の項目について、弊社サービスで対応が可能です。気になる項目からお問い合わせください。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {score.supportNeeded.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: 10, color: item.catColor, fontWeight: 700, marginBottom: 3 }}>{item.catLabel}</div>
                        <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{item.text}</p>
                      </div>
                      <a href={`${CONTACT_URL}?subject=${encodeURIComponent(`【${item.supportLabel}】のお問い合わせ`)}`}
                        style={{ ...btnBase, background: "#1A3A5C", color: "#fff", fontSize: 12, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                        📩 {item.supportLabel}を相談する
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* カテゴリ別スコア */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 16, boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>📊 カテゴリ別 充足状況</h3>
              {CATEGORIES.map(cat => {
                const catDone = cat.items.filter(i => answers[i.id] === "yes").length;
                const catPct = Math.round((catDone / cat.items.length) * 100);
                return (
                  <div key={cat.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: cat.color }}>{cat.icon} {cat.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{catDone}/{cat.items.length}</span>
                    </div>
                    <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${catPct}%`, height: "100%", background: cat.color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAバナー */}
            <div style={{ background: "linear-gradient(135deg,#1A3A5C,#2563EB)", borderRadius: 16, padding: "24px", marginBottom: 20, color: "#fff", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800 }}>認定取得を一緒に進めませんか？</h3>
              <p style={{ margin: "0 0 16px", fontSize: 13, opacity: .9, lineHeight: 1.7 }}>
                健康経営優良法人の認定取得から、ウェルネスデータの収集・分析・活用まで<br />
                弊社が一気通貫でサポートします。まずはお気軽にご相談ください。
              </p>
              <a href={CONTACT_URL} style={{ display: "inline-block", background: "#fff", color: "#1A3A5C", padding: "12px 32px", borderRadius: 10, fontSize: 14, fontWeight: 800, textDecoration: "none" }}>
                📩 無料相談を申し込む
              </a>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep("intro"); setCatIdx(0); setAnswers({}); }}
                style={{ ...btnBase, flex: 1, background: "#fff", color: "#1A3A5C", border: "2px solid #1A3A5C" }}>
                ← 最初からやり直す
              </button>
              <button onClick={() => window.print()}
                style={{ ...btnBase, flex: 1, background: "#1A3A5C", color: "#fff" }}>
                🖨️ 結果を印刷 / PDF保存
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: 10, color: "#cbd5e1", marginTop: 20 }}>
              ※ 本チェックは参考情報です。最終的な認定可否は経済産業省・日本健康会議の審査によります。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

