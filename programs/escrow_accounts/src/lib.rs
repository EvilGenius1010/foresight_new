
use anchor_lang::{prelude::*, solana_program::{lamports,system_instruction}};

pub mod escrow_acc;
// use escrow_acc::*;
use crate::escrow_acc::*;


declare_id!("3FXN3qAS7d2SLm653Q3SW46p3qExwnmLozoDufTMAvLf");

#[program]
mod escrow_accounts {
    use core::f64;

    use super::*;



    ///escrow account creation
    pub fn initialize(
        ctx: Context<InitializeBetEvent>,
        event_name: String,
    ) -> Result<()> {
        msg!("Bet Account creation started!");
        let escrow_account = &mut ctx.accounts.event_info_account;
        // escrow_account.bump = bump;

        escrow_account.bump = ctx.bumps.event_info_account;
        escrow_account.pda = escrow_account.key();
        escrow_account.liquidity_a = 10.0;
        escrow_account.liquidity_b = 20.0;
        escrow_account.betting_ratio_a = 0.5;
        escrow_account.betting_ratio_b = 0.5;
        escrow_account.event_name = event_name;
        escrow_account.total_bets = 0;
        escrow_account.bets = Vec::new();
        // escrow_account.total_bets = 0;
        // escrow_account.bets = Vec::new();
        msg!(
            "Created escrow_accounts' address is {}",
            escrow_account.key()
        );

        msg!("Starting creation of escrow account");





        // Creates a vault PDA escrow
        let (vault_pda, _vault_bump) = Pubkey::find_program_address(
            &[b"escrow_vault", ctx.accounts.user.key().as_ref()],
            ctx.program_id,
        );
        msg!("Vault PDA: {}", vault_pda);
        escrow_account.escrow_account_ref = vault_pda;
        escrow_account.escrow_account_ref_bump = _vault_bump;

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
        msg!("Placing bet...");
        let escrowacc = &mut ctx.accounts.escrowaccount;

        // Optional: Check max bets limit
        if escrowacc.bets.len() >= BetEventInfo::MAX_BETS {
            return err!(ErrorCode::MaxBetsReached);
        }

          let ix = system_instruction::transfer(
        &ctx.accounts.user.key(),
        &ctx.accounts.escrow_vault.key(),
        2,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.escrow_vault.to_account_info(),
        ],
    )?;

    msg!("Payment completed!");
        // ctx.accounts.escrowaccount.escrow_account_ref

        //Check if bet placed successfully or not.
        

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

        msg!("Bet Placed!");
        Ok(())
    }
    
    

    

    // pub fn create_payment_receipt(
    //     ctx: Context<EscrowAccountState>,
    //     betslip_ref: Pubkey,
    //     amount: u64,
    // ) -> Result<()> {
    //     create_payment_receipt_p(
    //         ctx,
    //         betslip_ref,
    //         amount,
    //     )
    // }

    // pub fn payout_if_win(
    //     ctx: Context<PayoutIfWin>,
    //     correct_winner: bool,
    //     speculated_winner: bool,
    // ) -> Result<()> {
    //     payout_if_win_p(
    //         ctx,
    //         correct_winner,
    //         speculated_winner,
    //     )
    // }




    
}



#[derive(Accounts)]
pub struct InitializeBetEvent<'info> {
    #[account(init,
        payer=user, // who pays for creation of the account
        space=BetEventInfo::LEN+10,
        seeds=[b"initbet",user.key.as_ref()],
        bump
    )]
    pub event_info_account: Account<'info, BetEventInfo>,


    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
///account to store state of Bets and everything related to it.
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
    pub bump: u8,
    // pub total_bets:u64,
    // pub total_liquidity:u64,
    // pub total_users:u64,
    // pub total_winners:u64,
    // pub total_losers


    /// Address at which escrow account is created. 
    escrow_account_ref: Pubkey,
    escrow_account_ref_bump: u8,

    ///betting ratio of party A
    betting_ratio_a: f32,

    ///betting ratio of party B
    betting_ratio_b: f32,
    
    /// Name of the event
    event_name: String,
}

impl BetEventInfo {
    // pub const LEN: usize = 32+(8+1)+(8+1)+8+32+8+1+4+8;
    //one more byte for option and extra 8 bytes for discriminator

    /// Account size mapping in bytes.
    // pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + (45 * 1000);

    /// Maximum bets allowed per account.
    pub const MAX_BETS: usize = 6;

    /// discriminator(8)+pda(32)+liquidity_a(8)+liquidity_b(8)+idk(4)+betslips+bump(1)+escrow_account_ref(32)+escrow_account_ref_bump(1)
    /// +betting_ratio_a(2)+betting_ratio_b(2)+event_name(8)
    pub const LEN: usize = 8 // discriminator
        + 32
        + 8 
        + 8 
        + 8 
        + 1 
        +32 
        + 1
        + 4 
        + 4
        + 4
        + 8
        + (Self::MAX_BETS * BetSlip::LEN); // vec prefix + contents
}





/// Struct for each bet placed.
#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
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



/// Context parameter for placing a bet.
#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut, seeds = [b"initbet", user.key.as_ref()], bump = escrowaccount.bump)]
    pub escrowaccount: Account<'info, BetEventInfo>,

    /// CHECK: This is a raw account used to transfer lamports into it. It is expected to be a PDA owned by this program.
    #[account(mut)]
    pub escrow_vault:AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Error code for max no of bets
#[error_code]
pub enum ErrorCode {
    #[msg("Maximum number of bets reached.")]
    MaxBetsReached,
}
