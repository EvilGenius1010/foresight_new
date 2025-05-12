
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "@/../escrow_accounts.json"; // Your program's IDL

import fs from "fs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
const secretKey = Uint8Array.from(
fs.readFileSync(process.env.WALLET_PATH!, "utf-8")
);
// const secretKey  = Uint8Array.from("WuvGjyPLVU5ET5MmoXojKpRDtR34RufFeBTcxoFK2QWn4BJ4KZ7yZNJaif7CnUmqfpLRZjqyepwBG24aXkT1STP7");
const walletKeypair = anchor.web3.Keypair.fromSecretKey(secretKey);

const PROGRAM_ID = new PublicKey("2J8ZgvrSQiddmh39LYKBWd2anHttAd7BKV9JhYjVonAH");
const ESCROW_ACCOUNT_PDA = new PublicKey("..."); // Generate this dynamically if needed
const ESCROW_VAULT_PDA = new PublicKey("...");

const connection = new Connection("https://api.devnet.solana.com");


const provider = new anchor.AnchorProvider(connection, {
  publicKey: walletKeypair.publicKey,
 signTransaction: async (tx: anchor.web3.Transaction) => {
  tx.partialSign(walletKeypair);
  return tx;
},
signAllTransactions: async (txs: anchor.web3.Transaction[]) => {
  return txs.map(tx => {
    tx.partialSign(walletKeypair);
    return tx;
  });
},

} as anchor.Wallet, {});


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
/// All fine
const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);



    const body = await req.json();
    const { bettingRatio, speculatedWinner, amount, userPubkey } = body;

    await program.methods.placeBet(bettingRatio, speculatedWinner, amount, new PublicKey(userPubkey))
      .accounts({
        escrowAccount: ESCROW_ACCOUNT_PDA,
        escrowVault: ESCROW_VAULT_PDA,
        user: new PublicKey(userPubkey),
      })
      .rpc();

    return NextResponse.json({ message: "Bet placed successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: `Error is ${error}` }, { status: 500 });
  }
}