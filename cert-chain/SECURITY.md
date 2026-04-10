# CertChain Security Checklist

This document verifies the security configurations and considerations completed before the production release of CertChain.

## 1. Smart Contract Security
- [x] **Access Control**: Strict `require_auth()` checks implemented using Freighter wallet signatures on issuance and revocation.
- [x] **Duplicate Prevention**: Contract explicitly checks for `cert_hash` collisions and reverts if a hash is already issued.
- [x] **Immutable Storage**: Persistent storage correctly configured using `env.storage().persistent()`.
- [x] **Authorization Checking**: `is_issuer` mapping validation completed. Unregistered addresses are blocked from issuing.

## 2. Web Application Security (Frontend)
- [x] **Wallet Signing**: All mutations (`issue_cert`, `revoke_cert`) require cryptographic signing via the Freighter wallet.
- [x] **No Private Keys Stored**: The application never touches or holds private keys; it relies completely on the wallet extension.
- [x] **Data Validation**: Inputs (like `student_wallet` instead of `email`) ensure valid strings are passed to the smart contract XDR parser.

## 3. Backend & API Security
- [x] **Rate Limiting**: `express-rate-limit` prevents spam on the backend API endpoints (e.g., maximum 100 requests per 15 minutes).
- [x] **Content Security / HTTP Headers**: `helmet()` middleware is implemented to protect against well-known web vulnerabilities.
- [x] **CORS Rules configured**: Restricts cross-origin resource sharing to expected defaults.
- [x] **Data Exposure Mitigation**: Replaced personal identifying info (Email) with pseudonymous identifiers (Stellar Wallet Address).

## 4. Monitoring & Uptime
- [x] **Status Monitoring**: Active via `express-status-monitor` hooked at the `/status` route for backend observability.
- [x] **Indexing Resilience**: SQLite backend natively recovers state in case of connection drop, handling logs smoothly.

*(Completed on: 2026-04-10)*
