import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { assert } from "chai";
import { EscrowAccounts } from "../target/types/escrow_accounts";

describe("escrow_acc", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.EscrowAccounts as Program<EscrowAccounts>;

  let user: Keypair;
  let escrowVault: Keypair;
  let betslip: Keypair;
  let paymentReceipt: PublicKey;
  let bump: number;

  before(async () => {
    // Airdrop SOL to the provider's wallet
    await provider.connection.requestAirdrop(
      provider.wallet.publicKey,
      2 * LAMPORTS_PER_SOL,
    );

    // Initialize user and airdrop SOL
    user = Keypair.generate();
    await provider.connection.requestAirdrop(
      user.publicKey,
      2 * LAMPORTS_PER_SOL,
    );

    // Initialize escrow vault and airdrop SOL
    escrowVault = Keypair.generate();
    await provider.connection.requestAirdrop(
      escrowVault.publicKey,
      2 * LAMPORTS_PER_SOL,
    );

    // Create a dummy BetSlip account
    betslip = Keypair.generate();
    const betslipSize = 8 + 32 + 8 + 1 + 4; // Adjust based on your BetSlip struct
    const betslipLamports = await provider.connection
      .getMinimumBalanceForRentExemption(betslipSize);

    const tx = new anchor.web3.Transaction();
    tx.add(
      SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: betslip.publicKey,
        lamports: betslipLamports,
        space: betslipSize,
        programId: program.programId,
      }),
    );
    await provider.sendAndConfirm(tx, [betslip]);

    // Derive the PDA for PaymentReceipt
    [paymentReceipt, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("payment"),
        user.publicKey.toBuffer(),
        betslip.publicKey.toBuffer(),
      ],
      program.programId,
    );
  });

  it("should create a payment receipt", async () => {
    const amount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);

    await program.methods
      .createPaymentReceipt(betslip.publicKey, amount)
      .accounts({
        paymentReceipt,
        user: user.publicKey,
        betslip: betslip.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const receiptAccount = await program.account.paymentReceipt.fetch(
      paymentReceipt,
    );
    assert.ok(receiptAccount.better.equals(user.publicKey));
    assert.equal(receiptAccount.amount.toNumber(), amount.toNumber());
    assert.ok(receiptAccount.betslipRef.equals(betslip.publicKey));
    assert.equal(receiptAccount.isPaid, false);
  });

  it("should payout if the user won", async () => {
    const correctWinner = true;
    const speculatedWinner = true;

    // Fund the escrow vault with the bet amount
    const amount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);
    const tx = new anchor.web3.Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: escrowVault.publicKey,
        lamports: amount.toNumber(),
      }),
    );
    await provider.sendAndConfirm(tx, []);

    const userBalanceBefore = await provider.connection.getBalance(
      user.publicKey,
    );
    const escrowBalanceBefore = await provider.connection.getBalance(
      escrowVault.publicKey,
    );

    await program.methods
      .payoutIfWin(betslip.publicKey, correctWinner, speculatedWinner)
      .accounts({
        paymentReceipt,
        escrowVault: escrowVault.publicKey,
        better: user.publicKey,
      })
      .signers([user])
      .rpc();

    const userBalanceAfter = await provider.connection.getBalance(
      user.publicKey,
    );
    const escrowBalanceAfter = await provider.connection.getBalance(
      escrowVault.publicKey,
    );

    assert.ok(userBalanceAfter > userBalanceBefore);
    assert.ok(escrowBalanceAfter < escrowBalanceBefore);

    const receiptAccount = await program.account.paymentReceipt.fetch(
      paymentReceipt,
    );
    assert.equal(receiptAccount.isPaid, true);
  });

  it("should not payout if the user lost", async () => {
    // Reset the payment receipt
    const amount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);
    [paymentReceipt, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("payment"),
        user.publicKey.toBuffer(),
        betslip.publicKey.toBuffer(),
      ],
      program.programId,
    );

    await program.methods
      .createPaymentReceipt(betslip.publicKey, amount)
      .accounts({
        paymentReceipt,
        user: user.publicKey,
        betslip: betslip.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const correctWinner = false;
    const speculatedWinner = true;

    const userBalanceBefore = await provider.connection.getBalance(
      user.publicKey,
    );
    const escrowBalanceBefore = await provider.connection.getBalance(
      escrowVault.publicKey,
    );

    await program.methods
      .payoutIfWin(betslip.publicKey, correctWinner, speculatedWinner)
      .accounts({
        paymentReceipt,
        escrowVault: escrowVault.publicKey,
        better: user.publicKey,
      })
      .signers([user])
      .rpc();

    const userBalanceAfter = await provider.connection.getBalance(
      user.publicKey,
    );
    const escrowBalanceAfter = await provider.connection.getBalance(
      escrowVault.publicKey,
    );

    assert.equal(userBalanceAfter, userBalanceBefore);
    assert.equal(escrowBalanceAfter, escrowBalanceBefore);

    const receiptAccount = await program.account.paymentReceipt.fetch(
      paymentReceipt,
    );
    assert.equal(receiptAccount.isPaid, false);
  });

  it("should not allow double payout", async () => {
    const correctWinner = true;
    const speculatedWinner = true;

    try {
      await program.methods
        .payoutIfWin(betslip.publicKey, correctWinner, speculatedWinner)
        .accounts({
          paymentReceipt,
          escrowVault: escrowVault.publicKey,
          better: user.publicKey,
        })
        .signers([user])
        .rpc();
      assert.fail("Expected error for already paid receipt");
    } catch (err) {
      const errMsg = "User has already been paid.";
      assert.equal(err.error.errorMessage, errMsg);
    }
  });
});
