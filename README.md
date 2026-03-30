# 🎓 CertChain — Unified Full-Stack Repository

This is the unified repository for **CertChain**, a decentralized application for issuing and verifying certificates on the Stellar blockchain (Soroban).

## 📁 Repository Structure

-   **[cert-chain/](file:///c:/Users/SHUBHAM/OneDrive/Desktop/level%205/cert-chain/)**: React frontend (built with Vite).
-   **[cert-chain-backend/](file:///c:/Users/SHUBHAM/OneDrive/Desktop/level%205/cert-chain-backend/)**: Node.js Express backend for email notifications.
-   **[cert-chain/contracts/](file:///c:/Users/SHUBHAM/OneDrive/Desktop/level%205/cert-chain/contracts/)**: Soroban Rust smart contracts.

## 🚀 Getting Started

### 1. Frontend
```bash
cd cert-chain
npm install
npm run dev
```

### 2. Backend
```bash
cd cert-chain-backend
# Set your BREVO_API_KEY in .env
npm install
node index.js
```

### 3. Smart Contracts
```bash
cd cert-chain/contracts
cargo test
```

## 🛠️ CI/CD Workflow
This repository is equipped with a GitHub Actions workflow that automatically validates all components on every push:
- **Frontend**: Tests and Build verification.
- **Backend**: Dependency check.
- **Contracts**: Build and Unit tests.

You can view the status in the **Actions** tab of your GitHub repository.

## 🔗 Project Resources
- 🌍 **[Live App on Vercel](https://cert-chain-c2x1.vercel.app/)**
- ▶️ **[Video Demo on Loom](https://www.loom.com/share/e91247c07fcb47348ba4b8ac09a8f8d1)**
- 📊 **[Feedback Spreadsheet](https://docs.google.com/spreadsheets/d/1Y0ffMgeOnohf2w6RSOmydhu7mUuuAlPFOkO9Ya2yLuM/edit?usp=sharing)**

---
Built by **Shubham** (Level 5 Project).
