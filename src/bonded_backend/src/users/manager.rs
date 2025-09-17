use std::collections::HashMap;
use candid::Principal;
use crate::users::types::*;

pub struct UsersManager {
    users: HashMap<Principal, User>,
}

impl UsersManager {
    pub fn new() -> Self {
        Self { users: HashMap::new() }
    }

    pub fn init(&mut self, entries: Vec<(Principal, User)>) {
        self.users.clear();
        for (p, u) in entries { self.users.insert(p, u); }
    }

    pub fn get_entries(&self) -> Vec<(Principal, User)> {
        self.users.iter().map(|(p, u)| (*p, u.clone())).collect()
    }

    pub fn create_user(&mut self, caller: Principal, provider: String, inviter: Option<String>) -> Result<User, String> {
        if self.users.contains_key(&caller) {
            return Err("User information has already been registered.".into());
        }
        let now = ic_cdk::api::time() as i64;
        let caller_text = caller.to_text();
        let short_caller: String = caller_text.chars().take(15).collect();
        let user = format!("User_{}", short_caller);

        let mut partner_email = String::new();
        let mut partner_username = String::new();
        let mut status = Status::Single;

        if let Some(email) = inviter.clone() {
            partner_email = email.clone();
            partner_username = email.clone();
            status = Status::Bonded;
        }

        let user = User {
            principal_id: caller,
            profile: vec![],
            nationality: String::new(),
            residency: String::new(),
            document_type: vec![DocumentTypes::None],
            document: vec![],
            email: user.clone(),
            username: user.clone(),
            partner_email,
            partner_username,
            status,
            dm: vec![DMs::None],
            social: vec![Socials::None],
            calls: vec![Calls::None],
            callendar: vec![Callendars::None],
            subscriptions: vec![Subscriptions::None],
            provider: provider,
            role: Role::User,
            created_at: now,
            updated_at: now,
        };

        if let Some(inviter_email) = inviter {
            if let Some((inviter_principal, mut inviter_user)) = self.users.iter_mut()
                .find(|(_, u)| u.email == inviter_email || u.username == inviter_email)
                .map(|(p, u)| (*p, u.clone())) 
            {
                if inviter_user.partner_email.is_empty() && inviter_user.partner_username.is_empty() {
                    inviter_user.partner_email = user.email.clone();
                    inviter_user.partner_username = user.username.clone();
                    inviter_user.status = Status::Bonded;
                    inviter_user.updated_at = now;

                    self.users.insert(inviter_principal, inviter_user);
                } else {
                    return Err("Inviter is already bonded with another user.".into());
                }
            } else {
                return Err("Inviter not found.".into());
            }
        }

        self.users.insert(caller, user.clone());
        Ok(user)
    }

    pub fn get_user(&self, caller: Principal) -> Result<User, String> {
        self.users.get(&caller).cloned().ok_or("Unauthorized State. User information cannot be found.".into())
    }

    pub fn get_all_users(&self) -> Vec<User> {
        self.users.values().cloned().collect()
    }

}