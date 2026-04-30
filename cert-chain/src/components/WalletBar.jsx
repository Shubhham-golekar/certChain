import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px 6px 10px",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--r-md)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--success)",
              boxShadow: "0 0 6px var(--success)",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: 11.5, color: "var(--text-sub)",
              fontFamily: "var(--font-mono)",
              maxWidth: 160,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {address}
            </span>
          </div>
          <button className="btn-secondary" onClick={onDisconnect}
            style={{ padding: "7px 14px", fontSize: 12 }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="btn-primary" onClick={onConnect} disabled={loading}
          style={{ padding: "8px 18px" }}>
          {loading ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Connect Wallet
            </>
          )}
        </button>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
