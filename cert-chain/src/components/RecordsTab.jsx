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
    <div className="card" style={styles.card}>
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
                <span style={{ color: "var(--primary)", marginRight: 12, fontWeight: 600 }}>{cert.course}</span>
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
  card: { padding: 40, marginBottom: 24, background: "var(--bg-card)" },
  title: { fontFamily: "var(--font-primary)", fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.6 },
  empty: { textAlign: "center", padding: "48px 24px", color: "var(--text-muted)" },
  item: {
    background: "var(--bg-main)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 24, marginBottom: 16,
    display: "flex", alignItems: "center", gap: 20,
    transition: "all var(--transition-fast)"
  },
  icon: {
    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
    background: "var(--primary-light)",
    border: "1px solid var(--border-focus)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: 16, marginBottom: 4, color: "var(--text-main)" },
  meta: { fontSize: 13, color: "var(--text-muted)" },
  badge: {
    padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    letterSpacing: 1, textTransform: "uppercase", flexShrink: 0,
    background: "#dcfce7", color: "#166534",
    border: "1px solid #bbf7d0",
  },
  copyBtn: {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    color: "var(--text-main)", padding: "4px 10px", borderRadius: 6,
    fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)"
  }
};
