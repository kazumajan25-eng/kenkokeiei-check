// ============================================================
// 共通ヘッダー（サイトタイトル + 運営者表記 + アンダーライン式タブ）
// ============================================================

import { IconSearch, IconClipboard, IconExternalLink } from "./icons.jsx";

const TABS = [
  { id: "cases", label: "事例から学ぶ", Icon: IconSearch },
  { id: "selfcheck", label: "セルフチェック", Icon: IconClipboard },
];

export default function Header({ activeTab, setActiveTab }) {
  const goHome = () => setActiveTab("cases", { scrollTop: true });

  return (
    <div
      style={{
        background: "var(--navy-900)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        boxShadow: "0 2px 12px rgba(10, 20, 40, 0.3)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 20px 0",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* タイトル + 運営者 */}
        <div style={{ paddingBottom: 12 }}>
          <button
            type="button"
            onClick={goHome}
            aria-label="ホームに戻る"
            style={{
              display: "block",
              padding: 0,
              margin: 0,
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "rgba(255,255,255,.55)",
              }}
            >
              事例で学ぶ健康経営
            </div>
            <h1
              style={{
                margin: "1px 0 2px",
                fontSize: 18,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "0.02em",
                lineHeight: 1.4,
              }}
            >
              健康経営ガイドマップ
            </h1>
            <div
              style={{
                marginBottom: 2,
                fontSize: 11,
                color: "rgba(255,255,255,.72)",
                lineHeight: 1.6,
              }}
            >
              好事例を学び、セルフチェックで次の一手を見つける
            </div>
          </button>
          <a
            href="https://fromsheff.jp/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "rgba(255,255,255,.55)",
              textDecoration: "none",
            }}
          >
            運営：フロム・シェフ株式会社
            <IconExternalLink size={10} />
          </a>
        </div>

        {/* アンダーライン式タブ */}
        <nav style={{ display: "flex", gap: 4 }}>
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "12px 14px",
                  fontSize: 14,
                  fontWeight: 700,
                  background: "transparent",
                  border: "none",
                  borderBottom: active
                    ? "3px solid var(--teal-300)"
                    : "3px solid transparent",
                  color: active ? "#fff" : "rgba(255,255,255,.65)",
                  transition: "color .15s, border-color .15s",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
