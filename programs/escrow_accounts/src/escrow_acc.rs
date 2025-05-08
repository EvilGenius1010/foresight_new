use anchor_lang::prelude::*;

use crate::BetSlip;

#[account]
pub struct PaymentReceipt {
    /// User who made the payment
    pub better: Pubkey,
    /// Amount paid in lamports
    pub amount: u64,
    /// Pointer to the external BetSlip account
    pub betslip_ref: Pubkey,
    /// Whether payout was completed
    pub is_paid: bool,
    /// Bump seed for PDA
    pub bump: u8,
}
/// discriminator(8)+Pubkey(32)+amount(8)+reference(32)+paid(1)+bump(1) and 10 entries
impl PaymentReceipt {
    pub const LEN: usize = 10 * (8 + 32 + 8 + 32 + 1 + 1); // Discriminator + fields
}

#[derive(Accounts)]
#[instruction(betslip_ref: Pubkey)]
pub struct EscrowAccountState<'info> {
    #[account(
        init,
        payer = user,
        space = PaymentReceipt::LEN,
        seeds = [b"payment", user.key().as_ref(), betslip_ref.as_ref()],
        bump
    )]

    /// BetSlip reference
    pub betslip: Account<'info, BetSlip>,

    /// Payment receipt account
    pub payment_receipt: Account<'info, PaymentReceipt>,

    //why?
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Payment receipt is created.
pub fn create_payment_receipt_p(
    ctx: Context<EscrowAccountState>,
    betslip_ref: Pubkey,
    amount: u64,
) -> Result<()> {
    let receipt = &mut ctx.accounts.payment_receipt;
    receipt.better = ctx.accounts.user.key();
    receipt.amount = amount;
    receipt.betslip_ref = betslip_ref;
    receipt.is_paid = false;
    receipt.bump = ctx.bumps.betslip;
    Ok(())
}

#[derive(Accounts)]
#[instruction(betslip_ref: Pubkey)]
pub struct PayoutIfWin<'info> {
    #[account(
        mut,
        seeds = [b"payment", better.key().as_ref(), betslip_ref.as_ref()],
        bump = payment_receipt.bump,
        has_one = better,
        has_one = betslip_ref
    )]
    pub payment_receipt: Account<'info, PaymentReceipt>,

    /// CHECK: Escrow vault holding funds (must be a system account)
    #[account(mut)]
    pub escrow_vault: AccountInfo<'info>,

    #[account(mut)]
    pub better: Signer<'info>,
}

pub fn payout_if_win_p(
    ctx: Context<PayoutIfWin>,
    correct_winner: bool,
    speculated_winner: bool,
) -> Result<()> {
    let receipt = &mut ctx.accounts.payment_receipt;

    let mut i = 0;

    while i < 5 {
        if receipt.is_paid {
            return err!(EscrowError::AlreadyPaid);
        }

        if correct_winner == speculated_winner {
            **ctx
                .accounts
                .escrow_vault
                .to_account_info()
                .try_borrow_mut_lamports()? -= receipt.amount;
            **ctx
                .accounts
                .better
                .to_account_info()
                .try_borrow_mut_lamports()? += receipt.amount;
            receipt.is_paid = true;
        }
        i = i + 1;
    }
    Ok(())
}

#[error_code]
pub enum EscrowError {
    #[msg("User has already been paid.")]
    AlreadyPaid,
}




