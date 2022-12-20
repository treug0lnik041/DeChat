use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct Message {
    pub timestamp: i64,
    pub text: String,
}

impl Message {
    pub fn new(text: String) -> Message {
        let timestamp = Clock::get().unwrap().unix_timestamp;
        Message { timestamp, text }
    }
}
