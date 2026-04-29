import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#2563eb", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-md)",
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: 12,
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: 14 }}>
          {payload[0].value} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>certificates</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardTab({ totalCerts }) {
  const [metrics, setMetrics] = useState([]);
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

  const kpis = [
    {
      label: "Total Issued",
      value: loading ? "—" : totalCerts,
      trend: "All time",
      trendClass: "flat",
      accentColor: "#2563eb",
      iconBg: "var(--accent-dim)",
      iconColor: "#60a5fa",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    },
    {
      label: "On-Chain Rate",
      value: "100%",
      trend: "Blockchain verified",
      trendClass: "up",
      accentColor: "#10b981",
      iconBg: "var(--success-bg)",
      iconColor: "var(--success)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
    },
    {
      label: "Avg. Finality",
      value: "~3s",
      trend: "Stellar Testnet",
      trendClass: "flat",
      accentColor: "#0ea5e9",
      iconBg: "var(--cyan-dim)",
      iconColor: "var(--cyan)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: "Smart Contract",
      value: "Active",
      trend: "Soroban deployed",
      trendClass: "up",
      accentColor: "#8b5cf6",
      iconBg: "rgba(139,92,246,0.12)",
      iconColor: "#a78bfa",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-card-accent" style={{ background: kpi.accentColor }} />
            <div
              className="kpi-icon-wrap"
              style={{ background: kpi.iconBg, color: kpi.iconColor }}
            >
              {kpi.icon}
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div className={`kpi-trend ${kpi.trendClass}`}>
              {kpi.trendClass === "up" && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              )}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="card-title">Certificates by Category</div>
              <div className="card-subtitle">Distribution across credential types</div>
            </div>
            <span className="badge badge-blue">Live</span>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div style={msgStyle}>
              <div style={spinnerStyle} />
              Loading metrics...
            </div>
          ) : error ? (
            <div className="alert alert-danger" style={{ marginTop: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          ) : metrics.length === 0 ? (
            <div style={msgStyle}>No certificate data yet. Issue your first certificate to see metrics.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metrics} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={32}>
                <XAxis
                  dataKey="name"
                  stroke="transparent"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="transparent"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="Count" radius={[5, 5, 0, 0]}>
                  {metrics.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Info cards row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div className="card card-body" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>Smart Contract</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>
            Deployed on Soroban (Stellar's WASM-based smart contract platform). Each certificate is a permanent, tamper-proof on-chain record.
          </div>
        </div>
        <div className="card card-body" style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>Verification</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>
            Anyone can verify a certificate by its unique hash without needing an account. Verification queries the Stellar blockchain directly.
          </div>
        </div>
      </div>
    </div>
  );
}

const msgStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "var(--text-muted)",
  fontSize: 13,
  padding: "40px 0",
};

const spinnerStyle = {
  width: 16,
  height: 16,
  border: "2px solid var(--border-strong)",
  borderTopColor: "var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.75s linear infinite",
  flexShrink: 0,
};
