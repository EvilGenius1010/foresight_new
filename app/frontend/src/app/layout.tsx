import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Poppins } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const poppinsRegular = Poppins({
  subsets: ["latin"],
  weight: "400",
});

import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

// const poppinsExtraLight = localFont({ src: "fonts/Poppins-ExtraLight.ttf" });

export const metadata: Metadata = {
  title: "Foresight",
  description: "Predict prices and win big!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-3xl ${inter.variable} ${grotesk.variable} font-sans `}
        // style={{backgroundImage:"url(/bg.png)",backgroundRepeat:"no-repeat",backgroundSize:"cover"}}
      >
        {children}
      </body>
    </html>
  );
}
