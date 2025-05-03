import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
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

const poppinsExtraLight = localFont({ src: "fonts/Poppins-ExtraLight.ttf" });

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
        className={`${poppinsExtraLight.className} antialiased text-3xl `}
        // style={{backgroundImage:"url(/bg.png)",backgroundRepeat:"no-repeat",backgroundSize:"cover"}}
      >
        {children}
      </body>
    </html>
  );
}
