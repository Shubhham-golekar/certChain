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
  wrap: { 
    position: "fixed", 
    top: "clamp(12px, 3vw, 24px)", 
    right: "clamp(12px, 3vw, 24px)", 
    zIndex: 1000, 
    display: "flex", 
    flexDirection: "column", 
    gap: 12,
    maxWidth: "calc(100vw - 24px)",
  },
  toast: {
    padding: "clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)", 
    borderRadius: 16, 
    fontSize: "clamp(12px, 2.5vw, 13px)", 
    fontFamily: "var(--font-sans)", 
    fontWeight: 600,
    animation: "fadeUp 0.3s ease", 
    maxWidth: "clamp(280px, 90vw, 360px)",
    boxShadow: "var(--shadow-md)",
  },
  success: { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-main)" },
  error: { background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)" },
};
