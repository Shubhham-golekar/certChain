import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

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
    <div style={S.wrapper}>
      {/* Corner ornaments */}
      <div style={{ ...S.ornament, top: 18, left: 18 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ ...S.ornament, top: 18, right: 18, transform: "scaleX(-1)" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ ...S.ornament, bottom: 18, left: 18, transform: "scaleY(-1)" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ ...S.ornament, bottom: 18, right: 18, transform: "scale(-1,-1)" }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M2 26 L2 2 L26 2" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* Top gold line */}
      <div style={S.topBar} />

      <div style={S.inner}>
        {/* Watermark */}
        <div style={S.watermarkText}>CERTIFIED</div>

        {/* Header */}
        <div style={S.header}>
          <div style={S.headerTag}>Certificate of Achievement</div>
          <div style={S.issuerName}>{cert.issuer}</div>
          <div style={S.headerDivider}>
            <div style={S.dividerLine} />
            <div style={S.sealCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
            </div>
            <div style={S.dividerLine} />
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>
          <p style={S.awardedTo}>This certificate is proudly awarded to</p>
          <div style={S.recipientName}>{cert.studentName}</div>
          <p style={S.completionText}>for the successful completion of</p>
          <div style={S.courseName}>{cert.course}</div>

          <div style={S.metaRow}>
            {cert.grade && (
              <div style={S.metaPill}>
                <span style={S.metaPillLabel}>Grade</span>
                <span style={S.metaPillValue}>{cert.grade}</span>
              </div>
            )}
            <div style={S.metaPill}>
              <span style={S.metaPillLabel}>Date</span>
              <span style={S.metaPillValue}>{cert.date}</span>
            </div>
            <div style={{ ...S.metaPill, borderColor: "#4ade80", background: "rgba(74,222,128,0.06)" }}>
              <span style={{ ...S.metaPillLabel, color: "#16a34a" }}>Network</span>
              <span style={{ ...S.metaPillValue, color: "#15803d" }}>Stellar ✓</span>
            </div>
          </div>
        </div>

        {/* Blockchain footer */}
        <div style={S.footer}>
          <div style={S.qrBlock}>
            <div style={S.qrWrap}>
              <QRCodeCanvas
                value={hashVal || "https://certchain.app"}
                size={72}
                bgColor="#ffffff"
                fgColor="#1e3a8a"
                level="L"
                includeMargin={false}
              />
            </div>
            <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 6, textAlign: "center", letterSpacing: "0.3px" }}>SCAN TO VERIFY</div>
          </div>

          <div style={S.hashBlock}>
            <div style={S.hashLabel}>BLOCKCHAIN RECORD</div>
            <div style={S.hashValue}>{hashVal.slice(0, 32)}…</div>
            <button onClick={handleCopy} style={S.copyBtn}>
              {copied ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Hash
                </>
              )}
            </button>
          </div>

          <div style={S.verifiedBadge}>
            <div style={S.verifiedDot} />
            <div>
              <div style={S.verifiedTitle}>Stellar Network</div>
              <div style={S.verifiedSub}>Immutable · Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div style={S.bottomBar} />
    </div>
  );
}

const S = {
  wrapper: {
    position: "relative",
    background: "linear-gradient(160deg, #fefefe 0%, #f8f6f0 55%, #f2ede4 100%)",
    border: "1.5px solid #d6c9a8",
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 24,
    boxShadow: "0 12px 48px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.12)",
  },
  ornament: {
    position: "absolute",
    zIndex: 1,
    opacity: 0.7,
  },
  topBar: {
    height: 5,
    background: "linear-gradient(90deg, #b8860b 0%, #d4af37 30%, #f0c040 50%, #d4af37 70%, #b8860b 100%)",
  },
  bottomBar: {
    height: 4,
    background: "linear-gradient(90deg, #b8860b 0%, #d4af37 30%, #f0c040 50%, #d4af37 70%, #b8860b 100%)",
  },
  inner: {
    padding: "36px 48px 28px",
    position: "relative",
  },
  watermarkText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-35deg)",
    fontSize: 80,
    fontWeight: 900,
    color: "rgba(30,58,138,0.028)",
    letterSpacing: "14px",
    userSelect: "none",
    pointerEvents: "none",
    fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap",
  },
  header: {
    textAlign: "center",
    marginBottom: 28,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 10,
    fontFamily: "'Inter', sans-serif",
  },
  issuerName: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1e3a8a",
    letterSpacing: "-0.5px",
    marginBottom: 18,
    fontFamily: "'Inter', sans-serif",
  },
  headerDivider: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
  },
  sealCircle: {
    width: 44, height: 44,
    borderRadius: "50%",
    background: "rgba(30,58,138,0.05)",
    border: "1.5px solid rgba(212,175,55,0.50)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  body: {
    textAlign: "center",
    marginBottom: 28,
  },
  awardedTo: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 12,
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  recipientName: {
    fontSize: "clamp(30px, 5.5vw, 48px)",
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
    marginBottom: 18,
    fontFamily: "'Inter', sans-serif",
  },
  completionText: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 10,
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  courseName: {
    fontSize: "clamp(16px, 3vw, 22px)",
    fontWeight: 700,
    color: "#1e3a8a",
    letterSpacing: "-0.4px",
    marginBottom: 20,
    fontFamily: "'Inter', sans-serif",
  },
  metaRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  metaPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    background: "rgba(30,58,138,0.05)",
    border: "1px solid rgba(30,58,138,0.15)",
    borderRadius: 20,
    fontFamily: "'Inter', sans-serif",
  },
  metaPillLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metaPillValue: {
    fontSize: 12.5,
    fontWeight: 700,
    color: "#1e3a8a",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    paddingTop: 20,
    borderTop: "1px solid rgba(212,175,55,0.30)",
    flexWrap: "wrap",
  },
  qrBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  qrWrap: {
    padding: 8,
    background: "#ffffff",
    borderRadius: 10,
    border: "1px solid #e5ddd0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  hashBlock: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  hashLabel: {
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontFamily: "'Inter', sans-serif",
  },
  hashValue: {
    fontSize: 11.5,
    color: "#374151",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    background: "#f3f4f6",
    padding: "7px 11px",
    borderRadius: 7,
    border: "1px solid #e5e7eb",
    wordBreak: "break-all",
  },
  copyBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "#fff",
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
  verifiedBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: "rgba(22,163,74,0.06)",
    border: "1px solid rgba(22,163,74,0.20)",
    borderRadius: 11,
    flexShrink: 0,
  },
  verifiedDot: {
    width: 8, height: 8,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.20)",
    flexShrink: 0,
  },
  verifiedTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#15803d",
    lineHeight: 1.2,
    fontFamily: "'Inter', sans-serif",
  },
  verifiedSub: {
    fontSize: 10,
    color: "#4ade80",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
  },
};
