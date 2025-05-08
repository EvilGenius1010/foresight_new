// use anchor_lang::prelude::*;
// // use anchor_spl::token::{Mint, Token, TokenAccount};

// declare_id!("3FXN3qAS7d2SLm653Q3SW46p3qExwnmLozoDufTMAvLf");

// #[program]
// pub mod non_custodial_escrow {
//     use super::*;

//     pub fn initialize(ctx: Context<MakeBet>, amount: u64, bet_slip: BetContract) -> Result<()> {
//         let escrow = &mut ctx.accounts.escrow; //instantiates variable which holds the escrow account info.
//         escrow.bump = ctx.bumps.escrow;
//         escrow.authority = ctx.accounts.seller.key(); //pubkey of seller
//         escrow.escrowed_x_tokens = ctx.accounts.escrowed_x_tokens.key();
//         escrow.contract = bet_slip; // number of token sellers wants in exchange
//         escrow.y_mint = ctx.accounts.y_mint.key(); // token seller wants in exchange

//         // // Transfer seller's x_token in program owned escrow token account
//         // anchor_spl::token::transfer(
//         //     CpiContext::new(
//         //         ctx.accounts.token_program.to_account_info(),
//         //         anchor_spl::token::Transfer {
//         //             from: ctx.accounts.seller_x_token.to_account_info(),
//         //             to: ctx.accounts.escrowed_x_tokens.to_account_info(),
//         //             authority: ctx.accounts.seller.to_account_info(),
//         //         },
//         //     ),
//         //     amount,
//         // )?;

//         anchor_lang::solana_program::system_instruction::transfer(ctx.accounts.seller.key,
//         &ctx.accounts.escrow.key(), amount);
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct MakeBet<'info>{
//     #[account(mut)]
//     pub client:Signer<'info>,
//     #[account(
//         mut,
//         seeds = [b"lc0a7v93kapq1mcls", client.key().as_ref()],
//         bump,
//     )]
//     pub escrow_pda: UncheckedAccount<'info>,

//     #[account(
//         init,
//         payer = user,
//         space = Escrow::LEN,
//         seeds = [b"escrow-data", user.key().as_ref()],
//         bump,
//     )]
//     pub escrow: Account<'info, Escrow>,

//     pub system_program: Program<'info, System>,

// }

// // #[derive(Accounts)]
// // pub struct Initialize<'info> {
// //     #[account(mut)]
// //     seller: Signer<'info>,
// //     x_mint: Account<'info, Mint>,
// //     y_mint: Account<'info, Mint>,
// //     #[account(mut, constraint = seller_x_token.mint == x_mint.key() && seller_x_token.owner == seller.key())]
// //     seller_x_token: Account<'info, TokenAccount>,
// //     #[account(
// //         init,
// //         payer = seller,
// //         space=Escrow::LEN,
// //         seeds = ["fs23odmo2i2".as_bytes(), seller.key().as_ref()],
// //         bump,
// //     )]
// //     pub escrow: Account<'info, Escrow>,
// //     #[account(
// //         init,
// //         payer = seller,
// //         token::mint = x_mint,
// //         token::authority = escrow,
// //     )]
// //     escrowed_x_tokens: Account<'info, TokenAccount>,
// //     token_program: Program<'info, Token>,
// //     rent: Sysvar<'info, Rent>,
// //     system_program: Program<'info, System>,
// // }

// #[account]
// pub struct Escrow {
//     authority: Pubkey,
//     bump: u8,
//     escrowed_x_tokens: Pubkey,
//     y_mint: Pubkey,
//     contract: BetContract
// }

// impl Escrow {
//     pub const LEN: usize = 8 + 1+ 32 + 32 + 32 + 8;
// }

// #[derive(Clone,AnchorSerialize,AnchorDeserialize)]
// pub struct BetContract{
//     bet_event:String, //change this and enforce
//     betting_ratio:f32, //
//     winner:bool
// }

use anchor_lang::{prelude::*, solana_program::lamports};
pub mod escrow_acc;
// use escrow_acc::*;
use crate::escrow_acc::*;


declare_id!("3FXN3qAS7d2SLm653Q3SW46p3qExwnmLozoDufTMAvLf");

#[program]
mod escrow_accounts {
    use super::*;

