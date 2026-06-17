// ============================================================
// 共通フッター（フロム・シェフCTA + 会社情報 + 出典・注記）
// ============================================================

import { IconMail, IconExternalLink } from "./icons.jsx";
import { trackContactClick } from "../utils/analytics.js";
import { CONTACT_URL, buildContactUrl } from "../utils/contact.js";

export default function Footer({ onOpenContactForm }) {
  const openContact = (contactSource) => {
    if (onOpenContactForm) {
      onOpenContactForm({
        contactSource,
      });
      return;
    }

    trackContactClick(contactSource, { form_display: "new_tab_fallback" });
    window.open(CONTACT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <footer style={{ marginTop: 48 }}>
      {/* CTAセクション */}
      <div style={{ background: "var(--navy-800)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: 20,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            認定取得に向けたサポートが必要ですか？
          </h3>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 14,
              color: "rgba(255,255,255,.85)",
              lineHeight: 1.9,
            }}
          >
            健康経営優良法人の認定取得から、研修・体力測定・効果検証・健康白書作成まで
            <br />
            <strong style={{ color: "#fff" }}>フロム・シェフ</strong>
            が一気通貫でサポートします。
          </p>
          <button
            type="button"
            onClick={() => openContact("footer_main_cta")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              color: "var(--navy-800)",
              padding: "14px 36px",
              border: "none",
              borderRadius: "var(--radius-btn)",
              fontSize: 15,
              fontFamily: "inherit",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(0,0,0,.2)",
              cursor: "pointer",
            }}
          >
            <IconMail size={17} />
            無料相談を申し込む
          </button>
        </div>
      </div>

      {/* 会社情報・注記セクション */}
      <div style={{ background: "var(--navy-900)", padding: "28px 20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              paddingBottom: 18,
              marginBottom: 18,
              borderBottom: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                健康経営チェック&事例マップ
              </div>
              <a
                href="https://fromsheff.jp/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  color: "rgba(255,255,255,.65)",
                  textDecoration: "none",
                }}
              >
                運営：フロム・シェフ株式会社
                <IconExternalLink size={10} />
              </a>
            </div>
            <button
              type="button"
              onClick={() => openContact("footer_contact_link")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: 0,
                fontSize: 12,
                fontFamily: "inherit",
                color: "rgba(255,255,255,.65)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <IconMail size={13} />
              お問い合わせ
            </button>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "rgba(255,255,255,.5)",
              lineHeight: 1.9,
            }}
          >
            ※ 本サイトの情報は参考情報です。最終的な認定可否は経済産業省・日本健康会議の審査によります。
            <br />
            ※ 掲載事例は各企業の公式公開情報を元に編集したものです。最新情報は各社サイトをご確認ください。
            <br />
            ※ 評価項目は経済産業省「健康経営優良法人2026 認定要件」に基づいています。
          </p>
        </div>
      </div>
    </footer>
  );
}

export { CONTACT_URL, buildContactUrl };
