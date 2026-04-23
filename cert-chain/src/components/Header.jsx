import React from "react";
import logoImg from "../certchain_logo.png";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.brandGroup}>
        <div style={styles.logoWrapper}>
          <img src={logoImg} alt="CertChain Logo" style={styles.logoImg} />
        </div>
        <div style={styles.logoText}>CertChain</div>
      </div>
      <div style={styles.badge}>
        <div style={styles.dot} />
        <div>Stellar Testnet</div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: "clamp(20px, 5vw, 36px) 0",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  brandGroup: { display: "flex", alignItems: "center", gap: "clamp(10px, 3vw, 16px)", cursor: "pointer" },
  logoWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "float 6s ease-in-out infinite",
  },
  logoImg: {
    width: "clamp(40px, 8vw, 50px)",
    height: "clamp(40px, 8vw, 50px)",
    objectFit: "cover",
    borderRadius: "14px",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  logoText: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800, fontSize: "clamp(22px, 6vw, 30px)", letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #ffffff 0%, #818cf8 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "var(--accent-dim)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    boxShadow: "0 0 12px rgba(99, 102, 241, 0.2)",
    borderRadius: 99, padding: "clamp(5px, 2vw, 8px) clamp(12px, 3vw, 16px)",
    fontSize: "clamp(11px, 2vw, 13px)", color: "var(--accent-light)", fontWeight: 700,
    whiteSpace: "nowrap",
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--success)",
    boxShadow: "0 0 8px var(--success)",
    animation: "pulse-dot 2s infinite"
  },
};
