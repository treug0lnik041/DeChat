mod contexts;
mod custommap;
mod errors;

use custommap::CustomMap;
use errors::*;
use anchor_lang::prelude::*;
use contexts::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod de_chat {
    use super::*;

    pub fn create_user_pool(ctx: Context<CreateUserPool>) -> Result<()> {
        let user_pool = &mut ctx.accounts.user_pool;
        user_pool.users = CustomMap::new();

        user_pool.bump = *ctx.bumps.get("user_pool").unwrap();
        Ok(())
    }

    pub fn create_new_user(ctx: Context<ChangeUserPool>, name: String) -> Result<()> {
        require!(name.as_bytes().len() <= 20, UserError::UserNameLooLong);

        let user_pool = &mut ctx.accounts.user_pool;
        let payer = &ctx.accounts.payer;
        user_pool.users.insert(payer.key(), name)?;
        Ok(())
    }

    pub fn change_user_name(ctx: Context<ChangeUserPool>, new_name: String) -> Result<()> {
        require!(new_name.as_bytes().len() <= 20, UserError::UserNameLooLong);

        let payer = &ctx.accounts.payer;
        if let Some(value) = ctx.accounts.user_pool.users.get_by_key_mut(&payer.key()) {
            *value = new_name;
            return Ok(());
        } else {
            return err!(UserError::UserDoesNotExist);
        }
    }

    pub fn get_user_name(ctx: Context<ViewUserPool>, pubkey: Pubkey) -> Result<String> {
        let user_pool = &ctx.accounts.user_pool.users;

        match user_pool.get_by_key(&pubkey) {
            Some(pair) => return Ok(pair.to_tuple().1.clone()),
            None => return err!(UserError::UserDoesNotExist),
        }
    }

    pub fn get_user_pubkey(ctx: Context<ViewUserPool>, name: String) -> Result<Pubkey> {
        let user_pool = &ctx.accounts.user_pool.users;

        match user_pool.get_by_value(&name) {
            Some(pair) => return Ok(pair.to_tuple().0.clone()),
            None => return err!(UserError::UserDoesNotExist),
        }
    }
}

