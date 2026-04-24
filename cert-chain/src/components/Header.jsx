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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: "clamp(32px, 6vw, 42px)",
    height: "clamp(32px, 6vw, 42px)",
    objectFit: "contain",
  },
  logoText: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800, fontSize: "clamp(20px, 5vw, 26px)", letterSpacing: "-0.5px",
    color: "var(--text-main)",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    borderRadius: 99, padding: "clamp(5px, 2vw, 6px) clamp(10px, 3vw, 12px)",
    fontSize: "clamp(11px, 2vw, 12px)", color: "var(--text-sub)", fontWeight: 600,
    whiteSpace: "nowrap",
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--success)",
  },
};
