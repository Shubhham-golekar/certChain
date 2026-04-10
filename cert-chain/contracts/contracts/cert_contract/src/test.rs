#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Address, testutils::Address as _};

#[test]
fn test_issue_verify_revoke() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CertContract);
    let client = CertContractClient::new(&env, &contract_id);

    let issuer = Address::generate(&env);
    let hash = String::from_str(&env, "cert_hash_123");
    let student_wallet = Address::generate(&env);
    let course = String::from_str(&env, "Soroban 101");
    let issue_date = String::from_str(&env, "2026-04-10");

    client.issue_cert(&issuer, &hash, &student_wallet, &course, &issue_date);

    let cert = client.verify_cert(&hash);
    assert_eq!(cert.issuer, issuer);
    assert_eq!(cert.student_wallet, student_wallet);
    assert_eq!(cert.course, course);
    assert_eq!(cert.issue_date, issue_date);
    assert_eq!(cert.status, CertStatus::Active);

    client.revoke_cert(&issuer, &hash);
    let revoked_cert = client.verify_cert(&hash);
    assert_eq!(revoked_cert.status, CertStatus::Revoked);
}
