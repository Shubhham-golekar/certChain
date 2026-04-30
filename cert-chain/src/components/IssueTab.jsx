import React, { useState } from "react";
import CertificatePreview from "./CertificatePreview";
import { CERT_TYPES } from "../utils/constants";

const FIELDS = [
  {
    name: "studentName",
    label: "Recipient Full Name",
    placeholder: "e.g. Priya Sharma",
    required: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    hint: "Legal name as it will appear on the certificate",
  },
  {
    name: "studentWallet",
    label: "Recipient Stellar Wallet",
    placeholder: "GABCDEF... (56 characters)",
    required: true,
    mono: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    hint: "The certificate will be anchored to this public key",
  },
  {
    name: "issuer",
    label: "Issuing Organization",
    placeholder: "e.g. Code For India",
    required: true,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    hint: "The institution or organization issuing this credential",
  },
  {
    name: "grade",
    label: "Grade / Assessment (Optional)",
    placeholder: "e.g. A+, Distinction, Pass",
    required: false,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    hint: "Leave blank if no grade applies",
  },
];

function StepDot({ n, state }) {
  return (
    <div className={`step-circle ${state}`}>
      {state === "done" ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : n}
    </div>
  );
}

export default function IssueTab({ walletConnected, onIssue, isIssuing, previewCert, form, onChange }) {
  const [step, setStep] = useState(1);

  const step1Ok = form.studentName.trim() && form.studentWallet.trim().length >= 50 && form.studentWallet.trim().startsWith("G");
  const step2Ok = form.course && form.date;

  const steps = [
    { n: "1", label: "Recipient", state: step > 1 ? "done" : step === 1 ? "active" : "" },
    { n: "2", label: "Credential", state: step > 2 ? "done" : step === 2 ? "active" : "" },
    { n: "3", label: "Review & Issue", state: step === 3 ? "active" : "" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, maxWidth: 820 }}>
      {/* Wallet warning */}
      {!walletConnected && (
        <div className="alert alert-danger">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>
            <strong style={{ color: "inherit" }}>Wallet required. </strong>
            Connect your Freighter wallet using the button in the top-right corner before issuing.
          </span>
        </div>
      )}

      {/* Form card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div className="card-title">New Credential</div>
              <div className="card-subtitle">Complete all required fields to mint a blockchain-anchored certificate</div>
            </div>
            <span className="badge badge-blue">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Soroban
            </span>
          </div>

          {/* Steps */}
          <div className="step-bar" style={{ marginTop: 22, marginBottom: 0 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="step-item" style={i === steps.length - 1 ? { flex: "none" } : {}}>
                  <StepDot n={s.n} state={s.state} />
                  <span className={`step-label${s.state === "active" ? " active" : ""}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`step-line${s.state === "done" ? " done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="card-body">
          {/* Step 1 */}
          {step === 1 && (
            <div style={{ animation: "fade-up 0.18s ease-out" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {FIELDS.slice(0, 2).map(f => (
                  <div key={f.name} className="form-group"
                    style={{ gridColumn: f.name === "studentWallet" ? "1 / -1" : undefined }}>
                    <label>
                      {f.label}
                      {f.required && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon">{f.icon}</span>
                      <input
                        name={f.name}
                        value={form[f.name]}
                        onChange={onChange}
                        placeholder={f.placeholder}
                        style={f.mono ? { fontFamily: "var(--font-mono)", fontSize: 12 } : {}}
                      />
                    </div>
                    {f.hint && <span className="form-hint">{f.hint}</span>}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 26 }}>
                <button className="btn-primary" onClick={() => setStep(2)} disabled={!step1Ok}>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ animation: "fade-up 0.18s ease-out" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Certificate Type <span style={{ color: "var(--danger)" }}>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </span>
                    <select name="course" value={form.course} onChange={onChange}>
                      <option value="">Select credential type...</option>
                      {CERT_TYPES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <span className="form-hint">Choose the category that best describes this credential</span>
                </div>

                {FIELDS.slice(2, 4).map(f => (
                  <div key={f.name} className="form-group">
                    <label>
                      {f.label}
                      {f.required && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon">{f.icon}</span>
                      <input name={f.name} value={form[f.name]} onChange={onChange} placeholder={f.placeholder} />
                    </div>
                    {f.hint && <span className="form-hint">{f.hint}</span>}
                  </div>
                ))}

                <div className="form-group">
                  <label>Date Issued <span style={{ color: "var(--danger)" }}>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </span>
                    <input type="date" name="date" value={form.date} onChange={onChange} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back
                </button>
                <button className="btn-primary" onClick={() => setStep(3)} disabled={!step2Ok}>
                  Review
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{ animation: "fade-up 0.18s ease-out" }}>
              {/* Summary */}
              <div style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                marginBottom: 20,
              }}>
                <div style={{ padding: "11px 18px", borderBottom: "1px solid var(--border)", fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                  Certificate Summary
                </div>
                {[
                  { label: "Recipient", value: form.studentName },
                  { label: "Wallet", value: form.studentWallet, mono: true, truncate: true },
                  { label: "Type", value: form.course },
                  { label: "Issuer", value: form.issuer },
                  { label: "Grade", value: form.grade || "—" },
                  { label: "Date", value: form.date },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: "flex",
                    padding: "12px 18px",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    gap: 16,
                    alignItems: "center",
                  }}>
                    <span style={{ width: 72, flexShrink: 0, fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {row.label}
                    </span>
                    <span style={{
                      fontSize: 13,
                      color: row.value === "—" ? "var(--text-muted)" : "var(--text-main)",
                      fontFamily: row.mono ? "var(--font-mono)" : "var(--font-sans)",
                      overflow: "hidden",
                      textOverflow: row.truncate ? "ellipsis" : "unset",
                      whiteSpace: row.truncate ? "nowrap" : "normal",
                      fontWeight: 500,
                    }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Blockchain notice */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 16px",
                background: "rgba(91,110,245,0.07)",
                border: "1px solid var(--accent-border)",
                borderRadius: "var(--r-md)",
                marginBottom: 22,
                fontSize: 12.5,
                color: "#aabbff",
                lineHeight: 1.6,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                This will submit a transaction to Stellar Testnet. Your Freighter wallet will prompt you to sign before broadcasting.
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={async () => { await onIssue(); if (!isIssuing) setStep(1); }}
                  disabled={isIssuing || !walletConnected}
                  style={{ minWidth: 190 }}
                >
                  {isIssuing ? (
                    <>
                      <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      Issue on Blockchain
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {previewCert && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span className="badge badge-success">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Certificate Issued
            </span>
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>— Preview below</span>
          </div>
          <CertificatePreview cert={previewCert} />
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
