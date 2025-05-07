// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { StakeProgram } from "../target/types/stake_program";
//
// describe("stake_program", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());
//
//   const program = anchor.workspace.StakeProgram as Program<StakeProgram>;
//
//   it("Is initialized!", async () => {
//     // Add your test here.
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("escrow_accounts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.EscrowAccounts as Program<any>;

  let escrowAccountPda: PublicKey;
  let bump: number;

  const user = provider.wallet;

  before(async () => {
    [escrowAccountPda, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("s93koco2lfwojd231"), user.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes the escrow account", async () => {
    await program.methods
      .initialize("Test Event", bump)
      .accounts({
        escrowaccount: escrowAccountPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([]) // only uses wallet
      .rpc();

    const escrowData = await program.account.escrowAccountState.fetch(
      escrowAccountPda
    );

    console.log("Escrow PDA:", escrowAccountPda.toBase58());
    console.log("Escrow Data:", escrowData);

    assert.equal(escrowData.liquidityA, 10.0);
    assert.equal(escrowData.liquidityB, 20.0);
  });

  it("Places a bet on A", async () => {
    await program.methods
      .placeBet(1.5, true, 2.0, user.publicKey)
      .accounts({
        escrowaccount: escrowAccountPda,
        user: user.publicKey,
      })
      .signers([])
      .rpc();

    const escrowData = await program.account.escrowAccountState.fetch(
      escrowAccountPda
    );

    console.log("Liquidity A:", escrowData.liquidityA);
    console.log("Liquidity B:", escrowData.liquidityB);
    console.log("Total Bets:", escrowData.bets.length);

    assert.equal(escrowData.liquidityA, 12); // 10.0 + 2
    assert.equal(escrowData.bets.length, 1);
  });
});
