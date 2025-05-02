use anchor_lang::prelude::*;

declare_id!("5k5YNAN1kh4rMjz4cN9XsSsQNFsSs1Zb52Euqay7kG8J");

#[program]
pub mod simulate_bet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
