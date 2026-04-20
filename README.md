<p align="center">
  <img src="./certchain_logo.png" alt="CertChain Logo" width="120" />
</p>

<h1 align="center">CertChain — Blockchain Certificate Platform</h1>
<p align="center">A full-stack decentralized application built on <strong>Stellar Soroban</strong> that allows institutions to issue tamper-proof certificates on-chain and lets anyone verify them instantly.</p>

---

### 🚀 What's New? (Recent Updates)
- 🏢 **Enterprise UI Overhaul:** Complete redesign with a clean, professional SaaS-grade light theme, custom logo, and card-based layouts.
- 🎓 **Detailed Academic Records:** Smart contracts now support passing a designated `grade` to represent a student's performance.
- ✏️ **Smart Certificate Modifications:** The Soroban contract introduces an `update_cert` method allowing trusted issuers to fix typographical errors seamlessly.

<img width="1223" height="913" alt="image" src="https://github.com/user-attachments/assets/1482639c-2ec1-4eda-a242-2d128c05bdf6" />
<img width="1113" height="880" alt="image" src="https://github.com/user-attachments/assets/2ddc79cc-5d7e-4fb1-a7a0-24900be61699" />

### 🌐 Live Application
🌍 **[Access the Live CertChain App on Vercel](https://cert-chain-a8e7.vercel.app/)**

### 🎥 Live Video Demo
▶️ [Watch the full CertChain dApp Demo on Loom](https://www.loom.com/share/e91247c07fcb47348ba4b8ac09a8f8d1)

---




### 📈 Active Server Monitoring
![Monitoring Active](./monitoring-screenshot.png)


---

## 🔗 Smart Contract Info

| Field | Value |
|---|---|
| **Network** | Stellar Testnet |
| **Contract ID** | `CDCL4UCATOSIFBSI6DTT5GF66VVQVKYS6U7D5VJDKKFBHLFIDMHKGVWT` |
| **WASM File** | `contracts/target/wasm32-unknown-unknown/release/cert_contract.wasm` |
| **Soroban SDK** | `v25` |
| **Deployed On** | 2026-04-15 |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDCL4UCATOSIFBSI6DTT5GF66VVQVKYS6U7D5VJDKKFBHLFIDMHKGVWT) |

> ⚠️ **Testnet only** — Not for production use yet.

---

## 🏗️ Architecture

```
cert-chain/                  ← React Frontend (Vite)
├── src/
│   ├── components/          ← UI Components (IssueCert, VerifyCert, etc.)
│   ├── hooks/
│   │   ├── useStellar.js    ← Soroban contract interaction (issue/verify)
│   │   ├── useWallet.js     ← Freighter wallet integration
│   │   └── useToast.js      ← Toast notifications
│   └── utils/
│       └── constants.js     ← CONTRACT_ID, CERT_TYPES, mock data
│
cert-chain-backend/          ← Node.js Express Backend
├── index.js                 ← Email API via Brevo HTTP
├── cert_contract.rs         ← Rust contract source (reference copy)
└── .env                     ← BREVO_API_KEY
│
contracts/                   ← Soroban Rust Smart Contract
└── contracts/cert_contract/
    └── src/
        ├── lib.rs           ← Main contract logic
        └── test.rs          ← Contract unit tests
```

---

## 📜 Smart Contract Functions

### `issue_cert(env, issuer, cert_hash, student_wallet, course, grade, date)`
- Issues a certificate and stores it on-chain using `cert_hash` as the key
- Requires **issuer wallet auth** (Freighter)
- Stores performance `grade` and issues active status by default

### `verify_cert(env, cert_hash) → CertInfo`
- Looks up a certificate by its hash
- Returns `{ issuer, student_wallet, course, grade, date, status }` 
- No wallet required — public read

### `update_cert(env, caller, cert_hash, new_course, new_grade)`
- Modifies the course or grade of an active certificate
- Authorizes `caller` as the original issuer before executing

### `CertInfo` Struct
```rust
pub struct CertInfo {
    pub issuer: Address,
    pub student_wallet: Address,
    pub course: String,
    pub grade: String,
    pub issue_date: String,
    pub status: CertStatus,
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- Freighter browser extension (for issuing certs)
- Stellar account with Testnet XLM ([Friendbot](https://friendbot.stellar.org/))
- Rust + `stellar-cli` (for contract re-deployment only)

### Frontend Setup
```bash
cd cert-chain
npm install
npm start
# Runs at http://localhost:3000
```

### Backend Setup
```bash
cd cert-chain-backend
# Create .env file:
# BREVO_API_KEY=your_brevo_api_key_here
npm install
node index.js
# Runs at http://localhost:5000
```

---

## ✉️ Email Flow

When a certificate is issued:
1. Soroban contract stores the cert on-chain
2. Frontend calls `POST /send-email` on the backend
3. Backend sends a styled HTML email via **Brevo API** with:
   - Student name, course, issuer
   - **Certificate hash** (to verify later)

> **💡 Terminal Logs:** You can monitor the real-time email sending status directly in the backend terminal, which logs successful email deliveries and any errors.

---

## 🌟 Example: Successful Issuance

When a certificate is successfully issued and verified, you get a verifiable transaction hash and an automated email confirmation:

**1. Transaction Hash (On-Chain Record):**
```text
TX: KI8YBE7ZX56WNDZMZHNPIVECX4JLUMY9...
```

**2. Backend Email Log:**
```text
✅ Email sent to shindeakanksha069@gmail.com | ID: <202603261532.75669541366@smtp-relay.mailin.fr>
```

**3. Verified Certificate View:**
![Verified Certificate](./certificate.png)



---

## 🔄 Contract Rebuild & Redeploy

```bash
cd cert-chain/contracts

# Build
stellar contract build

# Deploy to testnet (needs 'alice' identity configured)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/cert_contract.wasm \
  --source alice \
  --network testnet
```
Update the new Contract ID in `src/utils/constants.js` → `CONTRACT_ID`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Rust + Soroban SDK v25 |
| Blockchain | Stellar Testnet |
| Wallet | Freighter Extension |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Email | Brevo HTTP API |
| Stellar RPC | `https://soroban-testnet.stellar.org` |

---

## 🧪 Running Contract Tests

```bash
cd cert-chain/contracts
cargo test
```

---

## 📁 Key Files

| File | Purpose |
|---|---|
| `src/utils/constants.js` | Contract ID & cert type constants |
| `src/hooks/useStellar.js` | Issue & verify cert via Soroban |
| `src/hooks/useWallet.js` | Freighter wallet connect/sign |
| `cert-chain-backend/index.js` | Email sending API |
| `cert-chain-backend/cert_contract.rs` | Rust contract source (reference) |
| `contracts/contracts/cert_contract/src/lib.rs` | Live Rust contract |

---

## 📝 Early Adopters & Verified Users

We actively collect user feedback and maintain logs of interactions to improve the CertChain dApp experience. We imported our first **31 verified users** directly from our initial feedback spreadsheet into the core database!
📊 **[View Feedback & User Data Spreadsheet](https://docs.google.com/spreadsheets/d/11lRZnMSYqBdyf9SdbClaOYM3DPJ1uuBs7XtXbTbc46k/edit?usp=sharing)**

### 🏆 Beta Testers Hall of Fame

Here are some of the early blockchain adopters currently seeded into the network from our spreadsheet:

| User Name | Simulated Wallet Snapshot | Status |
|---|---|---|
| **Shubham Golekar** | `GADY24FFOBCTVQJIBC...` | ✅ Indexed On-Chain |
| **Harshal Jagdale** | `GCATAASNFHODIKA4VT...` | ✅ Indexed On-Chain |
| **yuvraj vibhute** | `GDIKNWX7PRCJHYSB3L...` | ✅ Indexed On-Chain |
| **Soham Ghuge** | `GCZXHLXNKRQZ7FA3MV...` | ✅ Indexed On-Chain |
| **Rushikesh Gaiwal** | `GBXU3XKT5W66VJOTZB...` | ✅ Indexed On-Chain |
| **Yash annadate** | `GBWDGDXAN4AW22OBEQ...` | ✅ Indexed On-Chain |
| **Sarthak Dhere** | `GCRYPAQB3TFLQE727T...` | ✅ Indexed On-Chain |
| **Shritesh Patil** | `GAGBMRVUN2IBMXJUFN...` | ✅ Indexed On-Chain |
| **Vaibhavi Agale** | `GALWWEGHOMU5YODTZB...` | ✅ Indexed On-Chain |
| **om golekar** | `GDUFDJ23MIR2KR6FC3...` | ✅ Indexed On-Chain |
| **... and 21 more users!** | 🎉 Thank you! | 🎓 Verified |

---

## 👨‍💻 Author

Built as a Level 6 project — Shubham
