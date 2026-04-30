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
    if (!searchHash) { addToast("Please enter a certificate hash.", "error"); return; }
    setLoading(true); setResult(null);
    try {
      const localMatch = certs.find(c => c.fullHash === searchHash);
      if (localMatch) {
        setResult({ valid: true, studentName: localMatch.studentName || "Verified Holder", studentWallet: localMatch.studentWallet || "", course: localMatch.course || "", issuer: localMatch.issuer || "", date: localMatch.date || "", fullHash: searchHash, source: "local" });
        addToast("Certificate found in records."); return;
      }
      addToast("Querying the blockchain...");
      const callerKey = publicKey || "GAX5NPUQJ7R6ZJ3WPKVIVZ2UQLNTSWNTZ2XOYEFT5B6NYYF7BOM6CQ4W";
      const dummyAccount = new Account(callerKey, "0");
      const tx = new TransactionBuilder(dummyAccount, { fee: "100", networkPassphrase: Networks.TESTNET })
        .addOperation(buildVerifyCertOp(searchHash)).setTimeout(30).build();
      const simResponse = await server.simulateTransaction(tx);
      if (!simResponse.result || !simResponse.result.retval) throw new Error("Certificate not found. Verify the hash is correct.");
      const certData = scValToNative(simResponse.result.retval);
      setResult({ valid: certData.valid !== undefined ? certData.valid : true, studentName: "Verified Blockchain Record", studentWallet: certData.student_wallet || certData[1] || "", course: certData.course || certData[2] || "", issuer: certData.issuer || certData[0] || "", date: certData.date || certData[3] || "", fullHash: searchHash, source: "blockchain" });
      addToast("Verified on-chain.");
    } catch (err) {
      setResult({ valid: false, fullHash: searchHash });
      addToast(err.message || "Verification failed.", "error");
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !loading) verify(); };

  return (
    <div style={{ maxWidth: 740 }}>
      {/* Search card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div className="card-title">Certificate Verification</div>
              <div className="card-subtitle">
                Authenticate any credential by its blockchain hash — no account required.
              </div>
            </div>
            <span className="badge badge-teal">Permissionless</span>
          </div>
        </div>
        <div className="card-body">
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Certificate Hash</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="input-wrap" style={{ flex: 1 }}>
                <span className="input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </span>
                <input
                  value={hash}
                  onChange={e => setHash(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Paste the full 64-character certificate hash here..."
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}
                />
              </div>
              {hash && (
                <button className="btn-icon" onClick={() => copyToClipboard(hash)} title="Copy hash">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              )}
            </div>
            <span className="form-hint">The hash is generated at issuance time and uniquely identifies each certificate on-chain</span>
          </div>

          <button className={loading ? "btn-secondary" : "btn-primary"} onClick={verify} disabled={loading}>
            {loading ? (
              <>
                <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "var(--text-body)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
                Verifying...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                Verify Certificate
              </>
            )}
          </button>
        </div>
      </div>

      {/* How-to cards (when no result) */}
      {!result && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[
            { n: "01", title: "Paste Hash", body: "Enter the full 64-character certificate hash that was generated at issuance time." },
            { n: "02", title: "Query Chain", body: "The system checks the local index first, then queries the Stellar smart contract directly." },
            { n: "03", title: "View Result", body: "Certificate details are returned with on-chain proof, including a preview and QR code." },
          ].map(s => (
            <div key={s.n} style={{
              padding: "18px 18px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              transition: "border-color var(--t)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", letterSpacing: "0.5px", marginBottom: 10, fontVariantNumeric: "tabular-nums" }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ animation: "fade-up 0.22s ease-out" }}>
          {result.valid ? (
            <div>
              <div className="alert alert-success" style={{ marginBottom: 20 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>
                  <strong>Certificate Verified</strong>
                  {result.source === "blockchain" ? " — Confirmed on Stellar Testnet" : " — Found in certificate index"}
                </span>
              </div>
              <CertificatePreview cert={result} />
            </div>
          ) : (
            <div style={{
              padding: "28px 26px",
              background: "var(--danger-bg)",
              border: "1px solid var(--danger-border)",
              borderRadius: "var(--r-lg)",
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
            }}>
              <div style={{ width: 42, height: 42, borderRadius: "var(--r-md)", background: "rgba(248,113,113,0.10)", border: "1px solid var(--danger-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 6 }}>Certificate Not Found</div>
                <p style={{ fontSize: 13, color: "var(--danger)", opacity: 0.8, lineHeight: 1.65 }}>
                  No certificate matching this hash was found on-chain or in the index. Ensure you copied the complete hash without extra whitespace.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
