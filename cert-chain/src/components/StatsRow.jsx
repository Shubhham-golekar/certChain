import React from "react";

export default function StatsRow({ totalCerts }) {
  const stats = [
    { value: totalCerts,  label: "Certificates Issued" },
    { value: "100%",      label: "On-Chain Verified" },
    { value: "~3s",       label: "Network Finality" },
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
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 32,
  },
  card: {
    padding: "20px 24px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
  },
  value: {
    fontFamily: "var(--font-sans)",
    fontSize: 28,
    fontWeight: 700,
    color: "#60a5fa",
    marginBottom: 4,
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  label: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontWeight: 500,
    marginTop: 6,
  },
};
