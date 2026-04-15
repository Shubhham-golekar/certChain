import React from "react";

export default function StatsRow({ totalCerts }) {
  const stats = [
    { value: totalCerts, label: "Certificates Issued" },
    { value: "100%", label: "On-Chain Verified" },
    { value: "~3s", label: "Finality Time" },
  ];

  return (
    <div style={styles.row}>
      {stats.map((s) => (
        <div key={s.label} className="glass-container" style={styles.card}>
          <div style={styles.value}>{s.value}</div>
          <div style={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 40 },
  card: {
    padding: "30px 20px", textAlign: "center",
  },
  value: {
    fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 800,
    background: "linear-gradient(90deg, var(--text), var(--text-muted))",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    marginBottom: 8, textShadow: "0 4px 20px rgba(255,255,255,0.1)"
  },
  label: { fontSize: 11, color: "var(--neon-cyan)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 },
};
