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
          <div className="sidebar-brand-ver">Enterprise</div>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
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
        <div className="network-badge">
          <span className="network-dot" />
          <span className="network-text">Stellar Testnet</span>
        </div>

        {connected && (
          <div style={{
            marginTop: 10,
            padding: "7px 12px",
            borderRadius: "var(--radius-md)",
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--success)", flexShrink: 0 }}>
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--success)" }}>Wallet Connected</span>
          </div>
        )}
      </div>
    </aside>
  );
}
