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

	/// CHECK: sender key for creating PDA account
	pub sender: UncheckedAccount<'info>,
    /// CHECK: receiver key for creating PDA account
    pub receiver: UncheckedAccount<'info>,
    /// Use all space for grow userpool
    #[account(
		init,
		payer = payer,
		space = 10240,
		seeds = [&receiver.key().to_bytes(), sender.key().as_ref()],
		bump
	)]
    pub message_pool: Account<'info, MessagePool>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ViewMessagePool<'info> {
	/// CHECK: sender key for getting PDA account
	pub sender: UncheckedAccount<'info>,
	/// CHECK: receiver key for getting PDA account 
    pub receiver: UncheckedAccount<'info>,
    #[account(
		seeds = [&receiver.key().to_bytes(), sender.key().as_ref()],
		bump = message_pool.bump
	)]
    pub message_pool: Account<'info, MessagePool>,
}

#[derive(Accounts)]
pub struct GetMessagePool<'info> {
	/// CHECK: sender key for getting PDA account
	pub sender: UncheckedAccount<'info>,
	/// CHECK: receiver key for getting PDA account 
    pub receiver: UncheckedAccount<'info>,
    #[account(
		mut,
		seeds = [&receiver.key().to_bytes(), sender.key().as_ref()],
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

	pub fn receive_messages(&self) -> Result<Vec<Message>> {
		let vec = self.messages.clone();
		return Ok(vec);
	}

	pub fn clear_messages(&mut self) -> Result<()> {
		self.messages.clear();
		Ok(())
	}
}