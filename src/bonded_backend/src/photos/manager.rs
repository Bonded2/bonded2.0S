use std::collections::HashMap;
use ic_cdk::storage;
use crate::photos::types::Photo;
use candid::Principal;

pub struct PhotosManager {
    photos: HashMap<(Principal, Principal), Vec<Photo>>, 
}

impl PhotosManager {
    pub fn new() -> Self {
        Self { photos: HashMap::new() }
    }

    pub fn init(&mut self, entries: Vec<((Principal, Principal), Vec<Photo>)>) {
        self.photos.clear();
        for (k, v) in entries { self.photos.insert(k, v); }
    }

    pub fn get_entries(&self) -> Vec<((Principal, Principal), Vec<Photo>)> {
        self.photos.iter().map(|(k, v)| (*k, v.clone())).collect()
    }

    pub fn upload_photos(&mut self, msg: Photo) {
        let key = (msg.user, msg.partner);
        self.photos.entry(key).or_insert(vec![]).push(msg);
    }

    pub fn get_photos(&self, user1: Principal, user2: Principal) -> Vec<Photo> {
        let mut msgs = vec![];

        if let Some(m) = self.photos.get(&(user1, user2)) {
            msgs.extend(m.clone())
        }

        if let Some(m) = self.photos.get(&(user2, user1)) {
            msgs.extend(m.clone())
        }

        msgs.sort_by_key(|msg| msg.timestamp);
        msgs
    }

}
