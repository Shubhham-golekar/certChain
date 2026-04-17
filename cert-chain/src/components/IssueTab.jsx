import React from "react";
import CertificatePreview from "./CertificatePreview";
import { CERT_TYPES } from "../utils/constants";

export default function IssueTab({ walletConnected, onIssue, isIssuing, previewCert, form, onChange }) {
  const fields = [
    { name: "studentName", label: "Student Full Name *", placeholder: "e.g. Shubham Golekar" },
    { name: "studentWallet", label: "Student Wallet Address *", placeholder: "e.g. G..." },
    { name: "issuer", label: "Issuing Institution *", placeholder: "e.g. IIT Bombay" },
    { name: "grade", label: "Grade / Score (optional)", placeholder: "e.g. A+, 95/100" },
  ];

  return (
    <div className="card" style={styles.card}>
      <div style={styles.title}>📤 Issue New Certificate</div>
      <div style={styles.subtitle}>
        Fill in the details below. The certificate will be recorded on Stellar Testnet as a tamper-proof transaction.
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
          className={isIssuing || !walletConnected ? "" : "btn-primary"}
          style={{ ...styles.btn, ...(isIssuing || !walletConnected ? styles.btnDisabled : {}) }}
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
  card: { padding: 40, marginBottom: 24, background: "var(--bg-card)" },
  title: { fontFamily: "var(--font-primary)", fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  submitRow: { display: "flex", justifyContent: "flex-end", marginTop: 20 },
  btn: { padding: "12px 28px", borderRadius: 8, border: "none", fontFamily: "var(--font-primary)", fontSize: 14, cursor: "pointer", fontWeight: 600 },
  btnDisabled: { background: "var(--bg-main)", color: "var(--text-light)", border: "1px solid var(--border)", cursor: "not-allowed" },
};
