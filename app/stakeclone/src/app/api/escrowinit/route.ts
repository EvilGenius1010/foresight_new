import type { NextApiRequest, NextApiResponse } from 'next';
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NonCustodialEscrow } from "../../../../../../target/types/non_custodial_escrow";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as NonCustEsc from   '../../../../../../target/idl/non_custodial_escrow.json';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { BN } from 'bn.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = new anchor.web3.Connection("http://127.0.0.1:8899");
    const keypair = Keypair.fromSecretKey(Uint8Array.from([240,40,234,87,90,229,129,70,138,174,24,195,89,130,141,16,129,199,46,178,214,19,19,8,212,63,186,73,48,104,52,106,250,224,243,107,224,188,154,181,39,221,195,93,85,102,235,43,135,85,101,107,175,66,110,41,161,30,216,228,5,232,135,124]));
    const wallet = new NodeWallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(provider);

    const program = new anchor.Program<NonCustodialEscrow>(NonCustEsc as NonCustodialEscrow,provider);

    const tx = await program.methods.placeBet(1.2, true, new BN(140000000),wallet.publicKey)
      .accounts({
        user: wallet.publicKey,
      })
      .rpc();

    console.log("Transaction signature", tx);
    return NextResponse.json({ transactionHash: tx });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
