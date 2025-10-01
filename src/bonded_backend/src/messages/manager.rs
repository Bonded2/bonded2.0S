use std::collections::HashMap;
use ic_cdk::storage;
use crate::messages::types::Message;
use candid::Principal;

pub struct MessagesManager {
    messages: HashMap<(Principal, Principal), Vec<Message>>, 
}

impl MessagesManager {
    pub fn new() -> Self {
        Self { messages: HashMap::new() }
    }

    pub fn init(&mut self, entries: Vec<((Principal, Principal), Vec<Message>)>) {
        self.messages.clear();
        for (k, v) in entries { self.messages.insert(k, v); }
    }

    pub fn get_entries(&self) -> Vec<((Principal, Principal), Vec<Message>)> {
        self.messages.iter().map(|(k, v)| (*k, v.clone())).collect()
    }

    pub fn send_message(&mut self, msg: Message) {
        let key = (msg.sender, msg.recipient);
        self.messages.entry(key).or_insert(vec![]).push(msg);
    }

    pub fn get_messages(&self, user1: Principal, user2: Principal) -> Vec<Message> {
        let mut msgs = vec![];

        if let Some(m) = self.messages.get(&(user1, user2)) {
            msgs.extend(m.clone())
        }

        if let Some(m) = self.messages.get(&(user2, user1)) {
            msgs.extend(m.clone())
        }

        msgs.sort_by_key(|msg| msg.timestamp);
        msgs
    }

}
