import React, { useState, useEffect } from "react";
import { buildIssueCertOp, server } from "./hooks/useSoroban";
import { TransactionBuilder, Networks } from "@stellar/stellar-sdk";
import "./styles/global.css";

import Header from "./components/Header";
import WalletBar from "./components/WalletBar";
import IssueTab from "./components/IssueTab";
import VerifyTab from "./components/VerifyTab";
import RecordsTab from "./components/RecordsTab";
import DashboardTab from "./components/DashboardTab";
import ToastContainer from "./components/ToastContainer";

import { useWallet } from "./hooks/useWallet";
import { useToast } from "./hooks/useToast";
import { DEFAULT_FORM, generateTxHash } from "./utils/constants";

const TABS = [
  {
    id: "dashboard",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: "issue",
    label: "Issue Certificate",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
  },
  {
    id: "verify",
    label: "Verify",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    id: "records",
    label: "Records",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

const TAB_META = {
  dashboard: { title: "Overview", subtitle: "Certificate metrics and network status" },
  issue:     { title: "Issue Certificate", subtitle: "Create and record a new credential on the Stellar blockchain" },
  verify:    { title: "Verify Certificate", subtitle: "Authenticate a credential by its blockchain hash" },
  records:   { title: "Certificate Records", subtitle: "Public ledger of all issued credentials" },
};

export default function App() {
  const { connected, address, publicKey, loading, error, connect, disconnect, sign } = useWallet();
  const { toasts, addToast } = useToast();

  const [tab, setTab]             = useState("dashboard");
  const [certs, setCerts]         = useState([]);
  const [form, setForm]           = useState(DEFAULT_FORM);
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
    addToast("Freighter wallet connected.");
  };

  const handleDisconnect = () => {
    disconnect();
    addToast("Wallet disconnected.", "error");
  };

  const handleFormChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleIssue = async () => {
    if (!form.studentName || !form.studentWallet || !form.course || !form.issuer) {
      addToast("Please fill in all required fields.", "error");
      return;
    }
    if (form.studentWallet.length < 50 || !form.studentWallet.startsWith("G")) {
      addToast("Invalid Stellar public key.", "error");
      return;
    }

    setIsIssuing(true);

    try {
      addToast("Awaiting wallet confirmation...");
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
        if (preparedTx.error) throw new Error(preparedTx.error);

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

        addToast("Signing transaction...");
        const signedXdr = await sign(xdrToSign);

        addToast("Broadcasting to Stellar network...");
        const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
        const sendResponse = await server.sendTransaction(signedTx);

        if (sendResponse.status === "ERROR") throw new Error("Transaction failed on blockchain");
        addToast("Certificate issued successfully.");
      } catch (err) {
        console.error("Smart Contract Error:", err);
        throw new Error(typeof err === 'string' ? err : (err.message || "Contract interaction failed."));
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

      setCerts(c => [newCert, ...c]);
      setPreviewCert(newCert);
      setForm(DEFAULT_FORM);
    } catch (err) {
      console.error("Issuance Error:", err);
      addToast(err.message || "Failed to issue certificate.", "error");
    } finally {
      setIsIssuing(false);
    }
  };

  const meta = TAB_META[tab];

  return (
    <div className="app-shell">
      <ToastContainer toasts={toasts} />

      {/* ── Sidebar ── */}
      <Header
        tab={tab}
        setTab={(t) => { setTab(t); setPreviewCert(null); }}
        tabs={TABS}
        connected={connected}
      />

      {/* ── Main ── */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <WalletBar
            connected={connected}
            address={address}
            loading={loading}
            error={error}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>

        {/* Page body */}
        <div className="page-content animated-enter" key={tab}>
          {tab === "dashboard" && <DashboardTab totalCerts={certs.length} />}
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
          {tab === "verify"  && <VerifyTab certs={certs} />}
          {tab === "records" && <RecordsTab certs={certs} />}
        </div>
      </div>
    </div>
  );
}
