import React from "react";
import CertificatePreview from "./CertificatePreview";
import { CERT_TYPES } from "../utils/constants";

export default function IssueTab({ walletConnected, onIssue, isIssuing, previewCert, form, onChange }) {
  const fields = [
    { name: "studentName", label: "Who is receiving this?", placeholder: "e.g. Priya Sharma" },
    { name: "studentWallet", label: "Their Stellar Wallet (Public Key)", placeholder: "G..." },
    { name: "issuer", label: "Issued By (Organization / Individual)", placeholder: "e.g. Code For India" },
    { name: "grade", label: "Grade or Note (Optional)", placeholder: "e.g. A+, Completed with Honors" },
  ];

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Hand Out a Certificate 📝</div>
        <div style={styles.subtitle}>
          Jot down the details below. Once you issue it, it's permanently recorded on the Stellar network.
        </div>
      </div>

      <div style={styles.grid}>
        {fields.map((f) => (
          <div key={f.name} style={styles.field}>
            <label>{f.label}</label>
            <input name={f.name} value={form[f.name]} onChange={onChange} placeholder={f.placeholder} />
          </div>
        ))}

        <div style={styles.field}>
          <label>What's this for?</label>
          <select name="course" value={form.course} onChange={onChange}>
            <option value="">Select an option...</option>
            {CERT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={styles.field}>
          <label>Date Issued</label>
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
          {isIssuing ? "Jotting it down..." : !walletConnected ? "Connect Wallet To Start" : "Issue & Record on Blockchain"}
        </button>
      </div>

      <CertificatePreview cert={previewCert} />
    </div>
  );
}

const styles = {
  card: { padding: "clamp(24px, 5vw, 48px)", marginBottom: 24 },
  header: { marginBottom: "clamp(20px, 5vw, 32px)" },
  title: { fontSize: "clamp(20px, 6vw, 24px)", fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-sub)", fontSize: "clamp(13px, 4vw, 15px)", lineHeight: 1.5, maxWidth: "100%" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "clamp(16px, 3vw, 32px)", marginBottom: 32 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  submitRow: { display: "flex", justifyContent: "flex-end", marginTop: 10, paddingTop: 30, borderTop: "1px dashed var(--border)", flexWrap: "wrap", gap: 10 },
  btn: { padding: "12px 28px", borderRadius: "100px", border: "none", fontSize: 14, fontWeight: 600, minHeight: 44 },
  btnDisabled: { background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "not-allowed" },
};
