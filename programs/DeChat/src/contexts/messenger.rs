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

#[derive(Accounts)]
pub struct GetMessagePool<'info> {
	pub payer: Signer<'info>,
	/// CHECK: key for getting PDA account (must be program id)
    pub user2: UncheckedAccount<'info>,
    #[account(
		mut,
		seeds = [&user2.key().to_bytes(), payer.key().as_ref()],
		bump = message_pool.bump
	)]
    pub message_pool: Account<'info, MessagePool>,
}

impl MessagePool {
	pub fn send_message(&mut self, message_text: String) -> Result<()> {
		let message = Message::new(message_text);
		self.messages.push(message);
		Ok(())
	}
}