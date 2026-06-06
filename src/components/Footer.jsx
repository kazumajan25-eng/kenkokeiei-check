// ============================================================
// 共通フッター（フロム・シェフCTA + 出典・注記）
// ============================================================

const CONTACT_URL = "mailto:info@example.com"; // ← 実際の問い合わせ先に変更

export default function Footer() {
  return (
    <div
      style={{
        background: "#1A3A5C",
        padding: "36px 20px 24px",
        marginTop: 40,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {/* CTA */}
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 19,
            color: "#fff",
            fontWeight: 800,
          }}
        >
          認定取得に向けたサポートが必要ですか？
        </h3>
        <p
          style={{
            margin: "0 0 22px",
            fontSize: 13,
            color: "rgba(255,255,255,.85)",
            lineHeight: 1.8,
          }}
        >
          健康経営優良法人の認定取得から、ウェルネスデータの収集・分析・活用まで
          <br />
          <strong style={{ color: "#fff" }}>フロム・シェフ</strong>
          が一気通貫でサポートします。
        </p>
        <a
          href={CONTACT_URL}
          style={{
            display: "inline-block",
            background: "#fff",
            color: "#1A3A5C",
            padding: "14px 36px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
          }}
        >
          📩 無料相談を申し込む
        </a>

        {/* 注記・出典 */}
        <p
          style={{
            margin: "32px 0 0",
            fontSize: 10,
            color: "rgba(255,255,255,.55)",
            lineHeight: 1.7,
            textAlign: "left",
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
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
  );
}

export { CONTACT_URL };
