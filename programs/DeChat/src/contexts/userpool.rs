use crate::custommap::CustomMap;
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
