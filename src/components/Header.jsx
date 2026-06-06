// ============================================================
// 共通ヘッダー（タブ切替 + サイトタイトル）
// ============================================================

export default function Header({ activeTab, setActiveTab }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1A3A5C,#2563EB)",
        padding: "16px 20px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* ロゴ・タイトル */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🏆</span>
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,.65)",
              }}
            >
              健康経営優良法人2026
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: ".02em",
              }}
            >
              認定サポートサイト
            </h1>
          </div>
        </div>

        {/* タブ */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "rgba(255,255,255,.12)",
            padding: 4,
            borderRadius: 10,
          }}
        >
          {[
            { id: "cases", label: "🔍 事例を探す" },
            { id: "selfcheck", label: "✅ セルフチェック" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#1A3A5C" : "#fff",
                transition: "all .2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
