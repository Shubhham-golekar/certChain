import React from "react";

export default function ToastContainer({ toasts }) {
  return (
    <div style={styles.wrap}>
      {toasts.map((t) => (
        <div key={t.id} style={{ ...styles.toast, ...(t.type === "error" ? styles.error : styles.success) }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: { position: "fixed", top: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 12 },
  toast: {
    padding: "16px 24px", borderRadius: 16, fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: 600,
    animation: "fadeUp 0.3s ease", maxWidth: 360,
    boxShadow: "var(--shadow-md)",
  },
  success: { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)" },
  error: { background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)" },
};
