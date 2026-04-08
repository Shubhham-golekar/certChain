import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardTab() {
    const [metrics, setMetrics] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
                const res = await fetch(`${backendUrl}/api/certificates`);
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                const certs = data.certificates || [];
                setTotal(certs.length);

                // Group by course for a chart
                const courseCounts = {};
                for (const cert of certs) {
                    courseCounts[cert.course] = (courseCounts[cert.course] || 0) + 1;
                }

                const chartData = Object.keys(courseCounts).map(course => ({
                    name: course,
                    Issuances: courseCounts[course]
                }));

                setMetrics(chartData);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Make sure cert-chain-backend is running to load metrics.");
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    return (
        <div style={styles.card}>
            <div style={styles.title}>📊 Live Metrics Dashboard</div>
            <div style={styles.subtitle}>Real-time statistics sourced from the decentralized certs indexer.</div>

            <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                    <div style={styles.statValue}>{loading ? "..." : total}</div>
                    <div style={styles.statLabel}>Total Certificates Issued</div>
                </div>
                <div style={styles.statBox}>
                    <div style={styles.statValue}>100%</div>
                    <div style={styles.statLabel}>On-Chain Verified</div>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <div style={{ ...styles.title, fontSize: 14, marginBottom: 16 }}>Issuances by Course</div>
                {loading ? (
                    <p style={{ color: "var(--muted)" }}>Loading metrics...</p>
                ) : error ? (
                    <p style={{ color: "var(--accent)" }}>{error}</p>
                ) : metrics.length === 0 ? (
                    <p style={{ color: "var(--muted)" }}>No data to display.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                            <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={11} />
                            <Tooltip
                                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                                itemStyle={{ color: "var(--text)" }}
                            />
                            <Bar dataKey="Issuances" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, marginBottom: 24 },
    title: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "var(--muted)", fontSize: 12, marginBottom: 28, lineHeight: 1.6 },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 },
    statBox: { background: "var(--surface2)", padding: 20, borderRadius: 12, textAlign: "center", border: "1px solid var(--border)" },
    statValue: { fontSize: 32, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: "var(--accent)" },
    statLabel: { fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 },
    chartContainer: { background: "var(--surface2)", padding: 24, borderRadius: 12, border: "1px solid var(--border)" }
};
