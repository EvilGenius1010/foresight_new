//
// import { ConfirmCookies } from "../../components/CookiesConfirm"
// import OngoingBetsDisplay from "../../components/OngoingBetsDisplay"
// import { poppinsRegular } from "./layout"
// import { Button } from "@/components/ui/button"
//
// export default function Home(){
//
//   return (
//     <>
//     <div className="container1 flex flex-col w-full mx-auto items-center justify-center my-36">
//       <div className={`text-8xl flex flex-col items-center justify-center ${poppinsRegular.className}`}>
//     <div >Predict.</div>
//     <div>Take a chance. </div>
//     <div>Win big.</div>
//         </div>
//         <div className="flex flex-row space-x-4">
//       <Button className="mt-6 max-w-fit">Get Started</Button>
//       <Button className="mt-6 max-w-fit">Create your own bets</Button>
//         </div>
//     </div>
//     <div>
//     </div>
//     <div>
//       <OngoingBetsDisplay/>
//     </div>
//       <div className="w-full mx-auto max-w-fit">
//       <ConfirmCookies/>
//       </div>
//     </>
//   )
// }

import Link from "next/link";
export default function Home() {
  return (<>
    <div className="bg-dark text-white min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <h1 className="font-grotesk text-2xl">Foresight</h1>
        <nav className="space-x-4 text-sm">
          <Link href="/bets" className="hover:underline">
            Bets
          </Link>
          <Link href="/simulatebet" className="hover:underline">
            Simulation
          </Link>
          {
            /*
          <Link href="#wallet" className="hover:underline">
            Wallet
          </a>
          */
          }
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center px-4 py-32">
        <h2 className="font-grotesk text-4xl md:text-6xl font-bold mb-4">
          Predict the Future. Earn the Present.
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join the smartest prediction market in Web3
        </p>
        <div className="flex flex-row justify-center space-x-4">
          <Link href="/bets">
          <button className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            Get Started
          </button>
          </Link>
        <Link href="/simulatebet">
          <button className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            Watch it Live
          </button>
        </Link>
        </div>
      </section>

      {/* Features */}
      <section id="markets" className="grid md:grid-cols-3 gap-6 px-6 py-16">


            <div
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-md"
              >
              <h3 className="font-grotesk text-2xl mb-2">Non Custodial Wallets</h3>
              <p className="text-sm text-gray-300">
                Funds are managed by code, not by us.
              </p>
            </div>

             <div
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-md"
              >
              <h3 className="font-grotesk text-2xl mb-2">Full Transparency</h3>
              <p className="text-sm text-gray-300">
                Anyone can audit the smart contracts and verify the results.
              </p>
              </div>

               <div
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-md"
              >
              <h3 className="font-grotesk text-2xl mb-2">Create your own bets</h3>
              <p className="text-sm text-gray-300">
                Create your own bets and earn money from them.
              </p>
            </div>
            




            
           
      </section>
{/* 

      <section id="testimonials" className="py-16 px-6">
        <h3 className="font-grotesk text-3xl text-center mb-10">
          What our users say
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
            key={i}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl text-sm text-gray-200"
              >
              <p>"This is the best prediction platform I've ever used!"</p>
              <p className="mt-4 text-right text-xs">– User #{i}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Footer */}
      <footer className="text-center p-6 text-gray-400 text-sm">
        &copy; 2025 Foresight. All rights reserved.
      </footer>
    </div>
              </>
  );
}
