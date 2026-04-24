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
  { id: "dashboard", label: "Overview" },
  { id: "issue", label: "Hand Out Certificate" },
  { id: "verify", label: "Check Authenticity" },
  { id: "records", label: "Community Records" },
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
    addToast("Welcome! Freighter wallet connected smoothly. ✨");
  };

  const handleDisconnect = () => {
    disconnect();
    addToast("Wallet disconnected. See you around!", "error");
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleIssue = async () => {
    if (!form.studentName || !form.studentWallet || !form.course || !form.issuer) {
      addToast("Hmm, looks like some required fields are empty.", "error");
      return;
    }
    
    // Check wallet format loosely
    if (form.studentWallet.length < 50 || !form.studentWallet.startsWith("G")) {
      addToast("That doesn't look like a valid Stellar public key 🧐", "error");
      return;
    }

    setIsIssuing(true);

    try {
      addToast("Check your wallet to confirm the transaction...");

      const fullHash = generateTxHash();

      try {
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

        addToast("Waiting for your signature... ✍️");
        const signedXdr = await sign(xdrToSign);

        addToast("Sending it off to the Stellar network! 🚀");
        const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
        const sendResponse = await server.sendTransaction(signedTx);

        if (sendResponse.status === "ERROR") {
          throw new Error("Blockchain submitted transaction failed");
        }

        addToast("✨ Success! The certificate is forever on the blockchain.");
      } catch (err) {
        console.error("Smart Contract Error:", err);
        const msg = typeof err === 'string' ? err : (err.message || "Contract interaction ran into a hiccup.");
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
      } catch (err) {
        console.error("Failed to index cert.", err);
      }

      setCerts((c) => [newCert, ...c]);
      setPreviewCert(newCert);
      setForm(DEFAULT_FORM);
    } catch (err) {
      console.error("Issuance Error:", err);
      addToast(err.message || "Oh no, couldn't issue the certificate.", "error");
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <div style={styles.app}>
      <div className="page-grain" />

      <ToastContainer toasts={toasts} />

      <div style={styles.container}>
        <Header />
        
        <div style={styles.hero}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot}></span> Live on Soroban
          </div>
          <h1 style={styles.h1}>
            Give credit where it’s due.<br />
            <span style={styles.highlight}>Keep it forever.</span>
          </h1>
          <p style={styles.heroP}>
            A simple, warm way to hand out certificates for communities, schools, and self-starters. Decentralized, so nobody can ever take it away.
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

        <div style={styles.tabsWrapper}>
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
  app: { minHeight: "100vh", position: "relative" },
  container: { maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, animation: "fadeIn 0.7s ease-out" },
  hero: { textAlign: "center", marginBottom: 70, marginTop: 50, position: "relative", zIndex: 2 },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: 99, padding: "6px 14px", fontSize: 13,
    fontWeight: 600, color: "var(--accent-light)", marginBottom: 24,
    boxShadow: "0 0 16px rgba(99, 102, 241, 0.15)"
  },
  heroBadgeDot: {
    width: 6, height: 6, borderRadius: "50%", background: "var(--success)",
  },
  h1: { 
    fontFamily: "var(--font-sans)", fontSize: 52, fontWeight: 800, 
    lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 20, 
    color: "var(--text-main)" 
  },
  highlight: {
    color: "var(--text-main)",
  },
  heroP: { color: "var(--text-sub)", fontSize: 18, maxWidth: 540, margin: "0 auto", lineHeight: 1.5, fontWeight: 400 },
  tabsWrapper: { display: "flex", justifyContent: "center", marginBottom: 40 },
  tabsInner: {
    display: "inline-flex", gap: 4, background: "var(--bg-card)",
    backdropFilter: "blur(16px)",
    border: "1px solid var(--border)", borderRadius: 99, padding: 6,
    boxShadow: "var(--shadow-sm)",
  },
  tab: {
    padding: "8px 20px", border: "none", borderRadius: 99,
    background: "transparent", color: "var(--text-sub)",
    fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, cursor: "pointer",
    transition: "all var(--t)",
  },
  tabActive: { background: "var(--accent)", color: "#fff", boxShadow: "var(--shadow-sm)" },
};

