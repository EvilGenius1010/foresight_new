

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowAccounts } from "../target/types/escrow_accounts";
import { assert } from "chai";
import { SystemProgram,PublicKey } from "@solana/web3.js";

describe("escrow_accounts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.EscrowAccounts as Program<EscrowAccounts>;
  const user = provider.wallet;

  let escrowAccountPDA: PublicKey;
  let escrowVaultPDA: PublicKey;
  let placeBetPDA: PublicKey;
  let bump: number;
  let vaultBump: number;

  before(async () => {
    [escrowAccountPDA, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("initbet"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("Escrow Account PDA: ", escrowAccountPDA.toString());

    [escrowVaultPDA, vaultBump] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_vault"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("Escrow Vault PDA: ", escrowVaultPDA.toString());

    [placeBetPDA, ] = await PublicKey.findProgramAddressSync(
      [Buffer.from("initbet"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("Place Bet PDA: ", placeBetPDA.toString());

    await program.methods.initialize("TestEvent",)
      .accounts({
        event_info_account: escrowAccountPDA,
        user: user.publicKey,
        systemProgram: SystemProgram.programId
      })
      .rpc();

    const escrowAccount = await program.account.betEventInfo.fetch(escrowAccountPDA);
    
  });

  

  it("Initializes a new escrow account", async () => {

    const escrowAccount = await program.account.betEventInfo.fetch(escrowAccountPDA);
    
    assert.ok(escrowAccount.pda.equals(escrowAccountPDA));
    assert.equal(escrowAccount.liquidityA, 10.0);
    assert.ok(escrowAccount.escrowAccountRef.equals(escrowVaultPDA));
  });

  it("Places a bet successfully", async () => {
    const bettingRatio = 1.5;
    const speculatedWinner = true;
    const amount = 5.0;

    // Fund escrow vault first
    const fundTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: user.publicKey,
        toPubkey: escrowVaultPDA,
        lamports: anchor.web3.LAMPORTS_PER_SOL // 1 SOL
      })
    );
    await provider.sendAndConfirm(fundTx);

    await program.methods.placeBet(
      bettingRatio,
      speculatedWinner,
      amount,
      user.publicKey
    )
    .accounts({
      escrowAccount: placeBetPDA,
      SystemProgram: SystemProgram.programId,
      escrowVault: escrowVaultPDA,
      user: user.publicKey
    })
    .rpc();

    const updatedAccount = await program.account.betEventInfo.fetch(escrowAccountPDA);
    assert.equal(updatedAccount.bets.length, 1);
    assert.equal(updatedAccount.liquidityA, 15.0);
  });
});
