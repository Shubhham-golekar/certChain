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
    padding: "16px 24px", borderRadius: 12, fontSize: 13, fontFamily: "var(--font-primary)", fontWeight: 600,
    animation: "fadeIn 0.3s ease", maxWidth: 320,
    boxShadow: "var(--shadow-lg)",
  },
  success: { background: "#dcfce7", border: "1px solid #bbf7d0", color: "#166534" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "var(--danger)" },
};
