import React, { useState } from "react";
import { TransactionBuilder, Networks, scValToNative, Account } from "@stellar/stellar-sdk";
import { buildVerifyCertOp, server } from "../hooks/useSoroban";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../hooks/useToast";
import CertificatePreview from "./CertificatePreview";

export default function VerifyTab({ certs = [] }) {
  const { publicKey } = useWallet();
  const { addToast } = useToast();
  const [hash, setHash]     = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard.");
  };

  const verify = async () => {
    const searchHash = hash.trim();
    if (!searchHash) {
      addToast("Please enter a certificate hash.", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const localMatch = certs.find((c) => c.fullHash === searchHash);
      if (localMatch) {
        setResult({
          valid: true,
          studentName:   localMatch.studentName   || "Verified Holder",
          studentWallet: localMatch.studentWallet || "",
          course:        localMatch.course        || "",
          issuer:        localMatch.issuer        || "",
          date:          localMatch.date          || "",
          fullHash:      searchHash,
          source:        "local",
        });
        addToast("Certificate found in records.");
        return;
      }

      addToast("Querying the blockchain...");
      const callerKey = publicKey || "GAX5NPUQJ7R6ZJ3WPKVIVZ2UQLNTSWNTZ2XOYEFT5B6NYYF7BOM6CQ4W";
      const dummyAccount = new Account(callerKey, "0");

      const tx = new TransactionBuilder(dummyAccount, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(buildVerifyCertOp(searchHash))
        .setTimeout(30)
        .build();

      const simResponse = await server.simulateTransaction(tx);

      if (!simResponse.result || !simResponse.result.retval) {
        throw new Error("Certificate not found. Verify the hash is correct.");
      }

      const certData = scValToNative(simResponse.result.retval);
      setResult({
        valid:         certData.valid !== undefined ? certData.valid : true,
        studentName:   "Verified Blockchain Record",
        studentWallet: certData.student_wallet || certData[1] || "",
        course:        certData.course || certData[2] || "",
        issuer:        certData.issuer || certData[0] || "",
        date:          certData.date   || certData[3] || "",
        fullHash:      searchHash,
        source:        "blockchain",
      });

      addToast("Verified on-chain.");
    } catch (err) {
      console.error("Verify error:", err);
      setResult({ valid: false, fullHash: searchHash });
      addToast(err.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Verify Certificate</h2>
        <p style={styles.subtitle}>
          Paste a certificate transaction hash to confirm its authenticity on the Stellar blockchain.
        </p>
      </div>

      <div style={styles.field}>
        <label>Transaction Hash</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter the full certificate hash..."
          />
          {hash && (
            <button style={styles.iconBtn} onClick={() => copyToClipboard(hash)} title="Copy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          className={loading ? "" : "btn-primary"}
          style={loading ? styles.btnDisabled : {}}
          onClick={verify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 40 }}>
          {result.valid ? (
            <div>
              <div style={styles.verifiedBanner}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Certificate Verified
                {result.source === "blockchain" ? " — On-Chain" : " — From Index"}
              </div>
              <CertificatePreview cert={result} />
            </div>
          ) : (
            <div style={styles.invalidBox}>
              <div style={styles.invalidTitle}>Not Found</div>
              <p style={styles.invalidText}>
                No certificate matching this hash was found. Ensure you copied the complete hash correctly.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card:     { padding: "40px 40px 36px", marginBottom: 24 },
  header:   { marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--border)" },
  title:    { fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginBottom: 8, letterSpacing: "-0.3px" },
  subtitle: { color: "var(--text-sub)", fontSize: 14, lineHeight: 1.6 },
  field:    { display: "flex", flexDirection: "column" },

  iconBtn: {
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-sub)",
    padding: "0 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    minWidth: 44,
    justifyContent: "center",
    transition: "var(--t)",
    flexShrink: 0,
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

  verifiedBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: "var(--success-bg)",
    border: "1px solid var(--success-border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--success)",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 24,
  },
  invalidBox: {
    padding: "24px",
    background: "var(--danger-bg)",
    border: "1px solid var(--danger-border)",
    borderRadius: "var(--radius-md)",
  },
  invalidTitle: { fontSize: 15, fontWeight: 700, color: "var(--danger)", marginBottom: 8 },
  invalidText:  { fontSize: 14, color: "var(--danger)", opacity: 0.85, lineHeight: 1.6 },
};
