import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
    return (
        <div style={styles.wrap}>
            <div style={styles.info}>
                <div style={styles.avatar}>{connected ? "🔌" : "🔒"}</div>
                <div>
                    <div style={styles.label}>Stellar Freighter Wallet</div>
                    <div style={styles.address}>{connected ? address : "Not connected yet"}</div>
                </div>
            </div>
            {connected ? (
                <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={onDisconnect}>
                    Disconnect
                </button>
            ) : (
                <button className="btn-primary" onClick={onConnect} disabled={loading}>
                    {loading ? "Connecting..." : "Connect to Start"}
                </button>
            )}
        </div>
    );
}

const styles = {
    wrap: {
        padding: "clamp(14px, 3vw, 20px) clamp(16px, 4vw, 24px)", marginBottom: 40,
        background: "var(--bg-card)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(8px, 3vw, 16px)",
        flexWrap: "wrap", boxShadow: "var(--shadow-sm)",
        transition: "all 0.24s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    info: { display: "flex", alignItems: "center", gap: "clamp(10px, 3vw, 16px)", minWidth: 0 },
    avatar: {
        width: "clamp(36px, 8vw, 44px)", height: "clamp(36px, 8vw, 44px)", borderRadius: "50%",
        background: "var(--bg-subtle)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "clamp(16px, 4vw, 20px)", flexShrink: 0, boxShadow: "var(--shadow-xs)"
    },
    label: { fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 700, color: "var(--text-sub)", marginBottom: 2 },
    address: { fontSize: "clamp(11px, 2.5vw, 13px)", color: "var(--text-main)", fontWeight: 500, fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis" },
    btn: {
        padding: "clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)", borderRadius: 99, border: "none",
        fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 2.5vw, 13px)", fontWeight: 600,
        cursor: "pointer", transition: "var(--t)", minHeight: 36, minWidth: 100,
    },
    btnOutline: { background: "var(--bg-subtle)", color: "var(--text-sub)", border: "1px solid var(--border)", cursor: "pointer" },
};
