#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use sha3::{Digest, Keccak256};
use sp_core::{ecdsa, H160, H256};

#[cfg(feature = "std")]
pub use serde::{de::DeserializeOwned, Deserialize, Serialize};

#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
#[derive(Eq, PartialEq, Clone, Encode, Decode, sp_core::RuntimeDebug)]
pub struct EthereumSignature(ecdsa::Signature);

impl From<ecdsa::Signature> for EthereumSignature {
    fn from(x: ecdsa::Signature) -> Self {
        EthereumSignature(x)
    }
}

impl sp_runtime::traits::Verify for EthereumSignature {
    type Signer = EthereumSigner;
    fn verify<L: sp_runtime::traits::Lazy<[u8]>>(&self, mut msg: L, signer: &H160) -> bool {
        let mut m = [0u8; 32];
        m.copy_from_slice(Keccak256::digest(msg.get()).as_slice());
        match sp_io::crypto::secp256k1_ecdsa_recover(self.0.as_ref(), &m) {
            Ok(pubkey) => {
                // TODO This conversion could use a comment. Why H256 first, then H160?
                H160::from(H256::from_slice(Keccak256::digest(&pubkey).as_slice())) == *signer
            }
            Err(sp_io::EcdsaVerifyError::BadRS) => {
                log::error!(target: "evm", "Error recovering: Incorrect value of R or S");
                false
            }
            Err(sp_io::EcdsaVerifyError::BadV) => {
                log::error!(target: "evm", "Error recovering: Incorrect value of V");
                false
            }
            Err(sp_io::EcdsaVerifyError::BadSignature) => {
                log::error!(target: "evm", "Error recovering: Invalid signature");
                false
            }
        }
    }
}

/// Public key for an Ethereum / H160 compatible account
#[derive(Eq, PartialEq, Ord, PartialOrd, Clone, Encode, Decode, sp_core::RuntimeDebug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct EthereumSigner([u8; 20]);

impl sp_runtime::traits::IdentifyAccount for EthereumSigner {
    type AccountId = H160;
    fn into_account(self) -> H160 {
        self.0.into()
    }
}

impl From<[u8; 20]> for EthereumSigner {
    fn from(x: [u8; 20]) -> Self {
        EthereumSigner(x)
    }
}

impl From<ecdsa::Public> for EthereumSigner {
    fn from(x: ecdsa::Public) -> Self {
        let mut m = [0u8; 20];
        m.copy_from_slice(&x.as_ref()[13..33]);
        EthereumSigner(m)
    }
}

#[cfg(feature = "std")]
impl std::fmt::Display for EthereumSigner {
    fn fmt(&self, fmt: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(fmt, "ethereum signature: {:?}", H160::from_slice(&self.0))
    }
}
