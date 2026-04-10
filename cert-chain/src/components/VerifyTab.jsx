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
      // Step 1: Check locally issued certs first (instant, no wallet needed)
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

      // Step 2: Try blockchain simulation (no wallet signing needed)
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
    <div style={styles.card}>
      <div style={styles.title}>🔍 Verify Certificate</div>
      <div style={styles.subtitle}>Enter a Stellar transaction hash to verify a certificate on-chain.</div>

      <div style={styles.field}>
        <label>Transaction Hash (TX ID)</label>
        <div style={{ display: "flex", gap: 10 }}>
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

      <button
        style={{ ...styles.btn, ...(loading ? styles.btnDisabled : styles.btnSuccess) }}
        onClick={verify}
        disabled={loading}
      >
        {loading ? "⏳ Verifying..." : "🔍 Verify Certificate"}
      </button>

      {result && (
        <div style={{ marginTop: 24 }}>
          {result.valid ? (
            <div style={{ animation: "fadeIn 0.5s ease-out" }}>
              <div style={{ textAlign: "center", marginBottom: 8, color: "var(--accent)", fontSize: 18, fontWeight: 'bold' }}>
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
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, marginBottom: 24 },
  title: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 },
  subtitle: { color: "var(--muted)", fontSize: 12, marginBottom: 28, lineHeight: 1.6 },
  field: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  copyBtn: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    padding: "0 12px",
    cursor: "pointer",
  },
  btn: { padding: "14px 32px", borderRadius: 8, border: "none", fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: "pointer" },
  btnSuccess: { background: "rgba(0,212,170,0.15)", color: "var(--accent2)", border: "1px solid rgba(0,212,170,0.25)" },
  btnDisabled: { background: "var(--border)", color: "var(--muted)", cursor: "not-allowed" },
  result: { borderRadius: 12, padding: "20px 24px", marginTop: 20, display: "flex", alignItems: "flex-start", gap: 16 },
  valid: { background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)" },
  invalid: { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" },
  icon: { fontSize: 28, flexShrink: 0 },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  resultTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 },
  copyLink: {
    background: "none", border: "none", color: "var(--accent)", fontSize: 11,
    textDecoration: "underline", cursor: "pointer", padding: 0,
  },
  detail: { fontSize: 12, color: "var(--muted)", lineHeight: 1.8 },
};
