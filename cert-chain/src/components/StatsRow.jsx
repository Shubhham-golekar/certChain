import React from "react";

export default function StatsRow({ totalCerts }) {
  const stats = [
    { value: totalCerts, label: "Total Issued" },
    { value: "100%", label: "On-Chain Verified" },
    { value: "~3s", label: "Network Finality" },
  ];

  return (
    <div style={styles.row}>
      {stats.map((s) => (
        <div key={s.label} style={styles.card}>
          <div style={styles.value}>{s.value}</div>
          <div style={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "clamp(12px, 3vw, 20px)", marginBottom: 40 },
  card: {
    padding: "clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)", textAlign: "center", background: "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-sm)", transition: "all var(--t)"
  },
  value: {
    fontFamily: "var(--font-sans)", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 800,
    color: "var(--accent)", marginBottom: 4, letterSpacing: "-0.5px"
  },
  label: { fontSize: "clamp(11px, 2.5vw, 13px)", color: "var(--text-sub)", fontWeight: 600 },
};
