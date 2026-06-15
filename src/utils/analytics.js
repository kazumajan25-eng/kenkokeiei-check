// ============================================================
// GA4計測ユーティリティ
// ============================================================
// 画面遷移・セルフチェック完了・問い合わせクリックなど、
// 事業上見たい行動をイベントとして送信するための共通関数。
// ============================================================

const PAGE_TITLES = {
  cases: "事例から学ぶ | 健康経営ガイドマップ",
  selfcheck: "セルフチェック | 健康経営ガイドマップ",
};

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function currentPagePath() {
  const hash = window.location.hash || "#cases";
  return `${window.location.pathname}${window.location.search}${hash}`;
}

export function trackEvent(eventName, params = {}) {
  if (!canTrack()) return;

  window.gtag("event", eventName, params);
}

export function trackPageView(activeTab) {
  if (!canTrack()) return;

  window.gtag("event", "page_view", {
    page_title: PAGE_TITLES[activeTab] || document.title,
    page_location: window.location.href,
    page_path: currentPagePath(),
  });
}

export function trackContactClick(contactSource, params = {}) {
  trackEvent("contact_click", {
    contact_source: contactSource,
    ...params,
  });
}
