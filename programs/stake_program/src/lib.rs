use anchor_lang::prelude::*;

declare_id!("GAiXkYDpamSbSYAH6c4iffj8GjNbbuHQoBAhCcWtG9x3");

#[program]
pub mod stake_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
