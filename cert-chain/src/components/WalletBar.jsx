import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      {connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Connected
            </div>
            <div style={{
              fontSize: 12,
              color: "var(--text-sub)",
              fontFamily: "var(--font-mono)",
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {address}
            </div>
          </div>
          <button className="btn-secondary" onClick={onDisconnect} style={{ padding: "7px 14px", fontSize: 12 }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button className="btn-primary" onClick={onConnect} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
