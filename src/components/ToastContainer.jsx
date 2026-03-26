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
  wrap: { position: "fixed", top: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 },
  toast: {
    padding: "14px 20px", borderRadius: 10, fontSize: 13,
    animation: "slideIn 0.3s ease", maxWidth: 320,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  success: { background: "#0f2420", border: "1px solid rgba(0,212,170,0.3)", color: "var(--accent2)" },
  error: { background: "#211010", border: "1px solid rgba(255,107,107,0.3)", color: "var(--accent3)" },
};
