import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.info}>
        <div style={styles.avatar}>
          {connected ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>
        <div>
          <div style={styles.label}>Freighter Wallet</div>
          <div style={styles.address}>
            {connected ? address : "Not connected"}
          </div>
        </div>
      </div>
      {connected ? (
        <button style={styles.btnOutline} onClick={onDisconnect}>
          Disconnect
        </button>
      ) : (
        <button className="btn-primary" onClick={onConnect} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    marginBottom: 32,
    flexWrap: "wrap",
  },
  info: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-sub)",
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 3,
  },
  address: {
    fontSize: 13,
    color: "var(--text-main)",
    fontFamily: "var(--font-mono)",
    fontWeight: 400,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 340,
  },
  btnOutline: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-sub)",
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "var(--t)",
    flexShrink: 0,
  },
};
