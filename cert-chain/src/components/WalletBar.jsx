import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
    return (
        <div className="card" style={styles.bar}>
            <div style={styles.info}>
                <div style={styles.avatar}>{connected ? "🔌" : "🔒"}</div>
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
        padding: "24px 32px", marginBottom: 40, background: "var(--bg-card)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    },
    info: { display: "flex", alignItems: "center", gap: 20 },
    avatar: {
        width: 48, height: 48, borderRadius: "12px",
        background: "var(--bg-main)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
    },
    label: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 4 },
    address: { fontSize: 14, color: "var(--text-main)", fontWeight: 600, fontFamily: "var(--font-mono)" },
    btn: {
        padding: "10px 20px", borderRadius: 8, border: "none",
        fontFamily: "var(--font-primary)", fontSize: 14, fontWeight: 600,
        cursor: "pointer", transition: "var(--transition-fast)"
    },
    btnOutline: { background: "var(--bg-main)", color: "var(--danger)", border: "1px solid var(--border)" },
};