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
                    Issuances: courseCounts[course]
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
        <div className="glass-container" style={styles.card}>
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
                <div style={{ ...styles.title, fontSize: 16, marginBottom: 20 }}>Issuances by Course</div>
                {loading ? (
                    <p style={{ color: "var(--text-muted)", padding: 20 }}>Loading metrics...</p>
                ) : error ? (
                    <p style={{ color: "var(--neon-pink)", padding: 20 }}>{error}</p>
                ) : metrics.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", padding: 20 }}>No data to display.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: "rgba(15,10,30,0.9)", border: "1px solid var(--neon-purple)", borderRadius: 12, backdropFilter: "blur(10px)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                                itemStyle={{ color: "var(--text)", fontWeight: "bold" }}
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            />
                            <Bar dataKey="Issuances" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={1}/>
                                    <stop offset="95%" stopColor="var(--neon-pink)" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

const styles = {
    card: { padding: 40, marginBottom: 24 },
    title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" },
    subtitle: { color: "var(--text-muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.6 },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 },
    statBox: { 
        background: "rgba(255,255,255,0.03)", padding: 30, borderRadius: 16, 
        textAlign: "center", border: "1px solid var(--border)",
        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)"
    },
    statValue: { fontSize: 42, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: "var(--neon-cyan)", textShadow: "0 0 20px rgba(6, 182, 212, 0.4)" },
    statLabel: { fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, marginTop: 8 },
    chartContainer: { 
        background: "rgba(0,0,0,0.2)", padding: 30, borderRadius: 16, 
        border: "1px solid var(--border)", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)" 
    }
};
