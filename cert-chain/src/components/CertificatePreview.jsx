import React, { useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';

export default function CertificatePreview({ cert }) {
  const [copied, setCopied] = useState(false);

  if (!cert) return null;

  const hashVal = cert.fullHash || cert.txHash || "";

  const handleCopy = () => {
    if (!hashVal) return;
    navigator.clipboard.writeText(hashVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={S.outer}>
      {/* Gold top border accent */}
      <div style={S.topAccent} />

      <div style={S.inner}>
        {/* Header row */}
        <div style={S.header}>
          <div style={S.orgLabel}>CERTIFICATE OF ACHIEVEMENT</div>
          <div style={S.orgName}>{cert.issuer}</div>
        </div>

        {/* Body */}
        <div style={S.body}>
          <div style={S.awardedTo}>This certificate is proudly awarded to</div>
          <div style={S.recipientName}>{cert.studentName}</div>
          <div style={S.completionText}>for the successful completion of</div>
          <div style={S.courseName}>{cert.course}</div>
          {cert.grade && (
            <div style={S.gradePill}>
              Grade: <strong>{cert.grade}</strong>
            </div>
          )}
          <div style={S.dateText}>Issued on {cert.date}</div>
        </div>

        {/* Divider with seal */}
        <div style={S.sealRow}>
          <div style={S.divLine} />
          <div style={S.seal}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
          <div style={S.divLine} />
        </div>

        {/* Footer — QR + hash */}
        <div style={S.footer}>
          <div style={S.qrWrap}>
            <QRCodeCanvas
              value={hashVal || "https://certchain.app"}
              size={64}
              bgColor="#ffffff"
              fgColor="#1e3a8a"
              level="L"
              includeMargin={false}
            />
          </div>
          <div style={S.hashSection}>
            <div style={S.hashLabel}>BLOCKCHAIN RECORD</div>
            <div style={S.hashValue}>{hashVal.slice(0, 28)}…</div>
            <button onClick={handleCopy} style={S.copyBtn}>
              {copied ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Hash
                </>
              )}
            </button>
          </div>
          <div style={S.stellarBadge}>
            <div style={S.stellarDot} />
            <div>
              <div style={S.stellarTitle}>Stellar Network</div>
              <div style={S.stellarSub}>Immutable · Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div style={S.bottomAccent} />
    </div>
  );
}

const S = {
  outer: {
    background: "linear-gradient(160deg, #fdfcfb 0%, #f9f7f4 60%, #f3f0eb 100%)",
    border: "1px solid #d4c5a9",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 24,
    boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
    position: "relative",
  },
  topAccent: {
    height: 4,
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)",
  },
  bottomAccent: {
    height: 3,
    background: "linear-gradient(90deg, #0ea5e9 0%, #2563eb 50%, #1e3a8a 100%)",
  },
  inner: {
    padding: "36px 44px 28px",
  },
  header: {
    textAlign: "center",
    paddingBottom: 28,
    borderBottom: "1.5px solid #e5ddd0",
    marginBottom: 32,
  },
  orgLabel: {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 8,
    fontFamily: "'Inter', sans-serif",
  },
  orgName: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1e3a8a",
    letterSpacing: "-0.5px",
    fontFamily: "'Inter', sans-serif",
  },
  body: {
    textAlign: "center",
    marginBottom: 28,
  },
  awardedTo: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 14,
    fontFamily: "Georgia, serif",
  },
  recipientName: {
    fontSize: "clamp(30px, 6vw, 46px)",
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
    marginBottom: 20,
    fontFamily: "'Inter', sans-serif",
  },
  completionText: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 10,
    fontFamily: "Georgia, serif",
  },
  courseName: {
    fontSize: "clamp(16px, 3.5vw, 22px)",
    fontWeight: 700,
    color: "#1e3a8a",
    letterSpacing: "-0.4px",
    marginBottom: 16,
    fontFamily: "'Inter', sans-serif",
  },
  gradePill: {
    display: "inline-block",
    padding: "4px 14px",
    background: "rgba(37,99,235,0.08)",
    border: "1px solid rgba(37,99,235,0.2)",
    borderRadius: 20,
    fontSize: 12.5,
    color: "#1e3a8a",
    marginBottom: 14,
    fontFamily: "'Inter', sans-serif",
  },
  dateText: {
    fontSize: 12.5,
    color: "#9ca3af",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  sealRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  divLine: {
    flex: 1,
    height: 1,
    background: "#e5ddd0",
  },
  seal: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "rgba(37,99,235,0.06)",
    border: "1.5px solid rgba(37,99,235,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  qrWrap: {
    padding: 8,
    background: "#ffffff",
    borderRadius: 10,
    border: "1px solid #e5ddd0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexShrink: 0,
  },
  hashSection: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  hashLabel: {
    fontSize: 9.5,
    fontWeight: 800,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontFamily: "'Inter', sans-serif",
  },
  hashValue: {
    fontSize: 11.5,
    color: "#374151",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    wordBreak: "break-all",
  },
  copyBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#ffffff",
    border: "1px solid #d1d5db",
    color: "#374151",
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 11.5,
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s ease",
    alignSelf: "flex-start",
  },
  stellarBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    background: "rgba(16,185,129,0.06)",
    border: "1px solid rgba(16,185,129,0.18)",
    borderRadius: 10,
    flexShrink: 0,
  },
  stellarDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
    boxShadow: "0 0 0 3px rgba(16,185,129,0.2)",
    flexShrink: 0,
  },
  stellarTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#059669",
    lineHeight: 1.2,
    fontFamily: "'Inter', sans-serif",
  },
  stellarSub: {
    fontSize: 10,
    color: "#6ee7b7",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
  },
};
