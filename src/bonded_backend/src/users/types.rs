use candid::{CandidType, Deserialize};
use candid::Principal;

// #[derive(Clone, Debug, CandidType, Deserialize)]
// pub enum DocumentTypes { None, MarriageCertificate, BankStatement, UtilityBill, Other }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum DMs { None, OpenChat, Telegram, WhatsApp, Messenger }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Socials { None, Facebook, Instagram, Tiktok }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Calls { None, OpenChat, WhatsApp, Messenger, GMeet, Zoom }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Callendars { None, GCalendar, OCalendar }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Subscriptions { None, Monthly, Yearly }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Role { User, Verified }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum Status { Single, Complicated, Bonded }

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct User {
    pub principal_id: Principal,
    pub profile: Vec<u8>,
    pub nationality: String,
    pub primary_residence: String,
    pub other_addresses: Vec<String>,
    pub document_type: String,
    pub document: Vec<Vec<u8>>,
    pub email: String,
    pub firstname: String,
    pub middlename: String,
    pub lastname: String,
    pub username: String,
    pub gender: String,
    pub partner_email: String,
    pub partner_username: String,
    pub dm: Vec<DMs>,
    pub social: Vec<Socials>,
    pub calls: Vec<Calls>,
    pub callendar: Vec<Callendars>,
    pub subscriptions: Vec<Subscriptions>,
    pub provider: String,
    pub role: Role,
    pub status: Status,
    pub created_at: i64,
    pub updated_at: i64,
}