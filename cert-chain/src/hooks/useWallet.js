import { useState } from "react";
import {
  getAddress,
  isConnected,
  signTransaction,
  setAllowed
} from "@stellar/freighter-api";

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const connectionStatus = await isConnected();
      if (!connectionStatus.isConnected) {
        throw new Error("Freighter wallet not found. Please install the extension.");
      }

      // v6 requires setAllowed to trigger the "Share Address" popup if not already allowed
      await setAllowed();

      const response = await getAddress();
      if (response.error) {
        throw new Error(response.error);
      }

      const pubKey = response.address;
      setPublicKey(pubKey);
      setAddress(pubKey.slice(0, 6) + "..." + pubKey.slice(-4));
      setConnected(true);
    } catch (err) {
      setError(err.message);
      console.error("Wallet connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setAddress("");
    setPublicKey("");
  };

  const sign = async (xdr) => {
    try {
      const result = await signTransaction(xdr, {
        networkPassphrase: "Test SDF Network ; September 2015"
      });
      if (result.error) {
        const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        throw new Error(errorMsg);
      }
      return result.signedTxXdr;
    } catch (err) {
      console.error("Signing error:", err);
      throw err;
    }
  };

  return { connected, address, publicKey, loading, error, connect, disconnect, sign };
}