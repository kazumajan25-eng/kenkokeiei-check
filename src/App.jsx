// ============================================================
// App.jsx - タブ切替の親コンポーネント
// ============================================================
// [事例を探す] [セルフチェック] の2タブ構成
// URLハッシュ（#cases / #check）と連動し、ブラウザの戻る/進むでも
// タブを行き来できる
// ============================================================

import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CaseSearch from "./components/CaseSearch.jsx";
import SelfCheck from "./components/SelfCheck.jsx";
import { trackPageView } from "./utils/analytics.js";

const TAB_HASH = { cases: "#cases", selfcheck: "#check" };

function tabFromHash() {
  return window.location.hash === "#check" ? "selfcheck" : "cases";
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(tabFromHash);

  // URLハッシュの変化（戻る/進むを含む）でタブを切り替える
  useEffect(() => {
    const onHashChange = () => setActiveTabState(tabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // タブ切替時に画面トップへ
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activeTab]);

  // GA4へタブごとのページ表示を送信する
  useEffect(() => {
    trackPageView(activeTab);
  }, [activeTab]);

  const setActiveTab = (tab, options = {}) => {
    if (tab === activeTab) {
      if (options.scrollTop) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    window.location.hash = TAB_HASH[tab]; // hashchangeイベント経由でstateが更新される
  };

  return (
    <div
      style={{
        minHeight: "100vh",
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
