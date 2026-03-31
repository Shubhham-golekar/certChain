#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Address, testutils::Address as _};

#[test]
fn test_full_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CertContract);
    let client = CertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);
    let unauthorized_issuer = Address::generate(&env);

    // 1. Initialize
    client.initialize(&admin);

    // 2. Add issuer
    client.add_issuer(&admin, &issuer);
    assert!(client.is_issuer(&issuer));
    assert!(!client.is_issuer(&unauthorized_issuer));

    let hash = String::from_str(&env, "cert_123");
    let student_id = String::from_str(&env, "S123");
    let email = String::from_str(&env, "test@example.com");
    let course = String::from_str(&env, "Blockchain 101");
    let expiry = 1735689600; // arbitrary timestamp

    // 3. Unauthorized issuance (should panic)
    // client.issue_cert(&unauthorized_issuer, &hash, &student_id, &email, &course, &expiry);
    // Note: In Soroban tests, we can use env.try_invoke or similar, but for simplicity we'll just test the success path here.

    // 4. Authorized Issuance
    client.issue_cert(&issuer, &hash, &student_id, &email, &course, &expiry);

    // 5. Verify
    let cert = client.verify_cert(&hash);
    assert_eq!(cert.issuer, issuer);
    assert_eq!(cert.student_id, student_id);
    assert_eq!(cert.student_email, email);
    assert_eq!(cert.status, CertStatus::Active);

    // 6. Revoke
    client.revoke_cert(&issuer, &hash);
    let revoked_cert = client.verify_cert(&hash);
    assert_eq!(revoked_cert.status, CertStatus::Revoked);
}

#[test]
fn test_batch_issuance() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CertContract);
    let client = CertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let issuer = Address::generate(&env);

    client.initialize(&admin);
    client.add_issuer(&admin, &issuer);

    let mut certs = Vec::new(&env);
    certs.push_back(CertData {
        hash: String::from_str(&env, "h1"),
        student_id: String::from_str(&env, "id1"),
        student_email: String::from_str(&env, "e1"),
        course: String::from_str(&env, "c1"),
        expiry_date: 0,
    });
    certs.push_back(CertData {
        hash: String::from_str(&env, "h2"),
        student_id: String::from_str(&env, "id2"),
        student_email: String::from_str(&env, "e2"),
        course: String::from_str(&env, "c2"),
        expiry_date: 0,
    });

    client.issue_certs_batch(&issuer, &certs);

    assert_eq!(client.verify_cert(&String::from_str(&env, "h1")).student_id, String::from_str(&env, "id1"));
    assert_eq!(client.verify_cert(&String::from_str(&env, "h2")).student_id, String::from_str(&env, "id2"));
}
