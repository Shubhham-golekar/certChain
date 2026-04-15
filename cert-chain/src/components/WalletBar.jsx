import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
    return (
        <div className="glass-container" style={styles.bar}>
            <div style={styles.info}>
                <div style={styles.avatar}>{connected ? "✨" : "🔒"}</div>
                <div>
                    <div style={styles.label}>Stellar Freighter Wallet</div>
                    <div style={styles.address}>{connected ? address : "Not Connected"}</div>
                </div>
            </div>
            {connected ? (
                <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={onDisconnect}>
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
    bar: {
        padding: "24px 32px", marginBottom: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    },
    info: { display: "flex", alignItems: "center", gap: 20 },
    avatar: {
        width: 52, height: 52, borderRadius: "16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05)"
    },
    label: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", marginBottom: 6 },
    address: { fontSize: 15, color: "var(--text)", fontWeight: 600, fontFamily: "var(--font-mono)" },
    btn: {
        padding: "12px 24px", borderRadius: 12, border: "none",
        fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600,
        cursor: "pointer", letterSpacing: "1px",
    },
    btnOutline: { background: "rgba(255,255,255,0.05)", color: "var(--text)", border: "1px solid var(--border)" },
};