import React from "react";
import logoImg from "../certchain_logo.png";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <img src={logoImg} alt="CertChain" style={styles.logo} />
        <span style={styles.name}>CertChain</span>
      </div>
      <div style={styles.badge}>
        <span style={styles.dot} />
        Stellar Testnet
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 0 24px",
    borderBottom: "1px solid var(--border)",
    marginBottom: "40px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 36,
    height: 36,
    objectFit: "contain",
    borderRadius: 8,
  },
  name: {
    fontFamily: "var(--font-sans)",
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text-main)",
    letterSpacing: "-0.3px",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    borderRadius: 99,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text-sub)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--success)",
    display: "inline-block",
    flexShrink: 0,
  },
};
