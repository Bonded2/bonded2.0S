use candid::Principal;
use ic_cdk::{api::msg_caller, storage};
use ic_cdk_macros::{post_upgrade, pre_upgrade, update};
use std::cell::RefCell;

use crate::users::{manager::UsersManager, types::User};

thread_local! {
    static USERS_MANAGER: RefCell<UsersManager> = RefCell::new(UsersManager::new());
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
    storage::stable_save((user_entries,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    match storage::stable_restore::<(Vec<(Principal, User)>,)>() {
        Ok((user_entries,)) => {
            USERS_MANAGER.with(|m| m.borrow_mut().init(user_entries))
        }
        Err(e) => {
            ic_cdk::api::debug_print(format!("⚠️ Failed to restore stable state: {:?}", e));
            USERS_MANAGER.with(|m| m.borrow_mut().init(Vec::new()))
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
pub fn get_all_users() -> Result<Vec<User>, String> {
    Ok(USERS_MANAGER.with(|m| m.borrow().get_all_users()))
}