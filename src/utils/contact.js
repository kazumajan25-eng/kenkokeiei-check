// ============================================================
// 問い合わせフォームURLの共通管理
// ============================================================
// Googleフォーム本体と事前入力項目IDはここだけで管理する。
// 画面側では通常表示用・サイト内埋め込み用のURLを使い分ける。
// ============================================================

const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfAbiVb5Xv37mAM3YM5YbH9sxZOX8UfdiwI-dHsG1vAFpR9mQ/viewform";

// Googleフォーム「気になった項目・事例」の事前入力欄
const CONTACT_PREFILL_FIELD = "entry.86723895";

function buildContactUrl(prefillText = "", options = {}) {
  const params = [];

  if (options.embedded) {
    params.push("embedded=true");
  }

  if (prefillText) {
    params.push("usp=pp_url");
    params.push(`${CONTACT_PREFILL_FIELD}=${encodeURIComponent(prefillText)}`);
  }

  const query = params.join("&");
  return query ? `${CONTACT_FORM_URL}?${query}` : CONTACT_FORM_URL;
}

function buildContactEmbedUrl(prefillText = "") {
  return buildContactUrl(prefillText, { embedded: true });
}

const CONTACT_URL = buildContactUrl();

export { CONTACT_URL, buildContactUrl, buildContactEmbedUrl };
