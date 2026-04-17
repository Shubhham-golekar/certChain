import React from "react";
import logoImg from "../certchain_logo.png";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src={logoImg} alt="CertChain Logo" style={styles.logoImg} />
        <div style={styles.logoText}>
          Cert<span style={{ color: "var(--primary)" }}>Chain</span>
        </div>
      </div>
      <div style={styles.badge}>
        <div style={styles.dot} />
        Stellar Testnet
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: "30px 0",
    borderBottom: "1px solid var(--border)",
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoImg: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
  logoText: {
    fontFamily: "var(--font-primary)",
    fontWeight: 700, fontSize: 26, letterSpacing: "-0.5px",
    color: "var(--text-main)",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 8,
    background: "var(--primary-light)",
    border: "1px solid var(--border-focus)",
    borderRadius: 20, padding: "6px 14px",
    fontSize: 12, color: "var(--primary)", fontWeight: 600,
    letterSpacing: 1, textTransform: "uppercase",
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "var(--primary)",
  },
};
