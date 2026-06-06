// ============================================================
// App.jsx - タブ切替の親コンポーネント
// ============================================================
// [🔍 事例を探す] [✅ セルフチェック] の2タブ構成
// ============================================================

import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CaseSearch from "./components/CaseSearch.jsx";
import SelfCheck from "./components/SelfCheck.jsx";

export default function App() {
  // 起動時のタブ: "cases" (事例検索) | "selfcheck" (セルフチェック)
  const [activeTab, setActiveTab] = useState("cases");

  // タブ切替時に画面トップへスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'Hiragino Kaku Gothic ProN','Meiryo',sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1 }}>
        {activeTab === "cases" && <CaseSearch />}
        {activeTab === "selfcheck" && <SelfCheck />}
      </main>

      <Footer />
    </div>
  );
}
