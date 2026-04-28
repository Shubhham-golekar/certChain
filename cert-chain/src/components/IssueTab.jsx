import React from "react";
import CertificatePreview from "./CertificatePreview";
import { CERT_TYPES } from "../utils/constants";

export default function IssueTab({ walletConnected, onIssue, isIssuing, previewCert, form, onChange }) {
  const fields = [
    { name: "studentName",   label: "Recipient Name",            placeholder: "e.g. Priya Sharma" },
    { name: "studentWallet", label: "Recipient Stellar Wallet",  placeholder: "G..." },
    { name: "issuer",        label: "Issuing Organization",      placeholder: "e.g. Code For India" },
    { name: "grade",         label: "Grade / Note (Optional)",   placeholder: "e.g. A+, Distinction" },
  ];

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Issue Certificate</h2>
        <p style={styles.subtitle}>
          Fill in the recipient details. Once issued, the certificate is permanently recorded on the Stellar blockchain.
        </p>
      </div>

      <div style={styles.grid}>
        {fields.map((f) => (
          <div key={f.name} style={styles.field}>
            <label>{f.label}</label>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={onChange}
              placeholder={f.placeholder}
            />
          </div>
        ))}

        <div style={styles.field}>
          <label>Certificate Type</label>
          <select name="course" value={form.course} onChange={onChange}>
            <option value="">Select type...</option>
            {CERT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={styles.field}>
          <label>Date Issued</label>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </div>
      </div>

      <div style={styles.footer}>
        <button
          className={isIssuing || !walletConnected ? "" : "btn-primary"}
          style={isIssuing || !walletConnected ? styles.btnDisabled : {}}
          onClick={onIssue}
          disabled={isIssuing || !walletConnected}
        >
          {isIssuing
            ? "Broadcasting..."
            : !walletConnected
            ? "Connect Wallet to Issue"
            : "Issue & Record on Blockchain"}
        </button>
      </div>

      <CertificatePreview cert={previewCert} />
    </div>
  );
}

const styles = {
  card: { padding: "40px 40px 36px", marginBottom: 24 },
  header: { marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text-main)",
    marginBottom: 8,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    color: "var(--text-sub)",
    fontSize: 14,
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  field: { display: "flex", flexDirection: "column" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: 24,
    borderTop: "1px solid var(--border)",
  },
  btnDisabled: {
    padding: "10px 22px",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-subtle)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "not-allowed",
  },
};
