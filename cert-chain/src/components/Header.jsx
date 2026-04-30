import React from "react";
import logoImg from "../certchain_logo.png";

export default function Header({ tab, setTab, tabs, connected }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <img src={logoImg} alt="CertChain" className="sidebar-brand-logo" />
        <div>
          <div className="sidebar-brand-name">CertChain</div>
          <div className="sidebar-brand-tag">Enterprise</div>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Platform</div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`sidebar-nav-item${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="sidebar-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="net-pill">
          <span className="net-dot" />
          <span className="net-text">Stellar Testnet</span>
        </div>

        {connected && (
          <div style={{
            marginTop: 10,
            padding: "8px 12px",
            borderRadius: "var(--r-md)",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 6px var(--accent-glow)",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#c4b5fd" }}>Wallet Connected</span>
          </div>
        )}
      </div>
    </aside>
  );
}
