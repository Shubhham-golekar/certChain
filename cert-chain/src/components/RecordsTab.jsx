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
    <div style={styles.card}>
      <div style={styles.title}>📋 Issued Certificates</div>
      <div style={styles.subtitle}>All certificates issued on the Stellar Testnet.</div>

      {certs.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
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
                <span style={{ color: "var(--accent2)", marginRight: 12 }}>{cert.course}</span>
                {cert.issuer} · {cert.date}
              </div>
              <div style={{ ...styles.meta, marginTop: 4 }}>Email: {cert.studentEmail}</div>
              <div style={{ ...styles.meta, marginTop: 4, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, marginBottom: 24 },
  title: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 },
  subtitle: { color: "var(--muted)", fontSize: 12, marginBottom: 28, lineHeight: 1.6 },
  empty: { textAlign: "center", padding: "48px 24px", color: "var(--muted)" },
  item: {
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 20, marginBottom: 12,
    display: "flex", alignItems: "center", gap: 16,
  },
  icon: {
    width: 48, height: 48, borderRadius: 10, flexShrink: 0,
    background: "linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,170,0.1))",
    border: "1px solid rgba(108,99,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 4 },
  meta: { fontSize: 11, color: "var(--muted)" },
  badge: {
    padding: "4px 10px", borderRadius: 20, fontSize: 10,
    letterSpacing: 1, textTransform: "uppercase", flexShrink: 0,
    background: "rgba(0,212,170,0.12)", color: "var(--accent2)",
    border: "1px solid rgba(0,212,170,0.2)",
  },
  copyBtn: {
    background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)",
    color: "var(--accent)", padding: "2px 8px", borderRadius: 4,
    fontSize: 10, cursor: "pointer", fontFamily: "'DM Mono',monospace"
  }
};
