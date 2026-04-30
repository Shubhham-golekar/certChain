import React, { useState } from "react";

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="btn-icon" onClick={handle} style={{ height: 26, padding: "0 8px", fontSize: 11 }}>
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function RecordsTab({ certs }) {
  const [search, setSearch] = useState("");

  const filtered = certs.filter(c =>
    !search ||
    c.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    c.course?.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div className="section-title">Certificate Ledger</div>
          <div className="section-subtitle">
            {certs.length} credential{certs.length !== 1 ? "s" : ""} issued on this node
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", minWidth: 240 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, course, issuer..."
              style={{ paddingLeft: 34, fontSize: 13 }}
            />
          </div>
          <span className="badge badge-blue">{filtered.length} results</span>
        </div>
      </div>

      <div className="card">
        {certs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{
              width: 54, height: 54,
              borderRadius: "var(--r-lg)",
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)",
              margin: "0 auto 18px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main)", marginBottom: 6 }}>No certificates yet</div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Issue your first credential to see it here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)", fontSize: 13 }}>
            No results for "{search}"
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Credential Type</th>
                  <th>Issuer</th>
                  <th>Date</th>
                  <th>Tx Hash</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert, idx) => (
                  <tr key={cert.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12, fontVariantNumeric: "tabular-nums", width: 40 }}>
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: 13, marginBottom: 2 }}>
                        {cert.studentName}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {cert.studentWallet?.slice(0, 10)}…{cert.studentWallet?.slice(-6)}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-blue">{cert.course}</span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--text-sub)" }}>{cert.issuer}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{cert.date}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <code style={{
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-muted)",
                          background: "var(--bg-subtle)",
                          padding: "3px 7px",
                          borderRadius: "var(--r-xs)",
                          border: "1px solid var(--border)",
                        }}>
                          {cert.txHash}
                        </code>
                        <CopyButton text={cert.fullHash || cert.txHash} />
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <svg width="5" height="5" viewBox="0 0 10 10" fill="currentColor">
                          <circle cx="5" cy="5" r="5"/>
                        </svg>
                        On-Chain
                      </span>
                    </td>
                    <td>
                      {cert.fullHash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${cert.fullHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 11.5, color: "#8899ff",
                            textDecoration: "none", fontWeight: 500,
                          }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                        >
                          Explorer
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
