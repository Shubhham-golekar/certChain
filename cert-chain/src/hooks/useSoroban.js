import { Contract, nativeToScVal, rpc } from "@stellar/stellar-sdk";
import { CONTRACT_ID } from "../utils/constants";

// Soroban Testnet RPC Server
export const server = new rpc.Server("https://soroban-testnet.stellar.org");

export const getContract = () => new Contract(CONTRACT_ID);

export const buildIssueCertOp = (issuerPubKey, certHash, studentWallet, courseName, grade, issueDate) => {
    const contract = getContract();
    return contract.call(
        "issue_cert",
        nativeToScVal(issuerPubKey, { type: "address" }),
        nativeToScVal(certHash, { type: "string" }),
        nativeToScVal(studentWallet, { type: "address" }),
        nativeToScVal(courseName, { type: "string" }),
        nativeToScVal(grade, { type: "string" }),
        nativeToScVal(issueDate, { type: "string" })
    );
};

export const buildVerifyCertOp = (certHash) => {
    const contract = getContract();
    return contract.call(
        "verify_cert",
        nativeToScVal(certHash, { type: "string" })
    );
};

export const buildUpdateCertOp = (callerPubKey, certHash, newCourseName, newGrade) => {
    const contract = getContract();
    return contract.call(
        "update_cert",
        nativeToScVal(callerPubKey, { type: "address" }),
        nativeToScVal(certHash, { type: "string" }),
        nativeToScVal(newCourseName, { type: "string" }),
        nativeToScVal(newGrade, { type: "string" })
    );
};
