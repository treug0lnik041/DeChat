use crate::utils::message::Message;
use anchor_lang::prelude::*;

#[account]
pub struct MessagePool {
    pub messages: Vec<Message>,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateMessagePool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: user2 key need to create PDA
    pub user2: UncheckedAccount<'info>,
    /// Use all space for grow userpool
    #[account(
		init,
		payer = payer,
		space = 10240,
		seeds = [&user2.key().to_bytes(), payer.key().as_ref()],
		bump
	)]
    pub message_pool: Account<'info, MessagePool>,
    pub system_program: Program<'info, System>,
}
