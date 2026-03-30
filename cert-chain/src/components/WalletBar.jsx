import React from "react";

export default function WalletBar({ connected, address, loading, onConnect, onDisconnect }) {
    return (
        <div style={styles.bar}>
            <div style={styles.info}>
                <div style={styles.avatar}>{connected ? "🔓" : "🔒"}</div>
                <div>
                    <div style={styles.label}>Freighter Wallet</div>
                    <div style={styles.address}>{connected ? address : "Not Connected"}</div>
                </div>
            </div>
            {connected ? (
                <button style={{ ...styles.btn, ...styles.btnOutline }} onClick={onDisconnect}>
                    Disconnect
                </button>
            ) : (
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={onConnect} disabled={loading}>
                    {loading ? "Connecting..." : "Connect Wallet"}
                </button>
            )}
        </div>
    );
}

const styles = {
    bar: {
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 24, marginBottom: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    },
    info: { display: "flex", alignItems: "center", gap: 14 },
    avatar: {
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
    },
    label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)", marginBottom: 4 },
    address: { fontSize: 13, color: "var(--text)", fontWeight: 500 },
    btn: {
        padding: "10px 20px", borderRadius: 8, border: "none",
        fontFamily: "'DM Mono', monospace", fontSize: 12,
        cursor: "pointer", letterSpacing: "0.5px",
    },
    btnPrimary: { background: "var(--accent)", color: "white" },
    btnOutline: { background: "transparent", color: "var(--accent3)", border: "1px solid var(--accent3)" },
};