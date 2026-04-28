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
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function RecordsTab({ certs }) {
  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Certificate Records</h2>
        <p style={styles.subtitle}>
          Public ledger of all credentials issued through this node on the Stellar Testnet.
        </p>
      </div>

      {certs.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
            </svg>
          </div>
          <p style={styles.emptyText}>No records yet. Issue your first certificate to get started.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {certs.map((cert, idx) => (
            <div key={cert.id} style={{ ...styles.item, ...(idx === certs.length - 1 ? {} : styles.itemBorder) }}>
              <div style={styles.itemLeft}>
                <div style={styles.name}>{cert.studentName}</div>
                <div style={styles.meta}>
                  <span style={styles.coursePill}>{cert.course}</span>
                  <span style={styles.metaText}>Issued by {cert.issuer}</span>
                  <span style={styles.metaDivider}>·</span>
                  <span style={styles.metaText}>{cert.date}</span>
                </div>
                <div style={styles.hashRow}>
                  <span style={styles.hashLabel}>TX</span>
                  <span style={styles.hashValue}>{cert.txHash}</span>
                  <CopyHash hash={cert.fullHash || cert.txHash} />
                </div>
                <div style={{ ...styles.hashRow, marginTop: 4 }}>
                  <span style={styles.hashLabel}>Wallet</span>
                  <span style={styles.hashValue}>{cert.studentWallet?.slice(0, 20)}...</span>
                </div>
              </div>
              <div style={styles.badge}>On-Chain</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card:   { padding: "40px 40px 8px", marginBottom: 24 },
  header: { marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border)" },
  title:  { fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginBottom: 8, letterSpacing: "-0.3px" },
  subtitle: { color: "var(--text-sub)", fontSize: 14, lineHeight: 1.6 },

  empty: { textAlign: "center", padding: "64px 24px" },
  emptyIcon: {
    width: 56, height: 56, borderRadius: "var(--radius-md)",
    background: "var(--bg-subtle)", border: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--text-muted)", margin: "0 auto 16px",
  },
  emptyText: { fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 },

  list: { display: "flex", flexDirection: "column" },
  item: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    padding: "24px 0",
    flexWrap: "wrap",
  },
  itemBorder: { borderBottom: "1px solid var(--border)" },
  itemLeft: { flex: 1, minWidth: 0 },

  name: { fontSize: 15, fontWeight: 600, color: "var(--text-main)", marginBottom: 8 },
  meta: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 },
  coursePill: {
    background: "var(--accent-dim)",
    color: "#60a5fa",
    border: "1px solid rgba(37,99,235,0.2)",
    borderRadius: 4,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
  },
  metaText:    { fontSize: 13, color: "var(--text-sub)" },
  metaDivider: { color: "var(--border-strong)", fontSize: 12 },

  hashRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  hashLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    minWidth: 36,
  },
  hashValue: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 280,
  },

  badge: {
    flexShrink: 0,
    padding: "3px 10px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: "var(--success-bg)",
    color: "var(--success)",
    border: "1px solid var(--success-border)",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
  },
  copyBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-muted)",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "var(--t)",
    flexShrink: 0,
  },
};
