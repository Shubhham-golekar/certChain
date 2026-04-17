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
        <div key={s.label} className="card" style={styles.card}>
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
    padding: "30px 20px", textAlign: "center", background: "var(--bg-card)"
  },
  value: {
    fontFamily: "var(--font-primary)", fontSize: 38, fontWeight: 800,
    color: "var(--text-main)", marginBottom: 4
  },
  label: { fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
};
