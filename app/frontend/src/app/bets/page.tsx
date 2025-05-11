"use client";
import { Card } from "../../components/ui/card";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import GlassMorphicCard from "../../../components/GlassCard";

// Transaction logic
async function sendSolTransaction(amountSol: number, toAddress: string) {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const provider = window.solana;
  if (!provider?.isPhantom) {
    alert("Phantom wallet not found!");
    return;
  }

  const resp = await provider.connect();
  const senderPublicKey = new PublicKey(resp.publicKey.toString());
  const recipientPublicKey = new PublicKey(toAddress);
  const lamports = amountSol * LAMPORTS_PER_SOL;

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: recipientPublicKey,
      lamports: lamports,
    }),
  );

  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.feePayer = senderPublicKey;

  const signed = await provider.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");

  console.log(
    `Transaction successful: https://explorer.solana.com/tx/${txid}?cluster=devnet`,
  );
}

export default function DisplayBets() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    try {
      const recipient = "5epLYAU4FioPvKZ8oZy91VsWRU25GEjBcBkUpjG4kPMP"; // Replace with actual devnet wallet
      await sendSolTransaction(5, recipient);
      setSuccess("Transaction sent!");
    } catch (err) {
      console.error("Transaction failed:", err);
      setSuccess("Transaction failed!");
    }
    setLoading(false);
  };

  return (
    <>
    <div className="flex flex-col w-screen pl-72">
      <h1 className="text-5xl pt-32">Available Bets</h1>
      <Card className="w-96 h-56 flex flex-col items-center justify-center m-10 shadow-lg p-4">
        <p className="text-xl mb-4">Bet Entry: 5 SOL</p>
        <button
          onClick={handlePayment}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
          {loading ? "Sending..." : "Enter Bet"}
        </button>
        {success && <p className="mt-3 text-green-500">{success}</p>}
      </Card>
          <div className="max-w-3xl">
      <GlassMorphicCard title="India v Pakistan" description="womp womp"/>
          </div>
          </div>
    </>
  );
}
// export default function DisplayBets() {
//   return (
//     <>
//       <h1 className="text-5xl absolute left-72 pt-32  ">Available Bets</h1>
//       <Card></Card>
//     </>
//   );
// }
