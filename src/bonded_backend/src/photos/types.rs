use candid::{CandidType, Deserialize};
use candid::Principal;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum PhotoStatus { Pending, Accepted }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Photo {
    pub id: String,
    pub data: Vec<u8>,
    pub user: Principal,
    pub partner: Principal,
    pub timestamp: i64,
    pub status: PhotoStatus,
}