import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const BAR_COLORS = ["#7c5cf6", "#38bdf8", "#34d399", "#a78bfa", "#fbbf24", "#fb7185"];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a1d2e",
        border: "1px solid rgba(124,92,246,0.25)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontSize: 12,
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
        <div style={{ color: "#c4b5fd", fontWeight: 700, fontSize: 14 }}>
          {payload[0].value}
          <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: 4 }}>certificates</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardTab({ totalCerts }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${url}/api/certificates`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const counts = {};
        for (const c of (data.certificates || [])) counts[c.course] = (counts[c.course] || 0) + 1;
        setMetrics(Object.keys(counts).map(name => ({ name, Count: counts[name] })));
      } catch {
        setError("Start the backend to load live metrics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kpis = [
    {
      label: "Total Issued",
      value: loading ? "—" : totalCerts,
      trend: "All time",
      trendType: "flat",
      color: "#7c5cf6",
      glow: "#7c5cf6",
      iconBg: "rgba(124,92,246,0.12)",
      iconColor: "#c4b5fd",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
    },
    {
      label: "On-Chain Rate",
      value: "100%",
      trend: "Blockchain verified",
      trendType: "up",
      color: "#34d399",
      glow: "#34d399",
      iconBg: "rgba(52,211,153,0.10)",
      iconColor: "var(--success)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      ),
    },
    {
      label: "Avg. Finality",
      value: "~3s",
      trend: "Stellar speed",
      trendType: "up",
      color: "#38bdf8",
      glow: "#38bdf8",
      iconBg: "rgba(56,189,248,0.10)",
      iconColor: "var(--blue)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: "Smart Contract",
      value: "Active",
      trend: "Soroban deployed",
      trendType: "up",
      color: "#a78bfa",
      glow: "#a78bfa",
      iconBg: "rgba(167,139,250,0.10)",
      iconColor: "#a78bfa",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero banner with gradient glow */}
      <div style={{
        position: "relative",
        borderRadius: "var(--r-xl)",
        border: "1px solid rgba(124,92,246,0.25)",
        overflow: "hidden",
        padding: "32px 32px",
        marginBottom: 24,
        background: "var(--bg-card)",
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: "absolute", top: -80, right: -40,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,246,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: 120,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span className="badge badge-gradient">Soroban</span>
              <span className="badge badge-blue">v1.0</span>
            </div>
            <h1 style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text-main)",
              letterSpacing: "-0.5px",
              marginBottom: 8,
              lineHeight: 1.2,
            }}>
              Welcome to CertChain Enterprise
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--text-sub)", lineHeight: 1.7, maxWidth: 500 }}>
              Issue, manage, and verify tamper-proof credentials anchored to the Stellar blockchain via Soroban smart contracts. Every certificate is permanent and permissionlessly verifiable.
            </p>
          </div>

          {/* Decorative blockchain icon */}
          <div style={{
            width: 80, height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(124,92,246,0.20) 0%, rgba(56,189,248,0.15) 100%)",
            border: "1px solid rgba(124,92,246,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 40px rgba(124,92,246,0.15)",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="1.5">
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c5cf6"/>
                  <stop offset="100%" stopColor="#38bdf8"/>
                </linearGradient>
              </defs>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-top-bar" style={{ background: k.color }} />
            <div className="kpi-card-glow" style={{ background: k.glow }} />
            <div className="kpi-icon-wrap" style={{ background: k.iconBg, color: k.iconColor }}>
              {k.icon}
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className={`kpi-trend ${k.trendType}`}>
              {k.trendType === "up" && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              )}
              {k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div className="card-title">Certificates by Category</div>
                <div className="card-subtitle">Distribution across credential types</div>
              </div>
              <span className="badge badge-purple">Live</span>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div style={msgStyle}><div style={spinnerStyle} /> Loading metrics...</div>
            ) : error ? (
              <div className="alert alert-danger" style={{ margin: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            ) : metrics.length === 0 ? (
              <div style={msgStyle}>No data yet — issue your first certificate.</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={metrics} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={26}>
                  <XAxis dataKey="name" stroke="transparent" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="transparent" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                  <Bar dataKey="Count" radius={[5, 5, 0, 0]}>
                    {metrics.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Info stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              color: "rgba(124,92,246,0.10)",
              border: "rgba(124,92,246,0.25)",
              iconColor: "#c4b5fd",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
              title: "Soroban Contracts",
              body: "Each credential is a permanent, tamper-proof record stored via Stellar's WASM-based smart contract platform.",
            },
            {
              color: "rgba(52,211,153,0.08)",
              border: "rgba(52,211,153,0.22)",
              iconColor: "var(--success)",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              title: "Permissionless Verify",
              body: "Anyone can verify a credential by its unique hash — no account or wallet required.",
            },
            {
              color: "rgba(56,189,248,0.08)",
              border: "rgba(56,189,248,0.22)",
              iconColor: "var(--blue)",
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
              title: "Role-Based Access",
              body: "Admins issue credentials; recipients hold them; verifiers need only the hash.",
            },
          ].map(c => (
            <div key={c.title} className="card" style={{ flex: 1 }}>
              <div className="card-body" style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "var(--r-sm)",
                    background: c.color, border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: c.iconColor,
                  }}>{c.icon}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const msgStyle = {
  display: "flex", alignItems: "center", gap: 10,
  color: "var(--text-muted)", fontSize: 13, padding: "40px 0",
};

const spinnerStyle = {
  width: 14, height: 14,
  border: "2px solid var(--border-strong)",
  borderTopColor: "var(--accent)",
  borderRadius: "50%",
  animation: "spin 0.75s linear infinite",
  flexShrink: 0,
};