    ///escrow account creation
    pub fn initialize(
        ctx: Context<InitializeBetEvent>,
        event_name: String,
        bump: u8,
    ) -> Result<()> {
        msg!("Bet Account creation started!");
        let escrow_account = &mut ctx.accounts.escrowaccount;
        escrow_account.bump = bump;
        escrow_account.pda = escrow_account.key();
        escrow_account.liquidity_a = 10.0;
        escrow_account.liquidity_b = 20.0;
        // escrow_account.total_bets = 0;
        // escrow_account.bets = Vec::new();
        msg!(
            "Created escrow_accounts' address is {}",
            escrow_account.key()
        );

        msg!("Starting creation of escrow account");

        // escrow_account.authority = ctx.accounts.user.key();
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        betting_ratio: f32,
        speculated_winner: bool,
        amount: f64,
        sender_addr: Pubkey,
    ) -> Result<()> {
        msg!("Bet Placed!");
        let escrowacc = &mut ctx.accounts.escrowaccount;

        // Optional: Check max bets limit
        if escrowacc.bets.len() >= BetEventInfo::MAX_BETS {
            return err!(ErrorCode::MaxBetsReached);
        }

        escrowacc.bets.push(BetSlip {
            better: sender_addr,
            amount,
            speculated_winner,
            betting_ratio,
        });

        if speculated_winner {
            escrowacc.liquidity_a += amount;
        } else {
            escrowacc.liquidity_b += amount;
        }

        escrowacc.total_bets += 1;
        Ok(())
    }

    pub fn create_payment_receipt(
        ctx: Context<EscrowAccountState>,
        betslip_ref: Pubkey,
        amount: u64,
    ) -> Result<()> {
        create_payment_receipt_p(
            ctx,
            betslip_ref,
            amount,
        )
    }

    pub fn payout_if_win(
        ctx: Context<PayoutIfWin>,
        correct_winner: bool,
        speculated_winner: bool,
    ) -> Result<()> {
        payout_if_win_p(
            ctx,
            correct_winner,
            speculated_winner,
        )
    }




    // fn distribute_winnings(ctx: Context<InitializeEscrow>, event_name: string) {}
}

#[derive(Accounts)]
pub struct InitializeBetEvent<'info> {
    #[account(init,
        payer=user, // who pays for creation of the account
        space=BetEventInfo::LEN+10,
        seeds=[b"s93koco2lfwojd231",user.key.as_ref()],
        bump
    )]
    pub escrowaccount: Account<'info, BetEventInfo>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
///account to store state of escrow account.
pub struct BetEventInfo {
    /// Stores the pda of this escrow account.
    pub pda: Pubkey,

    /// Total money bet on party A.
    pub liquidity_a: f64,

    /// Total money bet on party B.
    pub liquidity_b: f64,

    /// Total no of bets placed combined.
    pub total_bets: u64,

    /// History of all bets placed.
    pub bets: Vec<BetSlip>,

    /// Bump of pda derived
    pub bump: u8, // pub total_bets:u64,
                  // pub total_liquidity:u64,
                  // pub total_users:u64,
                  // pub total_winners:u64,
                  // pub total_losers


    /// Address at which escrow account is created. 
    escrow_account_ref: Pubkey,
    
}

#[account]
/// Struct for each bet placed.
// #[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct BetSlip {
    /// Public Key of wallet which placed the bet.
    better: Pubkey,

    /// The amount bet.
    amount: f64,

    /// The winner speculated by the better.
    speculated_winner: bool,

    /// Betting ratio at the time of bet.
    betting_ratio: f32,

}

impl BetSlip {
    /// Pubkey (32) + amount (8) + bool (1) + f32 (4)+padding(3)
    pub const LEN: usize = 32 + 8 + 1 + 4 + 3;
}

impl BetEventInfo {
    // pub const LEN: usize = 32+(8+1)+(8+1)+8+32+8+1+4+8;
    //one more byte for option and extra 8 bytes for discriminator

    /// Account size mapping in bytes.
    // pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + (45 * 1000);

    /// Maximum bets allowed per account.
    pub const MAX_BETS: usize = 6;

    /// discriminator(8)+pda(32)+liquidity_a(8)+liquidity_b(8)+idk(4)+betslips+bump(1)
    pub const LEN: usize = 8 // discriminator
        + 32 // pda
        + 8  // liquidity_a
        + 8  // liquidity_b
        + 8  // total_bets
        + 1    // bump
        + 4 + (Self::MAX_BETS * BetSlip::LEN); // vec prefix + contents
}

/// Create new account as init attribute of account running again.
#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut, seeds = [b"s93koco2lfwojd231", user.key().as_ref()], bump = escrowaccount.bump)]
    pub escrowaccount: Account<'info, BetEventInfo>,
    #[account(mut)]
    pub user: Signer<'info>,
}

/// Error code for max no of bets
#[error_code]
pub enum ErrorCode {
    #[msg("Maximum number of bets reached.")]
    MaxBetsReached,
}
