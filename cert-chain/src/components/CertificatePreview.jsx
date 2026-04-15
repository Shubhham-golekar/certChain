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
      
      {/* Decorative Aura */}
      <div style={{ ...styles.aura, top: -50, left: -50, background: "rgba(168, 85, 247, 0.4)" }} />
      <div style={{ ...styles.aura, bottom: -50, right: -50, background: "rgba(6, 182, 212, 0.3)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={styles.seal}>🎯</div>
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
                fgColor="#f8fafc"
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
    background: "rgba(15, 10, 30, 0.8)",
    backdropFilter: "blur(40px) saturate(200%)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 24, padding: "48px 40px", 
    textAlign: "center", position: "relative", overflow: "hidden", 
    marginTop: 40, boxShadow: "0 20px 50px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.2)",
  },
  aura: {
    position: "absolute", width: 200, height: 200, borderRadius: "50%",
    filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
  },
  corner: {
    position: "absolute", width: 80, height: 80,
    borderColor: "rgba(255,255,255,0.1)", borderStyle: "solid", zIndex: 1
  },
  tl: { top: 20, left: 20, borderWidth: "2px 0 0 2px", borderRadius: "8px 0 0 0" },
  tr: { top: 20, right: 20, borderWidth: "2px 2px 0 0", borderRadius: "0 8px 0 0" },
  bl: { bottom: 20, left: 20, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 8px" },
  br: { bottom: 20, right: 20, borderWidth: "0 2px 2px 0", borderRadius: "0 0 8px 0" },
  seal: {
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, var(--neon-purple), var(--neon-pink))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 32, margin: "0 auto 24px",
    boxShadow: "0 0 30px rgba(236, 72, 153, 0.4)",
  },
  issuer: { fontSize: 13, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "var(--neon-cyan)", marginBottom: 12 },
  subtitle: { fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 },
  name: {
    fontFamily: "'Space Grotesk',sans-serif", fontSize: 44, fontWeight: 800, marginBottom: 16,
    background: "linear-gradient(90deg, #fff, #f1f5f9)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    textShadow: "0 4px 20px rgba(255,255,255,0.2)"
  },
  completed: { fontSize: 15, color: "var(--text-muted)", marginBottom: 8 },
  course: { fontSize: 22, color: "var(--neon-pink)", fontWeight: 700, marginBottom: 12, letterSpacing: 1 },
  date: { fontSize: 13, color: "var(--text-muted)", marginBottom: 32 },
  divider: { width: 200, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)", margin: "0 auto 30px" },
  footerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: 30, background: "rgba(0,0,0,0.3)", padding: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" },
  qrColumn: { padding: 8, background: "rgba(255, 255, 255, 0.05)", borderRadius: 12, display: "flex", border: "1px solid rgba(255,255,255,0.1)" },
  hashWrap: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 },
  hashLabel: { fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "var(--neon-cyan)" },
  hash: { fontSize: 11, color: "var(--text)", wordBreak: "break-all", padding: "10px 16px", background: "rgba(0,0,0,0.4)", borderRadius: 8, display: "inline-block", fontFamily: "var(--font-mono)", border: "1px solid rgba(255,255,255,0.05)" },
  copyBtn: {
    background: "rgba(168, 85, 247, 0.2)", border: "1px solid rgba(168, 85, 247, 0.5)",
    color: "white", padding: "8px 16px", borderRadius: 8,
    fontSize: 12, cursor: "pointer", fontFamily: "'Space Grotesk',monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1
  }
};
