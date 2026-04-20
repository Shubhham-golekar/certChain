import React, { useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';

export default function CertificatePreview({ cert }) {
  const [copied, setCopied] = useState(false);

  if (!cert) return null;

  const handleCopy = () => {
    if (!cert.fullHash && !cert.txHash) return;
    navigator.clipboard.writeText(cert.fullHash || cert.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hashVal = cert.fullHash || cert.txHash || "";

  return (
    <div style={styles.wrap}>
      <div style={{ position: "relative", zIndex: 1, padding: "32px 24px" }}>
        
        <div style={styles.topRibbon}>
            <div style={styles.seal}>✧</div>
            <div style={styles.issuer}>{cert.issuer}</div>
        </div>

        <div style={styles.body}>
            <div style={styles.subtitle}>Awarded to</div>
            <div style={styles.name}>{cert.studentName}</div>
            
            <div style={styles.completed}>For successful completion of</div>
            <div style={styles.course}>{cert.course}</div>
            <div style={styles.date}>Recorded {cert.date}</div>
        </div>
        
        <div style={styles.divider} />

        <div style={styles.footerWrap}>
            <div style={styles.qrColumn}>
            <QRCodeCanvas
                value={hashVal}
                size={70}
                bgColor="transparent"
                fgColor="#1c1917"
                level="L"
                includeMargin={false}
            />
            </div>
            <div style={styles.hashWrap}>
            <div style={styles.hashLabel}>Blockchain Record Hash</div>
            <div style={styles.hash}>{hashVal.slice(0, 30)}...</div>
            <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? "Copied" : "Copy"}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "linear-gradient(135deg, rgba(20, 20, 25, 0.9) 0%, rgba(15, 15, 20, 0.98) 100%)",
    border: "1px solid var(--border)",
    borderRadius: 20, 
    position: "relative", overflow: "hidden", 
    marginTop: 40, boxShadow: "var(--shadow-lg)",
  },
  topRibbon: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 },
  seal: {
    width: 48, height: 48, borderRadius: "50%",
    background: "var(--accent-dim)",
    border: "1px solid var(--accent)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24, margin: "0 auto 16px",
    color: "var(--accent)"
  },
  issuer: { fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--accent)", textAlign: "center" },
  body: { textAlign: "center", marginBottom: 40 },
  subtitle: { fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: 1, marginBottom: 12, fontWeight: 600 },
  name: {
    fontFamily: "var(--font-sans)", fontSize: 44, fontWeight: 800, marginBottom: 24,
    color: "var(--text-main)", letterSpacing: "-1px"
  },
  completed: { fontSize: 15, color: "var(--text-sub)", marginBottom: 8 },
  course: { fontSize: 24, color: "var(--text-main)", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.5px" },
  date: { fontSize: 14, color: "var(--text-muted)", fontWeight: 500 },
  divider: { width: 60, height: 3, background: "var(--border)", margin: "0 auto 32px", borderRadius: 3 },
  footerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: 24 },
  qrColumn: { padding: 8, background: "rgba(255,255,255,0.9)", borderRadius: 12, display: "flex", border: "1px solid var(--border)", boxShadow: "0 0 15px rgba(255,255,255,0.1)" },
  hashWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 },
  hashLabel: { fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: "var(--text-sub)", textTransform: "uppercase" },
  hash: { fontSize: 12, color: "var(--text-sub)", wordBreak: "break-all", padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: 8, display: "inline-block", fontFamily: "var(--font-mono)", border: "1px solid var(--border)", boxShadow: "var(--shadow-xs)" },
  copyBtn: {
    background: "var(--bg-subtle)", border: "1px solid var(--border)",
    color: "var(--text-main)", padding: "4px 12px", borderRadius: 6,
    fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "var(--t)"
  }
};
