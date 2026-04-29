import React from "react";

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast ${t.type === "error" ? "toast-error" : "toast-info"}`}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {t.type === "error" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1, color: "var(--success)" }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            <span>{t.msg}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
