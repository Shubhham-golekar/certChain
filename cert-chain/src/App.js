import React, { useState, useEffect } from "react";
import { buildIssueCertOp, server } from "./hooks/useSoroban";
import { TransactionBuilder, Networks } from "@stellar/stellar-sdk";
import "./styles/global.css";

import Header from "./components/Header";
import WalletBar from "./components/WalletBar";
import StatsRow from "./components/StatsRow";
import IssueTab from "./components/IssueTab";
import VerifyTab from "./components/VerifyTab";
import RecordsTab from "./components/RecordsTab";
import DashboardTab from "./components/DashboardTab";
import ToastContainer from "./components/ToastContainer";

import { useWallet } from "./hooks/useWallet";
import { useToast } from "./hooks/useToast";
import { DEFAULT_FORM, generateTxHash } from "./utils/constants";

const TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "issue", label: "📤 Issue Certificate" },
  { id: "verify", label: "🔍 Verify" },
  { id: "records", label: "📋 Records" },
];

export default function App() {
  const { connected, address, publicKey, loading, error, connect, disconnect, sign } = useWallet();
  const { toasts, addToast } = useToast();

  const [tab, setTab] = useState("dashboard");
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isIssuing, setIsIssuing] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/certificates`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.certificates.map(c => ({
            id: "cert_" + c.id,
            studentName: c.to_name,
            course: c.course,
            issuer: c.issuer,
            date: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            txHash: c.hash ? (c.hash.slice(0, 8) + "..." + c.hash.slice(-6)) : "",
            studentWallet: c.student_wallet,
            fullHash: c.hash,
          }));
          setCerts(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch certificates from backend:", err);
      }
    };
    fetchCerts();
  }, []);


  const handleConnect = async () => {
    await connect();
    addToast("✅ Freighter wallet connected!");
  };

  const handleDisconnect = () => {
    disconnect();
    addToast("Wallet disconnected", "error");
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleIssue = async () => {
    if (!form.studentName || !form.studentWallet || !form.course || !form.issuer) {
      addToast("Please fill all required fields", "error");
      return;
    }
    setIsIssuing(true);

    try {
      addToast("Please confirm issuance in your wallet...");

      const fullHash = generateTxHash();

      try {
        addToast("Preparing Smart Contract Transaction...");
        const sourceAccount = await server.getAccount(publicKey);

        let tx = new TransactionBuilder(sourceAccount, {
          fee: "10000",
          networkPassphrase: Networks.TESTNET,
        })
          .addOperation(buildIssueCertOp(publicKey, fullHash, form.studentWallet, form.course, form.grade, form.date))
          .setTimeout(30)
          .build();

        let preparedTx = await server.prepareTransaction(tx);

        if (preparedTx.error) {
          throw new Error(preparedTx.error);
        }

        let xdrToSign;
        if (typeof preparedTx.toXDR === 'function') {
          xdrToSign = preparedTx.toXDR();
        } else if (typeof preparedTx.build === 'function') {
          xdrToSign = preparedTx.build().toXDR();
        } else if (preparedTx.transactionData) {
          tx.setSorobanData(preparedTx.transactionData);
          xdrToSign = tx.toXDR();
        } else {
          throw new Error("Failed to parse prepared transaction");
        }

        addToast("Please sign the contract invocation in your wallet...");
        const signedXdr = await sign(xdrToSign);

        addToast("Submitting to Stellar Blockchain...");

        // Convert the string XDR from Freighter into a Transaction object for the SDK
        const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
        const sendResponse = await server.sendTransaction(signedTx);

        if (sendResponse.status === "ERROR") {
          throw new Error("Blockchain submitted transaction failed");
        }

        addToast("✅ Certificate minted on Soroban!");
      } catch (err) {
        console.error("Smart Contract Error:", err);
        const msg = typeof err === 'string' ? err : (err.message || "Contract interaction failed");
        throw new Error(msg);
      }
      const newCert = {
        id: "cert_" + Date.now(),
        studentName: form.studentName,
        course: form.course,
        issuer: form.issuer,
        date: form.date,
        txHash: fullHash.slice(0, 8) + "..." + fullHash.slice(-6),
        studentWallet: form.studentWallet,
        grade: form.grade,
        fullHash,
      };

      // Index Certificate via Custom Node Backend
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/index-cert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to_name: form.studentName,
            student_wallet: form.studentWallet,
            course: form.course,
            issuer: form.issuer,
            grade: form.grade,
            hash: fullHash,
          }),
        });

        if (!response.ok) throw new Error("Backend index failed");
        console.log("✅ Certificate successfully indexed for:", form.studentWallet);
      } catch (err) {
        console.error("Failed to index cert. Ensure cert-chain-backend is running!", err);
        addToast("Warning: Certificate issued, but failed to index on backend.", "error");
      }

      setCerts((c) => [newCert, ...c]);
      setPreviewCert(newCert);
      addToast("🎓 Certificate Issued Successfully!");
      setForm(DEFAULT_FORM);
    } catch (err) {
      console.error("Issuance Error:", err);
      addToast(err.message || "Failed to issue certificate", "error");
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div style={styles.app}>
      {/* Premium Aurora Background */}
      <div className="aurora-bg" />

      <ToastContainer toasts={toasts} />

      <div style={styles.container}>
        <Header />
        <div style={styles.hero}>
          <div style={styles.heroTag}>Web3 Decentralized Credentials</div>
          <h1 style={styles.h1}>
            Issue <span style={styles.highlight}>Tamper-Proof</span><br />Certificates On-Chain
          </h1>
          <p style={styles.heroP}>
            Permanently and securely record academic or professional credentials on the Stellar blockchain network.
          </p>
        </div>

        <StatsRow totalCerts={certs.length} />
        <WalletBar
          connected={connected}
          address={address}
          loading={loading}
          error={error}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <div style={styles.tabsContainer}>
          <div style={styles.tabsInner}>
            {TABS.map((t) => (
              <button
                key={t.id}
                style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}
                onClick={() => { setTab(t.id); setPreviewCert(null); }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="animated-enter" key={tab}>
          {tab === "dashboard" && <DashboardTab />}
          {tab === "issue" && (
            <IssueTab
              walletConnected={connected}
              onIssue={handleIssue}
              isIssuing={isIssuing}
              previewCert={previewCert}
              form={form}
              onChange={handleFormChange}
            />
          )}
          {tab === "verify" && <VerifyTab certs={certs} />}
          {tab === "records" && <RecordsTab certs={certs} />}
        </div>

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

const styles = {
  app: { minHeight: "100vh", position: "relative", overflow: "hidden" },
  container: { maxWidth: 1000, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, animation: "slideInUp 0.8s ease-out" },
  hero: { textAlign: "center", marginBottom: 70, marginTop: 20 },
  heroTag: {
    display: "inline-block", background: "rgba(168, 85, 247, 0.15)",
    border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: 30,
    padding: "8px 20px", fontSize: 13, letterSpacing: 4, fontWeight: 800,
    textTransform: "uppercase", color: "var(--neon-purple)", marginBottom: 30,
    backdropFilter: "blur(6px)",
    boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)",
  },
  h1: { fontFamily: "var(--font-primary)", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 24, textShadow: "0 10px 30px rgba(0,0,0,0.5)" },
  highlight: {
    background: "linear-gradient(135deg, var(--neon-purple), var(--neon-pink), var(--neon-cyan))",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundSize: "200% 200%",
    animation: "aurora-shift 5s ease infinite alternate",
  },
  heroP: { color: "var(--text-muted)", fontSize: 18, maxWidth: 560, margin: "0 auto", lineHeight: 1.6, fontWeight: 400 },
  tabsContainer: { display: "flex", justifyContent: "center", marginBottom: 50 },
  tabsInner: {
    display: "inline-flex", gap: 10, background: "var(--surface)", backdropFilter: "var(--glass-blur)",
    border: "1px solid var(--surface-border)", borderRadius: 30, padding: 8,
    boxShadow: "var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.1)",
  },
  tab: {
    padding: "14px 28px", border: "none", borderRadius: 24,
    background: "transparent", color: "var(--text-muted)",
    fontFamily: "var(--font-primary)", fontWeight: 600, fontSize: 15, cursor: "pointer", letterSpacing: "0.5px",
    transition: "all var(--transition-bounce)",
  },
  tabActive: { background: "rgba(255,255,255,0.1)", color: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" },
};
