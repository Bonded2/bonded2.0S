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
            status = Status::Complicated;
        }

        let user = User {
            principal_id: caller,
            profile: vec![],
            nationality: String::new(),
            primary_residence: String::new(),
            other_addresses: vec![],
            document_type: String::new(),
            document: vec![],
            email: user.clone(),
            firstname: String::new(),
            middlename: String::new(),
            lastname: String::new(),
            username: user.clone(),
            gender: String::new(),
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
                    inviter_user.status = Status::Complicated;
                    inviter_user.updated_at = now;

                    self.users.insert(inviter_principal, inviter_user);
                } else {
                    return Err("Inviter is already connected with another user.".into());
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

    pub fn get_partner(&self, caller: Principal) -> Result<User, String> {
        let user = self.users.get(&caller)
            .ok_or("Unauthorized Access. User cannot be found.".to_string())?;

        if user.partner_email.is_empty() && user.partner_username.is_empty() {
            return Err("This user does not have a partner.".into())
        }

        if let Some((_, partner)) = self.users.iter().find(|(_, u)| 
            (!user.partner_email.is_empty() && u.email == user.partner_email) ||
            (!user.partner_username.is_empty() && u.username == user.partner_username)
        ) {
            Ok(partner.clone())
        } else {
            Err("Partner not found.".into())
        }
    }

    pub fn update_user_data(&mut self, caller: Principal, firstname: String, middlename: String, lastname: String, username: String) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        let user = User {
            principal_id: caller,
            profile: existing_user.profile,
            nationality: existing_user.nationality,
            primary_residence: existing_user.primary_residence,
            other_addresses: existing_user.other_addresses,
            document_type: existing_user.document_type,
            document: existing_user.document,
            email: existing_user.email,
            firstname: firstname,
            middlename: middlename,
            lastname: lastname,
            username: username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: existing_user.status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn update_user_picture(&mut self, caller: Principal, profile: Vec<u8>) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        let user = User {
            principal_id: caller,
            profile: profile,
            nationality: existing_user.nationality,
            primary_residence: existing_user.primary_residence,
            other_addresses: existing_user.other_addresses,
            document_type: existing_user.document_type,
            document: existing_user.document,
            email: existing_user.email,
            firstname: existing_user.firstname,
            middlename: existing_user.middlename,
            lastname: existing_user.lastname,
            username: existing_user.username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: existing_user.status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn update_user_nationality(&mut self, caller: Principal, nationality: String) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        let user = User {
            principal_id: caller,
            profile: existing_user.profile,
            nationality: nationality,
            primary_residence: existing_user.primary_residence,
            other_addresses: existing_user.other_addresses,
            document_type: existing_user.document_type,
            document: existing_user.document,
            email: existing_user.email,
            firstname: existing_user.firstname,
            middlename: existing_user.middlename,
            lastname: existing_user.lastname,
            username: existing_user.username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: existing_user.status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn update_user_residencies(&mut self, caller: Principal, primary_residence: String, other_addresses: Vec<String>) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        let user = User {
            principal_id: caller,
            profile: existing_user.profile,
            nationality: existing_user.nationality,
            primary_residence: primary_residence,
            other_addresses: other_addresses,
            document_type: existing_user.document_type,
            document: existing_user.document,
            email: existing_user.email,
            firstname: existing_user.firstname,
            middlename: existing_user.middlename,
            lastname: existing_user.lastname,
            username: existing_user.username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: existing_user.status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn update_user_documents(&mut self, caller: Principal, document_type: String, document: Vec<Vec<u8>>) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        let user = User {
            principal_id: caller,
            profile: existing_user.profile,
            nationality: existing_user.nationality,
            primary_residence: existing_user.primary_residence,
            other_addresses: existing_user.other_addresses,
            document_type: document_type,
            document: document,
            email: existing_user.email,
            firstname: existing_user.firstname,
            middlename: existing_user.middlename,
            lastname: existing_user.lastname,
            username: existing_user.username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: existing_user.status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn update_user_status(&mut self, caller: Principal) -> Result<User, String> {

        let existing_user = self.users.get(&caller).ok_or("Unauthorized Access. User cannot be found.")?.clone();

        if existing_user.partner_email.is_empty() && existing_user.partner_username.is_empty() {
            return Err("Cannot update status without a partner.".into());
        }

        let new_status = match existing_user.status {
            Status::Single => Status::Complicated,
            Status::Complicated => Status::Bonded,
            Status::Bonded => Status::Bonded,
        };

        let user = User {
            principal_id: caller,
            profile: existing_user.profile,
            nationality: existing_user.nationality,
            primary_residence: existing_user.primary_residence,
            other_addresses: existing_user.other_addresses,
            document_type: existing_user.document_type,
            document: existing_user.document,
            email: existing_user.email,
            firstname: existing_user.firstname,
            middlename: existing_user.middlename,
            lastname: existing_user.lastname,
            username: existing_user.username,
            gender: existing_user.gender,
            partner_email: existing_user.partner_email,
            partner_username: existing_user.partner_username,
            status: new_status,
            dm: existing_user.dm,
            social: existing_user.social,
            calls: existing_user.calls,
            callendar: existing_user.callendar,
            subscriptions: existing_user.subscriptions,
            provider: existing_user.provider,
            role: existing_user.role,
            created_at: existing_user.created_at,
            updated_at: ic_cdk::api::time() as i64,
        };

        self.users.insert(caller, user.clone());

        Ok(user)
    }

    pub fn get_all_users(&self) -> Vec<User> {
        self.users.values().cloned().collect()
    }

}