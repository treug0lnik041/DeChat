use anchor_lang::prelude::*;

#[error_code]
pub enum UserError {
    #[msg("username length is more than 20 characters")]
    UserNameLooLong,

    #[msg("user does not exist")]
    UserDoesNotExist,
}

#[error_code]
pub enum UserMapError {
    #[msg("pair already exists")]
    PairAlreadyExists,
}
