mod contexts;
mod errors;
mod utils;

use anchor_lang::prelude::*;
use contexts::*;
use errors::*;
use utils::{custommap::CustomMap, message::Message};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod de_chat {
    use super::*;

    // UserPool methods

    /// Create pool of users this pair of public key => username. PDA belongs to program id
    pub fn create_user_pool(ctx: Context<CreateUserPool>) -> Result<()> {
        let user_pool = &mut ctx.accounts.user_pool;
        user_pool.users = CustomMap::new();
        user_pool.bump = *ctx.bumps.get("user_pool").unwrap();

        Ok(())
    }

    /// Create user in user pool with a specific name for given public key (only if public key belongs to signer)
    /// Method also checks if user with this username already exists
    pub fn create_new_user(ctx: Context<ChangeUserPool>, name: String) -> Result<()> {
        require!(name.as_bytes().len() <= 20, UserError::UserNameLooLong);
        return ctx
            .accounts
            .user_pool
            .create_new_user(ctx.accounts.payer.key(), name);
    }

    /// Change username for given public key (only if public key belongs to signer)
    pub fn change_user_name(ctx: Context<ChangeUserPool>, new_name: String) -> Result<()> {
        require!(new_name.as_bytes().len() <= 20, UserError::UserNameLooLong);

        return ctx
            .accounts
            .user_pool
            .change_user_name(ctx.accounts.payer.key(), new_name);
    }

    /// Get username for given public key
    pub fn get_user_name(ctx: Context<ViewUserPool>, pubkey: Pubkey) -> Result<String> {
        return ctx.accounts.user_pool.get_user_name(pubkey);
    }

    /// Get user public key for given username
    pub fn get_user_pubkey(ctx: Context<ViewUserPool>, name: String) -> Result<Pubkey> {
        return ctx.accounts.user_pool.get_user_pubkey(name);
    }

    // MessagePool methods

    /// Create pool of messages for one dialogue
    pub fn create_message_pool(ctx: Context<CreateMessagePool>) -> Result<()> {
        let message_pool = &mut ctx.accounts.message_pool;
        message_pool.messages = Vec::new();
        message_pool.bump = *ctx.bumps.get("message_pool").unwrap();

        Ok(())
    }

    /// Send message
    pub fn send_message(ctx: Context<GetMessagePool>, message_text: String) -> Result<()> {
        return ctx.accounts.message_pool.send_message(message_text);
    }

    /// Receive vector of messages from given message pool
    pub fn receive_messages(ctx: Context<ViewMessagePool>) -> Result<Vec<Message>> {
        return ctx.accounts.message_pool.receive_messages();
    }

    /// Clear message pool
    /// This method doesn't return anything. It just clears vector of messages providing ability to set 'read' status for messages
    pub fn clear_messages(ctx: Context<GetMessagePool>) -> Result<()> {
        return ctx.accounts.message_pool.clear_messages();
    }
}
