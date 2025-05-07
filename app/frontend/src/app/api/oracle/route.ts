import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getPythProgramKeyForCluster,
  PythHttpClient,
} from "@pythnetwork/client";

// const SOL_DEVNET_PRICE_FEED = new PublicKey(
//   "FsSMuFqHcSNCShU5oT9c7Hvf2XK3uXo6W9v3iY84DF1i",
// );

export async function POST() {
  const connection = new Connection("https://api.devnet.solana.com");
  const pythPublicKey = getPythProgramKeyForCluster("devnet");
  const pythClient = new PythHttpClient(connection, pythPublicKey);
  const data = await pythClient.getData();

  // Loop through products to find "Crypto.SOL/USD" (name can vary)
  const solProduct = data.products.find((product) =>
    product.symbol.includes("SOL/USD")
  );

  if (!solProduct) {
    return NextResponse.json(
      { error: "SOL/USD price feed not found." },
      { status: 404 }
    );
  }

  const priceData = data.productPrice.get(solProduct.priceAccountKey);

  if (!priceData?.price) {
    return NextResponse.json(
      { error: "Price not available yet." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    symbol: solProduct.symbol,
    price: parseFloat(priceData.price.toFixed(3)),
    confidence: priceData.confidence,
    timestamp: priceData.timestamp,
  });
}
