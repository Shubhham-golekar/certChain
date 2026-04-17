import React, { useState } from "react";
import { TransactionBuilder, Networks, scValToNative, Account } from "@stellar/stellar-sdk";
import { buildVerifyCertOp, server } from "../hooks/useSoroban";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../hooks/useToast";
import CertificatePreview from "./CertificatePreview";

export default function VerifyTab({ certs = [] }) {
  const { publicKey } = useWallet();
  const { addToast } = useToast();
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("📋 Hash copied to clipboard!");
  };

  const verify = async () => {
    const searchHash = hash.trim();
    if (!searchHash) {
      addToast("Please paste a certificate hash", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const localMatch = certs.find((c) => c.fullHash === searchHash);
      if (localMatch) {
        setResult({
          valid: true,
          studentName: localMatch.studentName || "Verified Holder",
          studentWallet: localMatch.studentWallet || "",
          course: localMatch.course || "",
          issuer: localMatch.issuer || "",
          date: localMatch.date || "",
          fullHash: searchHash,
          source: "local",
        });
        addToast("✅ Certificate verified from local records!");
        return;
      }

      addToast("Querying Soroban Smart Contract...");
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
        throw new Error("Certificate not found on blockchain. Make sure the hash is correct.");
      }

      const certData = scValToNative(simResponse.result.retval);

      setResult({
        valid: certData.valid !== undefined ? certData.valid : true,
        studentName: "Verified Blockchain Record",
        studentWallet: certData.student_wallet || certData[1] || "",
        course: certData.course || certData[2] || "",
        issuer: certData.issuer || certData[0] || "",
        date: certData.date || certData[3] || "",
        fullHash: searchHash,
        source: "blockchain",
      });

      addToast("✅ Verification complete from blockchain!");
    } catch (err) {
      console.error("Verify error:", err);
      setResult({ valid: false, fullHash: searchHash });
      addToast(err.message || "Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={styles.card}>
      <div style={styles.title}>🔍 Verify Certificate</div>
      <div style={styles.subtitle}>Enter a Stellar transaction hash to verify a certificate on-chain.</div>

      <div style={styles.field}>
        <label>Transaction Hash (TX ID)</label>
        <div style={{ display: "flex", gap: 14 }}>
          <input
            style={{ flex: 1 }}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Paste Stellar transaction hash..."
          />
          {hash && (
            <button style={styles.copyBtn} onClick={() => copyToClipboard(hash)}>
              📋
            </button>
          )}
        </div>
      </div>

      <div style={styles.submitRow}>
          <button
            className={loading ? "" : "btn-primary"}
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            onClick={verify}
            disabled={loading}
          >
            {loading ? "⏳ Verifying..." : "🔍 Verify Certificate"}
          </button>
      </div>

      {result && (
        <div style={{ marginTop: 32 }}>
          {result.valid ? (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <div style={styles.verifiedHeader}>
                ✅ Certificate Verified {result.source === "blockchain" ? "On-Chain" : "from Local Records"}!
              </div>
              <CertificatePreview cert={result} />
            </div>
          ) : (
            <div style={{ ...styles.result, ...styles.invalid }}>
              <div style={styles.icon}>❌</div>
              <div style={{ flex: 1 }}>
                <div style={styles.resultTitle}>Certificate Not Found</div>
                <div style={styles.detail}>No certificate matched this hash. Make sure you copied the full hash correctly. If it was just issued, ensure the blockchain transaction succeeded.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { padding: 40, marginBottom: 24, background: "var(--bg-card)" },
  title: { fontFamily: "var(--font-primary)", fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.6 },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 },
  submitRow: { display: "flex", justifyContent: "flex-end" },
  copyBtn: {
    background: "var(--bg-main)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-main)",
    padding: "0 16px",
    cursor: "pointer",
    fontSize: 20
  },
  btn: { padding: "12px 28px", borderRadius: 8, border: "none", fontFamily: "var(--font-primary)", fontSize: 14, cursor: "pointer", fontWeight: 600 },
  btnDisabled: { background: "var(--bg-main)", color: "var(--text-light)", border: "1px solid var(--border)", cursor: "not-allowed" },
  result: { borderRadius: 12, padding: "24px", marginTop: 24, display: "flex", alignItems: "flex-start", gap: 20 },
  invalid: { background: "#fef2f2", border: "1px solid #fecaca", boxShadow: "var(--shadow-sm)" },
  icon: { fontSize: 32, flexShrink: 0 },
  resultTitle: { fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: 18, color: "var(--danger)", marginBottom: 8 },
  detail: { fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 },
  verifiedHeader: { textAlign: "center", marginBottom: 12, color: "var(--success)", fontSize: 16, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }
};
