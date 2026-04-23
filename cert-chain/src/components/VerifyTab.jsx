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
    addToast("📋 Copied to clipboard!");
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
        addToast("Found it in the community records! 🎉");
        return;
      }

      addToast("Checking the blockchain...");
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
        throw new Error("We couldn't find this certificate. Double check the hash.");
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

      addToast("Verified directly from the blockchain! 🔒");
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
      <div style={styles.header}>
        <div style={styles.title}>Check Authenticity 🔍</div>
        <div style={styles.subtitle}>Curious if a certificate is real? Paste the transaction hash below and we'll check the blockchain for you.</div>
      </div>

      <div style={styles.field}>
        <label>Transaction Hash</label>
        <div style={{ display: "flex", gap: 14 }}>
          <input
            style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 13 }}
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Paste exactly as it appears..."
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
            {loading ? "Checking..." : "Verify Authentic Record"}
          </button>
      </div>

      {result && (
        <div style={{ marginTop: 40 }}>
          {result.valid ? (
            <div style={{ animation: "fadeUp 0.4s ease-out" }}>
              <div style={styles.verifiedHeader}>
                ✨ Verified Authentic {result.source === "blockchain" ? "(On-Chain)" : "(From Index)"}
              </div>
              <CertificatePreview cert={result} />
            </div>
          ) : (
            <div style={{ ...styles.result, ...styles.invalid }}>
              <div style={styles.icon}>🤔</div>
              <div style={{ flex: 1 }}>
                <div style={styles.resultTitle}>Nothing found</div>
                <div style={styles.detail}>We looked around but couldn't find any certificate matching this hash. Make sure you copied the entire hash correctly.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { padding: "clamp(24px, 5vw, 48px)", marginBottom: 24 },
  header: { marginBottom: "clamp(20px, 5vw, 32px)" },
  title: { fontSize: "clamp(20px, 6vw, 24px)", fontWeight: 700, marginBottom: 8, color: "var(--text-main)", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-sub)", fontSize: "clamp(13px, 4vw, 15px)", lineHeight: 1.5, maxWidth: "100%" },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 },
  submitRow: { display: "flex", justifyContent: "flex-start", marginTop: 10, flexWrap: "wrap", gap: 10 },
  copyBtn: {
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-main)",
    padding: "0 16px",
    cursor: "pointer",
    fontSize: "clamp(18px, 4vw, 20px)",
    transition: "var(--t)",
    minHeight: 42,
  },
  btn: { padding: "12px 28px", borderRadius: "100px", border: "none", fontSize: 14, cursor: "pointer", fontWeight: 600, minHeight: 44 },
  btnDisabled: { background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "not-allowed" },
  result: { borderRadius: 16, padding: "clamp(16px, 3vw, 24px)", marginTop: 32, display: "flex", alignItems: "flex-start", gap: "clamp(12px, 3vw, 20px)", flexWrap: "wrap", transition: "all 0.24s cubic-bezier(0.4, 0, 0.2, 1)" },
  invalid: { background: "var(--danger-bg)", border: "1px solid var(--danger-border)" },
  icon: { fontSize: "clamp(28px, 6vw, 36px)", flexShrink: 0 },
  resultTitle: { fontWeight: 700, fontSize: "clamp(16px, 4vw, 18px)", color: "var(--danger)", marginBottom: 8 },
  detail: { fontSize: "clamp(13px, 3vw, 14px)", color: "var(--danger)", opacity: 0.8, lineHeight: 1.6 },
  verifiedHeader: { textAlign: "center", marginBottom: 16, color: "var(--success)", fontSize: "clamp(13px, 3vw, 15px)", fontWeight: 700 }
};
