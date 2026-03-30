import React from "react";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>📜</div>
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
  logoIcon: {
    width: 40, height: 40,
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px",
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
