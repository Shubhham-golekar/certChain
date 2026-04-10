#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CertInfo {
    pub issuer: Address,
    pub student_wallet: Address,
    pub course: String,
    pub date: String,
    pub valid: bool,
}

#[contract]
pub struct CertContract;

#[contractimpl]
impl CertContract {
    pub fn issue_cert(
        env: Env,
        issuer: Address,
        cert_hash: String,
        student_wallet: Address,
        course: String,
        date: String,
    ) {
        issuer.require_auth();

        if env.storage().instance().has(&cert_hash) {
            panic!("Certificate with this hash already exists");
        }

        let cert = CertInfo {
            issuer: issuer.clone(),
            student_wallet: student_wallet.clone(),
            course: course.clone(),
            date: date.clone(),
            valid: true,
        };

        env.storage().instance().set(&cert_hash, &cert);
    }

    pub fn verify_cert(env: Env, cert_hash: String) -> CertInfo {
        if !env.storage().instance().has(&cert_hash) {
            panic!("Certificate not found");
        }
        env.storage().instance().get(&cert_hash).unwrap()
    }
}
