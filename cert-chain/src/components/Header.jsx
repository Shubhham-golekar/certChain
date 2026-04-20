import React from "react";
import logoImg from "../certchain_logo.png";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.brandGroup}>
        <img src={logoImg} alt="CertChain Logo" style={styles.logoImg} />
        <div style={styles.logoText}>
          Cert<span style={{ color: "var(--accent)" }}>Chain</span>
        </div>
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
    padding: "36px 0",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandGroup: { display: "flex", alignItems: "center", gap: 12 },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: "contain",
  },
  logoText: {
    fontFamily: "var(--font-sans)",
    fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px",
    color: "var(--text-main)",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "var(--accent-dim)",
    borderRadius: 99, padding: "6px 14px",
    fontSize: 12, color: "var(--accent)", fontWeight: 600,
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--accent)",
  },
};
