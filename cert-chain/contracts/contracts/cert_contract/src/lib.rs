#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, String, Address, Vec};

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
    pub student_id: String,
    pub student_wallet: Address,
    pub course: String,
    pub issue_date: u64,
    pub expiry_date: u64,
    pub status: CertStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CertData {
    pub hash: String,
    pub student_id: String,
    pub student_wallet: Address,
    pub course: String,
    pub expiry_date: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Issuer(Address),
    Cert(String),
}

#[contract]
pub struct CertContract;

#[contractimpl]
impl CertContract {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Add an authorized issuer. Only callable by admin.
    pub fn add_issuer(env: Env, admin: Address, issuer: Address) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic!("Only admin can add issuers");
        }
        env.storage().instance().set(&DataKey::Issuer(issuer.clone()), &true);
        env.events().publish(("issuer_added",), issuer);
    }

    /// Issue a new certificate. Only callable by an authorized issuer.
    pub fn issue_cert(
        env: Env,
        issuer: Address,
        cert_hash: String,
        student_id: String,
        student_wallet: Address,
        course: String,
        expiry_date: u64,
    ) {
        issuer.require_auth();

        // Check if issuer is authorized
        if !env.storage().instance().has(&DataKey::Issuer(issuer.clone())) {
            panic!("Unauthorized issuer");
        }

        // Check if certificate already exists
        if env.storage().persistent().has(&DataKey::Cert(cert_hash.clone())) {
            panic!("Certificate already exists");
        }

        let cert = CertInfo {
            issuer: issuer.clone(),
            student_id,
            student_wallet,
            course,
            issue_date: env.ledger().timestamp(),
            expiry_date,
            status: CertStatus::Active,
        };

        env.storage().persistent().set(&DataKey::Cert(cert_hash.clone()), &cert);
        env.events().publish(("cert_issued", issuer.clone()), cert_hash);
    }

    /// Verify a certificate hash.
    pub fn verify_cert(env: Env, cert_hash: String) -> CertInfo {
        env.storage().persistent()
            .get(&DataKey::Cert(cert_hash))
            .unwrap_or_else(|| panic!("Certificate not found"))
    }

    /// Revoke a certificate. Only callable by the original issuer or admin.
    pub fn revoke_cert(env: Env, caller: Address, cert_hash: String) {
        caller.require_auth();

        let mut cert: CertInfo = env.storage().persistent()
            .get(&DataKey::Cert(cert_hash.clone()))
            .unwrap_or_else(|| panic!("Certificate not found"));

        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();

        if caller != cert.issuer && caller != admin {
            panic!("Unauthorized to revoke this certificate");
        }

        cert.status = CertStatus::Revoked;
        env.storage().persistent().set(&DataKey::Cert(cert_hash.clone()), &cert);
        env.events().publish(("cert_revoked", caller), cert_hash);
    }

    /// Check if an address is an authorized issuer.
    pub fn is_issuer(env: Env, issuer: Address) -> bool {
        env.storage().instance().has(&DataKey::Issuer(issuer))
    }

    /// Get the contract admin.
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Admin).unwrap()
    }

    /// Issue multiple certificates in one call.
    pub fn issue_certs_batch(
        env: Env,
        issuer: Address,
        certs: Vec<CertData>, 
    ) {
        issuer.require_auth();
        if !env.storage().instance().has(&DataKey::Issuer(issuer.clone())) {
            panic!("Unauthorized issuer");
        }

        for cert_data in certs.iter() {
            let cert_hash = cert_data.hash.clone();
            if env.storage().persistent().has(&DataKey::Cert(cert_hash.clone())) {
                continue; // Skip existing
            }

            let cert = CertInfo {
                issuer: issuer.clone(),
                student_id: cert_data.student_id.clone(),
                student_wallet: cert_data.student_wallet.clone(),
                course: cert_data.course.clone(),
                issue_date: env.ledger().timestamp(),
                expiry_date: cert_data.expiry_date,
                status: CertStatus::Active,
            };

            env.storage().persistent().set(&DataKey::Cert(cert_hash.clone()), &cert);
            env.events().publish(("cert_issued", issuer.clone()), cert_hash);
        }
    }
}

#[cfg(test)]
mod test;
