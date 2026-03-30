import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

// Testnet server
const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export function useStellar() {

  // ✅ CERTIFICATE ISSUE - Real Blockchain Transaction
  const issueCertificate = async (publicKey, certData) => {
    try {

      // STEP 1: Issuer account load karo Stellar network varun
      const account = await server.loadAccount(publicKey);

      // STEP 2: Certificate info prepare karo
      // Stellar memo max 28 chars astat
      // Pura data hash madhe store karnar aapan
      const certInfo = {
        n: certData.studentName.slice(0, 10),   // name short
        c: certData.course.slice(0, 8),          // course short
        d: certData.date,                         // date
      };
      const memoText = JSON.stringify(certInfo).slice(0, 28);

      // STEP 3: Transaction build karo
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          // Student wallet la minimum XLM pathav
          // He proof ahe ki certificate issue zali
          StellarSdk.Operation.payment({
            destination: certData.studentWallet,
            asset: StellarSdk.Asset.native(), // XLM
            amount: "0.0000001",              // minimum possible
          })
        )
        .addMemo(
          // Certificate info memo madhe
          StellarSdk.Memo.text(memoText)
        )
        .setTimeout(30) // 30 seconds timeout
        .build();

      // STEP 4: ✅ FREIGHTER POPUP YEIL - User approve/reject karil
      const signedXDR = await signTransaction(
        transaction.toXDR(),
        { networkPassphrase: NETWORK_PASSPHRASE }
      );

      // STEP 5: Signed transaction blockchain var submit karo
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        NETWORK_PASSPHRASE
      );
      const result = await server.submitTransaction(signedTx);

      // SUCCESS - TX hash milel
      return {
        success: true,
        txHash: result.hash,
        txUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
      };

    } catch (err) {

      // User ne reject kela
      if (err.message?.includes("User declined")) {
        return { success: false, error: "Tumhi transaction reject keli." };
      }

      // Student wallet la funds nahi
      if (err.response?.data?.extras?.result_codes?.operations?.includes("op_underfunded")) {
        return { success: false, error: "Wallet madhe XLM nahi! Faucet vapar." };
      }

      // Student account exist nahi testnet var
      if (err.message?.includes("destination")) {
        return { success: false, error: "Student wallet testnet var fund nahi." };
      }

      return { success: false, error: "Transaction failed: " + err.message };
    }
  };


  // ✅ CERTIFICATE VERIFY - TX hash ne check karo
  const verifyCertificate = async (txHash) => {
    try {

      // Horizon API ne transaction fetch karo
      const tx = await server.transactions().transaction(txHash).call();

      // Memo read karo
      const memo = tx.memo;
      if (!memo) {
        return { valid: false, error: "He certificate transaction nahi." };
      }

      // Parse karo cert info
      let certInfo = {};
      try {
        certInfo = JSON.parse(memo);
      } catch {
        certInfo = { raw: memo };
      }

      return {
        valid: true,
        txHash: tx.hash,
        date: tx.created_at.split("T")[0],
        sourceWallet: tx.source_account,
        memo: certInfo,
        txUrl: `https://stellar.expert/explorer/testnet/tx/${tx.hash}`,
      };

    } catch (err) {
      return { valid: false, error: "Transaction milali nahi. Hash check kara." };
    }
  };


  // ✅ ACCOUNT CHECK - Wallet la funds ahet ka
  const checkAccount = async (walletAddress) => {
    try {
      const account = await server.loadAccount(walletAddress);
      const xlmBalance = account.balances.find(
        (b) => b.asset_type === "native"
      );
      return {
        exists: true,
        balance: xlmBalance ? xlmBalance.balance : "0",
      };
    } catch {
      return { exists: false, balance: "0" };
    }
  };

  return { issueCertificate, verifyCertificate, checkAccount };
}