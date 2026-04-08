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
      {["tl", "tr", "bl", "br"].map((pos) => <div key={pos} style={{ ...styles.corner, ...styles[pos] }} />)}
      <div style={styles.seal}>🏛️</div>
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
            size={64}
            bgColor="#1a1a2e"
            fgColor="#ffd700"
            level="L"
            includeMargin={false}
          />
        </div>
        <div style={styles.hashWrap}>
          <div style={styles.hash}>🔗 TX: {hashVal.slice(0, 32)}...</div>
          <button onClick={handleCopy} style={styles.copyBtn}>
            {copied ? "Copied!" : "Copy Full Hash"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    background: "linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 50%,#0d0d1a 100%)",
    border: "1px solid rgba(108,99,255,0.3)", borderRadius: 16,
    padding: 40, textAlign: "center", position: "relative",
    overflow: "hidden", marginTop: 32,
  },
  corner: {
    position: "absolute", width: 60, height: 60,
    borderColor: "rgba(255,215,0,0.3)", borderStyle: "solid",
  },
  tl: { top: 16, left: 16, borderWidth: "2px 0 0 2px", borderRadius: "4px 0 0 0" },
  tr: { top: 16, right: 16, borderWidth: "2px 2px 0 0", borderRadius: "0 4px 0 0" },
  bl: { bottom: 16, left: 16, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 4px" },
  br: { bottom: 16, right: 16, borderWidth: "0 2px 2px 0", borderRadius: "0 0 4px 0" },
  seal: {
    width: 64, height: 64, borderRadius: "50%",
    background: "linear-gradient(135deg,#ffd700,#ffb300)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, margin: "0 auto 20px",
    boxShadow: "0 0 30px rgba(255,215,0,0.3)",
  },
  issuer: { fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--accent2)", marginBottom: 8 },
  subtitle: { fontFamily: "'Syne',sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 },
  name: {
    fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 12,
    background: "linear-gradient(90deg,#ffd700,#fff,#ffd700)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  completed: { fontSize: 14, color: "var(--text)", marginBottom: 6 },
  course: { fontSize: 16, color: "var(--accent2)", fontWeight: 600, marginBottom: 6 },
  date: { fontSize: 11, color: "var(--muted)", marginBottom: 24 },
  divider: { width: 120, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.4),transparent)", margin: "0 auto 20px" },
  footerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 20 },
  qrColumn: { padding: 4, background: "rgba(255, 255, 255, 0.05)", borderRadius: 8, display: "flex" },
  hashWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 },
  hash: { fontSize: 10, color: "var(--muted)", wordBreak: "break-all", padding: "8px 16px", background: "rgba(0,0,0,0.3)", borderRadius: 6, display: "inline-block" },
  copyBtn: {
    background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)",
    color: "var(--accent2)", padding: "6px 12px", borderRadius: 6,
    fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono',monospace"
  }
};
