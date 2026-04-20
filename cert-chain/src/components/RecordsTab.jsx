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
  card: { padding: "40px 48px", marginBottom: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-sub)", fontSize: 15, lineHeight: 1.5, maxWidth: "90%" },
  empty: { textAlign: "center", padding: "64px 24px" },
  list: { display: "flex", flexDirection: "column", gap: 16 },
  item: {
    background: "var(--bg-subtle)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "24px",
    display: "flex", alignItems: "flex-start", gap: 20,
    transition: "all var(--t)",
    boxShadow: "var(--shadow-xs)"
  },
  icon: {
    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
    background: "var(--accent-dim)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontWeight: 700, fontSize: 18, marginBottom: 6, color: "var(--text-main)", letterSpacing: "-0.3px" },
  meta: { fontSize: 14, color: "var(--text-sub)" },
  badge: {
    padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
    background: "var(--success-bg)", color: "var(--success)",
    border: "1px solid var(--success-border)", flexShrink: 0,
    marginTop: 4
  },
  copyBtn: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    color: "var(--text-sub)", padding: "4px 10px", borderRadius: 6,
    fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)",
    transition: "var(--t)"
  }
};
