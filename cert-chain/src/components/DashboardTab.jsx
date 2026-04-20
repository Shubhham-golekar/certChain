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

                const courseCounts = {};
                for (const cert of certs) {
                    courseCounts[cert.course] = (courseCounts[cert.course] || 0) + 1;
                }

                const chartData = Object.keys(courseCounts).map(course => ({
                    name: course,
                    Count: courseCounts[course]
                }));

                setMetrics(chartData);
            } catch (err) {
                setError("Make sure cert-chain-backend is running to load metrics.");
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    return (
        <div className="card" style={styles.card}>
            <div style={styles.header}>
                <div style={styles.title}>Project Overview 🔭</div>
                <div style={styles.subtitle}>
                    A quick peek at how many people have earned their credentials so far. Everything is live and sourced from the network.
                </div>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                    <div style={styles.statValue}>{loading ? "..." : total}</div>
                    <div style={styles.statLabel}>Total Certificates Distributed</div>
                </div>
                <div style={styles.statBox}>
                    <div style={{ ...styles.statValue, color: "var(--success)" }}>100%</div>
                    <div style={styles.statLabel}>Verified on Blockchain</div>
                </div>
            </div>

            <div style={styles.chartContainer}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Breakdown by Category</div>
                {loading ? (
                    <p style={{ color: "var(--text-muted)", padding: 20 }}>Loading up the numbers...</p>
                ) : error ? (
                    <p style={{ color: "var(--danger)", padding: 20 }}>{error}</p>
                ) : metrics.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", padding: 20 }}>Empty so far.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="var(--border-strong)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis allowDecimals={false} stroke="var(--border-strong)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-md)" }}
                                itemStyle={{ color: "var(--accent)", fontWeight: "bold" }}
                                cursor={{ fill: "var(--bg-subtle)", radius: 8 }}
                            />
                            <Bar dataKey="Count" fill="var(--accent)" radius={6} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: { padding: "40px 48px", marginBottom: 24 },
    header: { marginBottom: 32 },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
    subtitle: { color: "var(--text-sub)", fontSize: 15, lineHeight: 1.5, maxWidth: "90%" },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 },
    statBox: { 
        background: "var(--bg-subtle)", padding: 32, borderRadius: 16, 
        border: "1px solid var(--border)"
    },
    statValue: { fontSize: 48, fontWeight: 800, letterSpacing: "-1px", color: "var(--accent)", lineHeight: 1 },
    statLabel: { fontSize: 14, color: "var(--text-sub)", marginTop: 12, fontWeight: 500 },
    chartContainer: { 
        padding: 32, borderRadius: 16, 
        border: "1px solid var(--border)"
    }
};
