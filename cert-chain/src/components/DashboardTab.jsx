import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardTab() {
  const [metrics, setMetrics] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/certificates`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        const certs = data.certificates || [];
        setTotal(certs.length);

        const courseCounts = {};
        for (const cert of certs) {
          courseCounts[cert.course] = (courseCounts[cert.course] || 0) + 1;
        }
        setMetrics(Object.keys(courseCounts).map(course => ({
          name: course,
          Count: courseCounts[course],
        })));
      } catch (err) {
        setError("Start the cert-chain-backend to load live metrics.");
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Overview</h2>
        <p style={styles.subtitle}>
          Live certificate metrics sourced from the Stellar network.
        </p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{loading ? "—" : total}</div>
          <div style={styles.statLabel}>Total Certificates</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, color: "var(--success)" }}>100%</div>
          <div style={styles.statLabel}>Blockchain Verified</div>
        </div>
        <div style={styles.statBox}>
          <div style={{ ...styles.statValue, color: "var(--cyan)" }}>~3s</div>
          <div style={styles.statLabel}>Avg. Finality Time</div>
        </div>
      </div>

      <div style={styles.chartSection}>
        <div style={styles.chartTitle}>Certificates by Category</div>
        {loading ? (
          <p style={styles.chartMsg}>Loading...</p>
        ) : error ? (
          <p style={{ ...styles.chartMsg, color: "var(--danger)" }}>{error}</p>
        ) : metrics.length === 0 ? (
          <p style={styles.chartMsg}>No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={metrics} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="var(--border)"
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                stroke="var(--border)"
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  boxShadow: "var(--shadow-md)",
                  fontSize: 13,
                }}
                itemStyle={{ color: "#60a5fa", fontWeight: 600 }}
                cursor={{ fill: "var(--bg-subtle)" }}
              />
              <Bar dataKey="Count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

const styles = {
  card:    { padding: "40px", marginBottom: 24 },
  header:  { marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" },
  title:   { fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginBottom: 8, letterSpacing: "-0.3px" },
  subtitle: { color: "var(--text-sub)", fontSize: 14, lineHeight: 1.6 },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "20px 24px",
  },
  statValue: {
    fontSize: 36,
    fontWeight: 800,
    color: "#60a5fa",
    lineHeight: 1,
    letterSpacing: "-1px",
    fontFamily: "var(--font-sans)",
  },
  statLabel: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontWeight: 500,
    marginTop: 8,
  },

  chartSection: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    padding: "24px",
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-sub)",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  chartMsg: { color: "var(--text-muted)", fontSize: 14, padding: "20px 0" },
};
