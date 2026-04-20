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
        padding: "20px 24px", marginBottom: 40,
        background: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-xl)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    },
    info: { display: "flex", alignItems: "center", gap: 16 },
    avatar: {
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-strong)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0, boxShadow: "var(--shadow-xs)"
    },
    label: { fontSize: 13, fontWeight: 700, color: "var(--text-sub)", marginBottom: 2 },
    address: { fontSize: 13, color: "var(--text-main)", fontWeight: 500, fontFamily: "var(--font-mono)" },
    btn: {
        padding: "10px 20px", borderRadius: 99, border: "none",
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
        cursor: "pointer", transition: "var(--t)"
    },
    btnOutline: { background: "var(--bg-main)", color: "var(--text-sub)", border: "1px solid var(--border)" },
};