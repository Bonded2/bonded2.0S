use candid::Principal;
use ic_cdk::{api::msg_caller, storage};
use ic_cdk_macros::{post_upgrade, pre_upgrade, update};
use std::cell::RefCell;

use crate::users::{manager::UsersManager, types::User};
use crate::messages::{manager::MessagesManager, types::Message};
use crate::messages::types::{MessageType, MessageStatus};
use crate::photos::{manager::PhotosManager, types::{Photo, PhotoStatus}};

thread_local! {
    static USERS_MANAGER: RefCell<UsersManager> = RefCell::new(UsersManager::new());
    static MESSAGES_MANAGER: RefCell<MessagesManager> = RefCell::new(MessagesManager::new());
    static PHOTOS_MANAGER: RefCell<PhotosManager> = RefCell::new(PhotosManager::new());
}

// fn authenticated() -> Result<Principal, String> {
//     let principal = msg_caller();
//     if principal == Principal::anonymous() {
//         return Err("Anonymous State. User access has been denied.".into());
//     }
//     Ok(principal)
// }

#[pre_upgrade]
fn pre_upgrade() {
    let user_entries = USERS_MANAGER.with(|m| m.borrow().get_entries());
    let message_entries = MESSAGES_MANAGER.with(|m| m.borrow().get_entries());
    let photos_entries = PHOTOS_MANAGER.with(|m| m.borrow().get_entries());
    storage::stable_save((user_entries, message_entries, photos_entries)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    match storage::stable_restore::<(Vec<(Principal, User)>, Vec<((Principal, Principal), Vec<Message>)>, Vec<((Principal, Principal), Vec<Photo>)>)>() {
        Ok((user_entries, message_entries, photos_entries)) => {
            USERS_MANAGER.with(|m| m.borrow_mut().init(user_entries));
            MESSAGES_MANAGER.with(|m| m.borrow_mut().init(message_entries));
            PHOTOS_MANAGER.with(|m| m.borrow_mut().init(photos_entries));
        }
        Err(e) => {
            ic_cdk::api::debug_print(format!("Failed to restore stable state: {:?}", e));
            USERS_MANAGER.with(|m| m.borrow_mut().init(Vec::new()));
            MESSAGES_MANAGER.with(|m| m.borrow_mut().init(Vec::new()));
            PHOTOS_MANAGER.with(|m| m.borrow_mut().init(Vec::new()));
        }
    }
}

#[update]
pub fn create_user(provider: String, inviter: Option<String>) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().create_user(caller, provider, inviter))
}

#[update]
pub fn get_user() -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow().get_user(caller))
}

#[update]
pub fn get_partner() -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow().get_partner(caller))
}

#[update]
pub fn update_user_data(firstname: String, middlename: String, lastname: String, username: String) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_data(caller, firstname, middlename, lastname, username))
}

#[update]
pub fn update_user_picture(profile: Vec<u8>) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_picture(caller, profile))
}

#[update]
pub fn update_user_nationality(nationality: String) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_nationality(caller, nationality))
}

#[update]
pub fn update_user_residencies(primary_residence: String, other_addresses: Vec<String>) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_residencies(caller, primary_residence, other_addresses))
}

#[update]
pub fn update_user_documents(document_type: String, document: Vec<Vec<u8>>) -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_documents(caller, document_type, document))
}

#[update]
pub fn update_user_status() -> Result<User, String> {
    let caller = msg_caller();
    USERS_MANAGER.with(|m| m.borrow_mut().update_user_status(caller))
}

#[update]
pub fn get_all_users() -> Result<Vec<User>, String> {
    Ok(USERS_MANAGER.with(|m| m.borrow().get_all_users()))
}

#[update]
pub fn send_message(message_text: String) -> Result<Message, String> {
    use ic_cdk::api::msg_caller;

    let caller = msg_caller();
    let partner = USERS_MANAGER.with(|m| m.borrow().get_partner(caller))?;

    let now = ic_cdk::api::time() as i64;
    let msg = Message {
        id: format!("msg-{}", now),
        sender: caller,
        recipient: partner.principal_id,
        text: message_text.clone(),
        timestamp: now,
        msg_type: MessageType::Sent,
        status: MessageStatus::Read,
    };

    MESSAGES_MANAGER.with(|m| m.borrow_mut().send_message(msg.clone()));

    Ok(msg)
}

#[update]
pub fn get_messages() -> Result<Vec<Message>, String> {
    let caller = ic_cdk::api::msg_caller();
    let partner = USERS_MANAGER.with(|m| m.borrow().get_partner(caller))?;

    let msgs = MESSAGES_MANAGER.with(|m| m.borrow().get_messages(caller, partner.principal_id));
    Ok(msgs)
}

#[update]
pub fn upload_photo(photo_data: Vec<u8>) -> Result<Photo, String> {
    let caller = msg_caller();
    let partner = USERS_MANAGER.with(|m| m.borrow().get_partner(caller))?;

    let now = ic_cdk::api::time() as i64;
    let photo = Photo {
        id: format!("photo-{}", now),
        data: photo_data,
        user: caller,
        partner: partner.principal_id,
        timestamp: now,
        status: PhotoStatus::Accepted,
    };

    PHOTOS_MANAGER.with(|m| m.borrow_mut().upload_photos(photo.clone()));
    Ok(photo)
}

#[update]
pub fn get_photos() -> Result<Vec<Photo>, String> {
    let caller = msg_caller();
    let partner = USERS_MANAGER.with(|m| m.borrow().get_partner(caller))?;
    let photos = PHOTOS_MANAGER.with(|m| m.borrow().get_photos(caller, partner.principal_id));
    Ok(photos)
}