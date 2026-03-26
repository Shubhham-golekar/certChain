import React from "react";
import CertificatePreview from "./CertificatePreview";
import { CERT_TYPES } from "../utils/constants";

export default function IssueTab({ walletConnected, onIssue, isIssuing, previewCert, form, onChange }) {
  const fields = [
    { name: "studentName", label: "Student Full Name *", placeholder: "e.g. Shubham Golekar" },
    { name: "studentEmail", label: "Student Email Address *", placeholder: "e.g. shubham@example.com" },
    { name: "issuer", label: "Issuing Institution *", placeholder: "e.g. IIT Bombay" },
    { name: "grade", label: "Grade / Score (optional)", placeholder: "e.g. A+, 95/100" },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.title}>📤 Issue New Certificate</div>
      <div style={styles.subtitle}>
        Fill in the details below. The certificate will be recorded on Stellar Testnet as a transaction.
      </div>

      <div style={styles.grid}>
        {fields.map((f) => (
          <div key={f.name} style={styles.field}>
            <label>{f.label}</label>
            <input name={f.name} value={form[f.name]} onChange={onChange} placeholder={f.placeholder} />
          </div>
        ))}

        <div style={styles.field}>
          <label>Course / Certification *</label>
          <select name="course" value={form.course} onChange={onChange}>
            <option value="">Select course...</option>
            {CERT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={styles.field}>
          <label>Issue Date</label>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </div>
      </div>

      <div style={styles.submitRow}>
        <button
          style={{ ...styles.btn, ...(isIssuing || !walletConnected ? styles.btnDisabled : styles.btnPrimary) }}
          onClick={onIssue}
          disabled={isIssuing || !walletConnected}
        >
          {isIssuing ? "Recording on Blockchain..." : !walletConnected ? "Connect Wallet First" : "🎓 Issue Certificate"}
        </button>
      </div>

      <CertificatePreview cert={previewCert} />
    </div>
  );
}

const styles = {
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, marginBottom: 24 },
  title: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 },
  subtitle: { color: "var(--muted)", fontSize: 12, marginBottom: 28, lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  submitRow: { display: "flex", justifyContent: "flex-end", marginTop: 8 },
  btn: { padding: "14px 32px", borderRadius: 8, border: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: "pointer", letterSpacing: "0.5px" },
  btnPrimary: { background: "var(--accent)", color: "white" },
  btnDisabled: { background: "var(--border)", color: "var(--muted)", cursor: "not-allowed" },
};
