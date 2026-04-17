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
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={styles.seal}>🎓</div>
        <div style={styles.issuer}>{cert.issuer}</div>
        <div style={styles.subtitle}>This is to certify that</div>
        <div style={styles.name}>{cert.studentName}</div>
        <div style={styles.completed}>has successfully completed</div>
        <div style={styles.course}>{cert.course}</div>
        <div style={styles.date}>Issued on {cert.date}</div>
        
        <div style={styles.divider} />

        <div style={styles.footerWrap}>
            <div style={styles.qrColumn}>
            <QRCodeCanvas
                value={hashVal}
                size={80}
                bgColor="transparent"
                fgColor="#0f172a"
                level="L"
                includeMargin={false}
            />
            </div>
            <div style={styles.hashWrap}>
            <div style={styles.hashLabel}>VERIFICATION HASH</div>
            <div style={styles.hash}>🔗 TX: {hashVal.slice(0, 32)}...</div>
            <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? "Copied!" : "Copy Full Hash"}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "#ffffff",
    border: "1px solid var(--border)",
    borderRadius: 16, padding: "48px 40px", 
    textAlign: "center", position: "relative", overflow: "hidden", 
    marginTop: 40, boxShadow: "var(--shadow-lg)",
  },
  seal: {
    width: 64, height: 64, borderRadius: "50%",
    background: "var(--primary-light)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, margin: "0 auto 24px",
    border: "1px solid var(--border-focus)",
    color: "var(--primary)"
  },
  issuer: { fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 },
  subtitle: { fontFamily: "var(--font-primary)", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 },
  name: {
    fontFamily: "var(--font-primary)", fontSize: 40, fontWeight: 800, marginBottom: 16,
    color: "var(--text-main)"
  },
  completed: { fontSize: 15, color: "var(--text-muted)", marginBottom: 8 },
  course: { fontSize: 24, color: "var(--text-main)", fontWeight: 700, marginBottom: 16 },
  date: { fontSize: 14, color: "var(--text-muted)", marginBottom: 32 },
  divider: { width: "100%", height: 1, background: "var(--border)", margin: "0 auto 30px" },
  footerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: 30, background: "var(--bg-main)", padding: 20, borderRadius: 12, border: "1px solid var(--border)" },
  qrColumn: { padding: 8, background: "#fff", borderRadius: 8, display: "flex", border: "1px solid var(--border)" },
  hashWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 },
  hashLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--text-muted)", textTransform: "uppercase" },
  hash: { fontSize: 12, color: "var(--text-main)", wordBreak: "break-all", padding: "8px 12px", background: "#fff", borderRadius: 6, display: "inline-block", fontFamily: "var(--font-mono)", border: "1px solid var(--border)" },
  copyBtn: {
    background: "var(--primary)", border: "none",
    color: "white", padding: "8px 16px", borderRadius: 6,
    fontSize: 12, cursor: "pointer", fontFamily: "var(--font-primary)", fontWeight: 600, transition: "var(--transition-fast)"
  }
};
