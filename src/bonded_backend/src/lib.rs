pub mod users;
pub mod messages;
pub mod photos;
pub mod core;

use crate::users::types::User;
use crate::messages::types::Message;
use crate::photos::types::Photo;

pub use core::{
    create_user,
    get_user,
    get_partner,
    update_user_data,
    update_user_picture,
    update_user_nationality,
    update_user_residencies,
    update_user_documents,
    get_all_users,
    send_message,
    get_messages,
    upload_photo,
    get_photos
};

ic_cdk::export_candid!();