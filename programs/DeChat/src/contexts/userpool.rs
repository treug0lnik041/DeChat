use crate::{errors::UserError, utils::custommap::CustomMap};
use anchor_lang::prelude::*;

#[account]
pub struct UserPool {
    pub users: CustomMap,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateUserPool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: key for creating PDA account (must be program id)
    pub authority: UncheckedAccount<'info>,
    /// Use all space for grow userpool
    #[account(
		init,
		payer = payer,
		space = 10240,
		seeds = [b"user-pool", authority.key().as_ref()],
		bump
	)]
    pub user_pool: Account<'info, UserPool>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeUserPool<'info> {
    pub payer: Signer<'info>,
    /// CHECK: key for getting PDA account (must be program id)
    pub authority: UncheckedAccount<'info>,
    #[account(
		mut,
		seeds = [b"user-pool", authority.key().as_ref()],
		bump = user_pool.bump
	)]
    pub user_pool: Account<'info, UserPool>,
}

#[derive(Accounts)]
pub struct ViewUserPool<'info> {
    /// CHECK: key for getting PDA account (must be program id)
    pub authority: UncheckedAccount<'info>,
    #[account(
		seeds = [b"user-pool", authority.key().as_ref()],
		bump = user_pool.bump
	)]
    pub user_pool: Account<'info, UserPool>,
}

impl UserPool {
    pub fn create_new_user(&mut self, user: Pubkey, name: String) -> Result<()> {
        self.users.insert(user, name)?;
        Ok(())
    }

    pub fn change_user_name(&mut self, user: Pubkey, new_name: String) -> Result<()> {
        if let Some(value) = self.users.get_by_key_mut(&user) {
            *value = new_name;
            return Ok(());
        } else {
            return err!(UserError::UserDoesNotExist);
        }
    }

    pub fn get_user_name(&self, pubkey: Pubkey) -> Result<String> {
        match self.users.get_by_key(&pubkey) {
            Some(pair) => return Ok(pair.to_tuple().1.clone()),
            None => return err!(UserError::UserDoesNotExist),
        }
    }

    pub fn get_user_pubkey(&self, name: String) -> Result<Pubkey> {
        match self.users.get_by_value(&name) {
            Some(pair) => return Ok(pair.to_tuple().0.clone()),
            None => return err!(UserError::UserDoesNotExist),
        }
    }
}
