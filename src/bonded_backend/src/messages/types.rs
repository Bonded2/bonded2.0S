use candid::{CandidType, Deserialize};
use candid::Principal;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum MessageType { Sent, Received }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum MessageStatus { Read, Delivered }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Message {
    pub id: String,
    pub sender: Principal,
    pub recipient: Principal,
    pub text: String,
    pub timestamp: i64,
    pub msg_type: MessageType,
    pub status: MessageStatus,
}
 