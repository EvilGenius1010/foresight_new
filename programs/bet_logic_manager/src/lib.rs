use anchor_lang::prelude::*;

declare_id!("85VYGYPaPtisYzoFiQwNu9YLquxzmGstnsebNXzFrPxD");
mod bettingratio;
struct BetEventStruct {
    event_name: String,
    party_a: String,
    party_b: String,
}

#[program]
pub mod betting {
    use super::*;

    // pub fn create_bet_event(ctx: Context<CreateEvent>, Event_info: BetEventStruct) -> Result<()> {
    // let event_account = &mut ctx.accounts.event_account;
    // event_account.party_a = *ctx.accounts.party_a.key;
    // event_account.party_b = *ctx.accounts.party_b.key;
    // event_account.event_name = Event_info.event_name;
    // event_account.balance_a = 0;
    // event_account.balance_b = 0;
    // event_account.is_mature = false;
    // event_account.betting_ratio_a
    // // event_account.Ok(())
    // }
}

// #[derive(Accounts)]
// #[instruction(event_name: String)]
// pub struct CreateEvent<'info> {
//     #[account(
//         init,
//         payer = payer,
//         seeds = [b"event", event_name.as_bytes(), party_a.key().as_ref()],
//         bump,
//         space = 8 + 8 + 8 + 1 + 4 + 64 + 32 + 32 // discriminator + balances + bool + string + pubkeys
//     )]
//     pub event_account: Account<'info, EventAccount>,
//
//     #[account(mut)]
//     pub payer: Signer<'info>,
//
//     //name of first party
//     pub party_a: AccountInfo<'info>,
//     //name of second party
//     pub party_b: AccountInfo<'info>,
//
//     pub betting_ratio_a: AccountInfo<'info>,
//
//     pub betting_ratio_b: AccountInfo<'info>,
//
//     pub system_program: Program<'info, System>,
// }
//
// #[account]
// pub struct EventAccount {
//     pub balance_a: u64,
//     pub balance_b: u64,
//     pub is_mature: bool,
//     pub event_name: String, // max 64 bytes (Anchor adds padding)
//     pub party_a: String,
//     pub party_b: String,
//     pub betting_ratio_a: u32,
//     pub betting_ratio_b: u32,
// }
