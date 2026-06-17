// ============================================================
// サイト内問い合わせフォームモーダル
// ============================================================
// Googleフォームをサイト内に埋め込み、離脱せずに申し込みできるようにする。
// 表示できない環境向けに、新しいタブで開く導線も残す。
// ============================================================

import { useEffect } from "react";
import { IconExternalLink, IconX } from "./icons.jsx";
import { trackEvent } from "../utils/analytics.js";

export default function ContactFormModal({
  isOpen,
  formUrl,
  fallbackUrl,
  sourceLabel,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExternalOpen = () => {
    trackEvent("contact_form_external_open", {
      source_label: sourceLabel || "汎用CTA",
    });
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        background: "rgba(8, 23, 44, .68)",
        backdropFilter: "blur(8px)",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="無料相談フォーム"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(980px, calc(100vw - 24px))",
          height: "min(760px, calc(100vh - 24px))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--bg-card)",
          borderRadius: 22,
          boxShadow: "0 28px 80px rgba(8, 23, 44, .38)",
          border: "1px solid rgba(255,255,255,.3)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            padding: "20px 22px 16px",
            borderBottom: "1px solid var(--line-100)",
            background: "linear-gradient(135deg, #fff 0%, var(--teal-50) 100%)",
          }}
        >
          <div>
            <div
              style={{
                marginBottom: 6,
                fontSize: 12,
                fontWeight: 800,
                color: "var(--teal-700)",
                letterSpacing: ".04em",
              }}
            >
              サイト内で申し込み
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(20px, 3vw, 26px)",
                color: "var(--navy-800)",
                fontWeight: 900,
              }}
            >
              無料相談フォーム
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                color: "var(--ink-500)",
                lineHeight: 1.7,
              }}
            >
              {sourceLabel
                ? `${sourceLabel}について、相談内容を事前入力しています。`
                : "必要事項を入力すると、そのままフロム・シェフへ相談できます。"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="フォームを閉じる"
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-500)",
              background: "rgba(255,255,255,.82)",
              border: "1px solid var(--line-100)",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <IconX size={18} />
          </button>
        </header>

        <div style={{ flex: 1, minHeight: 0, background: "#fff" }}>
          <iframe
            src={formUrl}
            title="無料相談フォーム"
            loading="lazy"
            style={{ width: "100%", height: "100%", border: 0 }}
          />
        </div>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            padding: "12px 18px",
            borderTop: "1px solid var(--line-100)",
            background: "var(--bg-soft)",
            fontSize: 12,
            color: "var(--ink-500)",
          }}
        >
          <span>フォームが表示されない場合は、別タブで開いて入力できます。</span>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalOpen}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              color: "var(--teal-700)",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            新しいタブで開く
            <IconExternalLink size={12} />
          </a>
        </footer>
      </section>
    </div>
  );
}
