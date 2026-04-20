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
  row: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40 },
  card: {
    padding: "24px 20px", textAlign: "center", background: "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
    backdropFilter: "blur(12px)", boxShadow: "var(--shadow-xs)"
  },
  value: {
    fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 800,
    color: "var(--accent)", marginBottom: 4, letterSpacing: "-0.5px"
  },
  label: { fontSize: 13, color: "var(--text-sub)", fontWeight: 600 },
};
