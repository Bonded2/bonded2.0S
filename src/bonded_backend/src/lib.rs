pub mod users;
pub mod core;

use crate::users::types::User;

pub use core::{
    create_user,
    get_user,
    get_all_users
};

ic_cdk::export_candid!();