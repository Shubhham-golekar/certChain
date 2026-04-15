import React from "react";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src="/logo.png" alt="CertChain Logo" style={styles.logoImage} />
        <div style={styles.logoText}>
          Cert<span style={{ color: "var(--accent)" }}>Chain</span>
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
    padding: "32px 0 24px",
    borderBottom: "1px solid var(--border)",
    marginBottom: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoImage: {
    width: 48, height: 48,
    borderRadius: 12,
    objectFit: "cover",
    boxShadow: "var(--shadow-glow)",
  },
  logoText: {
    fontFamily: "var(--font-primary)",
    fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(0,212,170,0.1)",
    border: "1px solid rgba(0,212,170,0.2)",
    borderRadius: 20, padding: "6px 14px",
    fontSize: 11, color: "var(--accent2)",
    letterSpacing: 1, textTransform: "uppercase",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "var(--accent2)", animation: "pulse 2s infinite",
  },
};
