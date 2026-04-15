import React from "react";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>C</div>
        <div style={styles.logoText}>
          Cert<span style={{ color: "var(--neon-purple)" }}>Chain</span>
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
    padding: "40px 0 30px",
    borderBottom: "1px solid var(--surface-border)",
    marginBottom: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 14 },
  logoIcon: {
    width: 48, height: 48,
    borderRadius: 14,
    background: "linear-gradient(135deg, var(--neon-purple), var(--neon-pink))",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, fontWeight: 800, color: "white",
    boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
    fontFamily: "var(--font-primary)"
  },
  logoText: {
    fontFamily: "var(--font-primary)",
    fontWeight: 800, fontSize: 32, letterSpacing: "-1px",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(6, 182, 212, 0.15)",
    border: "1px solid rgba(6, 182, 212, 0.3)",
    borderRadius: 30, padding: "8px 18px",
    fontSize: 12, color: "var(--neon-cyan)", fontWeight: 700,
    letterSpacing: 2, textTransform: "uppercase",
    boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)",
    backdropFilter: "blur(5px)"
  },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "var(--neon-cyan)", animation: "pulse 2s infinite",
    boxShadow: "0 0 8px var(--neon-cyan)"
  },
};
