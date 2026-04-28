import React from "react";

export default function ToastContainer({ toasts }) {
  return (
    <div style={styles.wrap}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            ...(t.type === "error" ? styles.error : styles.info),
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: "calc(100vw - 48px)",
  },
  toast: {
    padding: "12px 18px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    lineHeight: 1.5,
    maxWidth: 340,
    boxShadow: "var(--shadow-md)",
    animation: "fadeUp 0.2s ease-out",
  },
  info: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-strong)",
    color: "var(--text-main)",
  },
  error: {
    background: "var(--danger-bg)",
    border: "1px solid var(--danger-border)",
    color: "var(--danger)",
  },
};
