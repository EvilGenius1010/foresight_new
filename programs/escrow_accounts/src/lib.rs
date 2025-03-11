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

declare_id!("3FXN3qAS7d2SLm653Q3SW46p3qExwnmLozoDufTMAvLf");


#[program]
mod non_custodial_escrow{
    use super::*;
   pub fn initialize(ctx:Context<InitializeEscrow>,event_name:String,)->Result<()>{


    msg!("Escrow Account creation started!");
    let escrow_account = &mut ctx.accounts.escrowaccount;

        escrow_account.pda = escrow_account.key();
        escrow_account.liquidity_a = 10.0;
        escrow_account.liquidity_b = 20.0;
        // escrow_account.total_bets = 0;
        // escrow_account.bets = Vec::new();
    msg!("Created escrow_accounts' address is {}",escrow_account.key());
    // escrow_account.authority = ctx.accounts.user.key();
    Ok(())
}

    pub fn place_bet(ctx:Context<InitializeEscrow>,betting_ratio:f32,speculated_winner:bool,amount:f64,sender_addr:Pubkey)->Result<()>{
        msg!("Bet Placed!");
        // let escrow_account = &mut ctx.accounts.global_state;
        let escrowacc = &mut ctx.accounts.escrowaccount;
        escrowacc.bets.push(BetSlip{
            better:sender_addr,
            amount:amount,
            speculated_winner:speculated_winner,
            betting_ratio:betting_ratio
        });

        if speculated_winner == true{
            escrowacc.liquidity_a = escrowacc.liquidity_a+amount;
            // escrowacc.liquidity_b = Some(escrowacc.liquidity_b.unwrap()-amount);
        }else{
            escrowacc.liquidity_b = escrowacc.liquidity_b+amount;
            // escrowacc.liquidity_a = Some(escrowacc.liquidity_a.unwrap()-amount);
        }
        

        // // msg!("Bet Placed! and updated the escrow account with bets are {}",escrowacc.bets.len());
        msg!("Liquidity A is {}",escrowacc.liquidity_a);
        msg!("Liquidity B is {}",escrowacc.liquidity_b);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info>{
    #[account(init,
        payer=user, // who pays for creation of the account
        space=EscrowAccountState::LEN,
        seeds=[b"s93koco2lfwojd231",user.key.as_ref()],
        bump
    )]
    pub escrowaccount:Account<'info,EscrowAccountState>,
    #[account(mut)]
    pub user:Signer<'info>,
    pub system_program:Program<'info,System>,
}

#[account]

pub struct EscrowAccountState{
    pub pda:Pubkey,
    pub liquidity_a:f64,
    pub liquidity_b:f64,
    pub total_bets:u64,
    pub bets:Vec<BetSlip>,
    // pub total_bets:u64,
    // pub total_liquidity:u64,
    // pub total_users:u64,
    // pub total_winners:u64,
    // pub total_losers
    }

#[account]
pub struct BetSlip{
    better:Pubkey,
    amount:f64,
    speculated_winner:bool,
    betting_ratio:f32
}

impl EscrowAccountState{
    // pub const LEN: usize = 32+(8+1)+(8+1)+8+32+8+1+4+8;
    //one more byte for option and extra 8 bytes for discriminator
    pub const LEN: usize = 32+8+8+8+8+(45*1000);
}