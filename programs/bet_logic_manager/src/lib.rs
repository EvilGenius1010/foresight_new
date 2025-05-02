use anchor_lang::prelude::*;

declare_id!("85VYGYPaPtisYzoFiQwNu9YLquxzmGstnsebNXzFrPxD");

#[program]
pub mod bet_logic_manager {
    use super::*;

    // pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    //     msg!("Greetings from: {:?}", ctx.program_id);
    //     Ok(())
    // }

    pub fn create_bet(ctx: Context<CreateBet>, bet: Bet) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


#[account]
pub struct BettingPool{
    pub authority:Pubkey,
    pub event_name:String, //fixed length string as itll be hashed on clientside
    

}