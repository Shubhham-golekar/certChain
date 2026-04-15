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
      {copied ? "Copied!" : "Copy Full Hash"}
    </button>
  );
}

export default function RecordsTab({ certs }) {
  return (
    <div className="glass-container" style={styles.card}>
      <div style={styles.title}>📋 Issued Certificates</div>
      <div style={styles.subtitle}>All certificates issued on the Stellar Testnet.</div>

      {certs.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.8 }}>
            No certificates yet. Go to Issue tab to create your first one.
          </p>
        </div>
      ) : (
        certs.map((cert) => (
          <div key={cert.id} style={styles.item}>
            <div style={styles.icon}>🎓</div>
            <div style={styles.info}>
              <div style={styles.name}>{cert.studentName}</div>
              <div style={styles.meta}>
                <span style={{ color: "var(--neon-pink)", marginRight: 12, fontWeight: 600 }}>{cert.course}</span>
                {cert.issuer} · {cert.date}
              </div>
              <div style={{ ...styles.meta, marginTop: 6, fontFamily: "var(--font-mono)" }}>Wallet: {cert.studentWallet}</div>
              <div style={{ ...styles.meta, marginTop: 6, display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "var(--font-mono)" }}>
                TX: {cert.txHash}
                <CopyHash hash={cert.fullHash || cert.txHash} />
              </div>
            </div>
            <div style={styles.badge}>Verified</div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: { padding: 40, marginBottom: 24 },
  title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 },
  subtitle: { color: "var(--text-muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.6 },
  empty: { textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" },
  item: {
    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
    borderRadius: 16, padding: 24, marginBottom: 16,
    display: "flex", alignItems: "center", gap: 20,
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
    transition: "all var(--transition-fast)"
  },
  icon: {
    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))",
    border: "1px solid rgba(168, 85, 247, 0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
    boxShadow: "0 0 15px rgba(236, 72, 153, 0.2)"
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 },
  meta: { fontSize: 12, color: "var(--text-muted)" },
  badge: {
    padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: 2, textTransform: "uppercase", flexShrink: 0,
    background: "rgba(6, 182, 212, 0.15)", color: "var(--neon-cyan)",
    border: "1px solid rgba(6, 182, 212, 0.4)",
    boxShadow: "0 0 10px rgba(6, 182, 212, 0.2)"
  },
  copyBtn: {
    background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.4)",
    color: "var(--text)", padding: "4px 10px", borderRadius: 6,
    fontSize: 10, cursor: "pointer", fontFamily: "'Space Grotesk',monospace"
  }
};
