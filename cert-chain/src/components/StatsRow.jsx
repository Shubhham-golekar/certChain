import React from "react";

export default function StatsRow({ totalCerts }) {
  const stats = [
    { value: totalCerts, label: "Certificates Issued" },
    { value: "100%", label: "Tamper Proof" },
    { value: "~3s", label: "Issue Time" },
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
  row: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 },
  card: {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 20, textAlign: "center",
  },
  value: {
    fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  label: { fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 },
};
