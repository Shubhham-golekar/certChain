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
                bgColor="#ffffff"
                fgColor="#111827"
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
    background: "linear-gradient(135deg, #ffffff 0%, #f9f8f6 100%)",
    border: "1px solid #e5e7eb",
    borderRadius: 20, 
    position: "relative", overflow: "hidden", 
    marginTop: 40, boxShadow: "var(--shadow-lg)",
  },
  topRibbon: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "clamp(20px, 4vw, 32px)" },
  seal: {
    width: "clamp(36px, 8vw, 48px)", height: "clamp(36px, 8vw, 48px)", borderRadius: "50%",
    background: "var(--accent-light)",
    border: "2px solid var(--accent)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "clamp(18px, 4vw, 24px)", margin: "0 auto 16px",
    color: "var(--accent)"
  },
  issuer: { fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--accent)", textAlign: "center" },
  body: { textAlign: "center", marginBottom: "clamp(24px, 5vw, 40px)", padding: "0 clamp(12px, 3vw, 24px)" },
  subtitle: { fontSize: "clamp(11px, 2.5vw, 13px)", textTransform: "uppercase", color: "#6b7280", letterSpacing: 1, marginBottom: 12, fontWeight: 600 },
  name: {
    fontFamily: "var(--font-sans)", fontSize: "clamp(28px, 8vw, 44px)", fontWeight: 800, marginBottom: 24,
    color: "#111827", letterSpacing: "-1px"
  },
  completed: { fontSize: "clamp(13px, 3vw, 15px)", color: "#4b5563", marginBottom: 8 },
  course: { fontSize: "clamp(18px, 5vw, 24px)", color: "#111827", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.5px" },
  date: { fontSize: "clamp(12px, 2.5vw, 14px)", color: "#6b7280", fontWeight: 500 },
  divider: { width: 60, height: 3, background: "#e5e7eb", margin: "0 auto 32px", borderRadius: 3 },
  footerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(12px, 3vw, 24px)", flexWrap: "wrap", padding: "0 clamp(12px, 3vw, 24px)" },
  qrColumn: { padding: 8, background: "#ffffff", borderRadius: 12, display: "flex", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  hashWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, minWidth: 0 },
  hashLabel: { fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 700, letterSpacing: 0.5, color: "#6b7280", textTransform: "uppercase" },
  hash: { fontSize: "clamp(10px, 2.5vw, 12px)", color: "#4b5563", wordBreak: "break-all", padding: "8px 12px", background: "#f3f4f6", borderRadius: 8, display: "inline-block", fontFamily: "var(--font-mono)", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", maxWidth: "200px" },
  copyBtn: {
    background: "#ffffff", border: "1px solid #d1d5db",
    color: "#111827", padding: "4px 12px", borderRadius: 6,
    fontSize: "clamp(10px, 2.5vw, 12px)", cursor: "pointer", fontWeight: 600, transition: "var(--t)", minHeight: 28
  }
};
