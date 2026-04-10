#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CertStatus {
    Active,
    Revoked,
    Expired,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CertInfo {
    pub issuer: Address,
    pub student_wallet: Address,
    pub course: String,
    pub issue_date: String,
    pub status: CertStatus,
}

#[contracttype]
pub enum DataKey {
    Cert(String),
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
        issue_date: String,
    ) {
        issuer.require_auth();

        if env.storage().persistent().has(&DataKey::Cert(cert_hash.clone())) {
            panic!("Certificate already exists");
        }

        let cert = CertInfo {
            issuer: issuer.clone(),
            student_wallet,
            course,
            issue_date,
            status: CertStatus::Active,
        };

        env.storage().persistent().set(&DataKey::Cert(cert_hash.clone()), &cert);
        env.events().publish(("cert_issued", issuer.clone()), cert_hash);
    }

    pub fn verify_cert(env: Env, cert_hash: String) -> CertInfo {
        env.storage().persistent()
            .get(&DataKey::Cert(cert_hash))
            .unwrap_or_else(|| panic!("Certificate not found"))
    }

    pub fn revoke_cert(env: Env, caller: Address, cert_hash: String) {
        caller.require_auth();

        let mut cert: CertInfo = env.storage().persistent()
            .get(&DataKey::Cert(cert_hash.clone()))
            .unwrap_or_else(|| panic!("Certificate not found"));

        if caller != cert.issuer {
            panic!("Unauthorized to revoke this certificate");
        }

        cert.status = CertStatus::Revoked;
        env.storage().persistent().set(&DataKey::Cert(cert_hash.clone()), &cert);
        env.events().publish(("cert_revoked", caller), cert_hash);
    }
}

#[cfg(test)]
mod test;
