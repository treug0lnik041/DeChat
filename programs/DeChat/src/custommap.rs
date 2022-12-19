use anchor_lang::prelude::*;

use crate::errors::UserMapError;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct CustomMap {
    map: Vec<KeyValuePair>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct KeyValuePair {
    key: Pubkey,
    value: String,
}

impl CustomMap {
    pub fn new() -> CustomMap {
        let map = Vec::new();
        CustomMap { map }
    }

    pub fn get_by_key(&self, _key: &Pubkey) -> Option<&KeyValuePair> {
        for pair in &self.map {
            let (key, _) = pair.to_tuple();
            if key == _key {
                return Some(pair);
            }
        }

        None
    }

    pub fn get_by_value(&self, _value: &String) -> Option<&KeyValuePair> {
        for pair in &self.map {
            let (_, value) = pair.to_tuple();
            if value == _value {
                return Some(pair);
            }
        }

        None
    }

    pub fn get_by_key_mut(&mut self, _key: &Pubkey) -> Option<&mut String> {
        for pair in &mut self.map {
            let (key, value) = pair.to_tuple_mut();
            if key == _key {
                return Some(value);
            }
        }

        None
    }

    pub fn insert(&mut self, _key: Pubkey, _value: String) -> Result<()> {
        if let None = self.get_by_key(&_key) {
            self.map.push(KeyValuePair::new(_key, _value));
            return Ok(());
        } else {
            return err!(UserMapError::PairAlreadyExists);
        }
    }
}

impl KeyValuePair {
    pub fn new(key: Pubkey, value: String) -> KeyValuePair {
        KeyValuePair { key, value }
    }

    pub fn to_tuple(&self) -> (&Pubkey, &String) {
        (&self.key, &self.value)
    }

    pub fn to_tuple_mut(&mut self) -> (&mut Pubkey, &mut String) {
        (&mut self.key, &mut self.value)
    }
}
