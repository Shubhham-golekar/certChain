import React, { useState } from "react";

function CopyHash({ hash }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} style={styles.copyBtn}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function RecordsTab({ certs }) {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Community Records 📋</div>
        <div style={styles.subtitle}>A public ledger of all the credentials issued through this node onto the Stellar Testnet.</div>
      </div>

      {certs.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 15, color: "var(--text-sub)", lineHeight: 1.6 }}>
            Nothing here yet. Head over to the issue tab to record the first one.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {certs.map((cert) => (
            <div key={cert.id} style={styles.item}>
              <div style={styles.icon}>🎓</div>
              <div style={styles.info}>
                <div style={styles.name}>{cert.studentName}</div>
                <div style={styles.meta}>
                  <span style={{ color: "var(--accent)", marginRight: 12, fontWeight: 700 }}>{cert.course}</span>
                  Issued by {cert.issuer} · {cert.date}
                </div>
                <div style={{ ...styles.meta, marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 12 }}>User Wallet: {cert.studentWallet}</div>
                <div style={{ ...styles.meta, marginTop: 6, display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  TX: {cert.txHash}
                  <CopyHash hash={cert.fullHash || cert.txHash} />
                </div>
              </div>
              <div style={styles.badge}>Live on network</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { padding: "clamp(24px, 5vw, 48px)", marginBottom: 24 },
  header: { marginBottom: "clamp(20px, 5vw, 32px)" },
  title: { fontSize: "clamp(20px, 6vw, 24px)", fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-sub)", fontSize: "clamp(13px, 4vw, 15px)", lineHeight: 1.5, maxWidth: "100%" },
  empty: { textAlign: "center", padding: "clamp(40px, 8vw, 64px) 24px" },
  list: { display: "flex", flexDirection: "column", gap: "clamp(12px, 3vw, 16px)" },
  item: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "clamp(16px, 3vw, 24px)",
    display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 20px)",
    transition: "all 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "var(--shadow-xs)",
    flexWrap: "wrap",
  },
  icon: {
    width: "clamp(36px, 8vw, 48px)", height: "clamp(36px, 8vw, 48px)", borderRadius: 12, flexShrink: 0,
    background: "var(--accent-light)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(18px, 5vw, 24px)",
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontWeight: 700, fontSize: "clamp(16px, 4vw, 18px)", marginBottom: 6, color: "var(--text-main)", letterSpacing: "-0.3px" },
  meta: { fontSize: "clamp(12px, 2.5vw, 14px)", color: "var(--text-sub)", wordBreak: "break-all" },
  badge: {
    padding: "clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 14px)", borderRadius: 99, fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600,
    background: "var(--success-bg)", color: "var(--success)",
    border: "1px solid var(--success-border)", flexShrink: 0,
    marginTop: 4, whiteSpace: "nowrap"
  },
  copyBtn: {
    background: "var(--bg-subtle)", border: "1px solid var(--border)",
    color: "var(--text-sub)", padding: "4px 10px", borderRadius: 6,
    fontSize: "clamp(10px, 2vw, 12px)", cursor: "pointer", fontFamily: "var(--font-mono)",
    transition: "var(--t)", minHeight: 28
  }
};
