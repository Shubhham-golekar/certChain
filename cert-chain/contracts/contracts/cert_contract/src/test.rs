#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Address, testutils::Address as _};

#[test]
fn test_issue_and_verify() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CertContract);
    let client = CertContractClient::new(&env, &contract_id);

    let issuer = Address::generate(&env);
    let hash = String::from_str(&env, "mock_hash_123");
    let email = String::from_str(&env, "test@example.com");
    let course = String::from_str(&env, "Blockchain 101");
    let date = String::from_str(&env, "2024-03-25");

    // Issue certificate
    client.issue_cert(&issuer, &hash, &email, &course, &date);

    // Verify certificate
    let cert = client.verify_cert(&hash);
    assert_eq!(cert.issuer, issuer);
    assert_eq!(cert.student_email, email);
    assert_eq!(cert.course, course);
    assert_eq!(cert.valid, true);
}
