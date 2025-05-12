"use client";
import BetSimulateCard from "../../../components/BetSimulate";
import { Button } from "@/components/ui/button";
// import { TutorialA } from "../../../components/BetSimulate";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useSidebar } from "../../components/ui/sidebar";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function SimulateBet() {
  const { open, toggleSidebar } = useSidebar();
  const steps = [
    {
      target: ".first-step",
      content: "Welcome to the demo for this website!",
      disableBeacon: true,
    },
    {
      target: ".second-step",
      content: "These are the teams competing in the match",
    },
    {
      target: ".third-step",
      content: "This number is the total money being bet on the game.",
    },
    {
      target: ".fourth-step",
      content:
        "These buttons are responsible for choosing which teams to bet on.",
    },
    {
      target: ".fifth-step",
      content: "This shows your bet history.",
    },
    {
      target: ".sixth-step",
      content: "This shows all the bets happening with this event.",
    },
    {
      target: ".se-step",
      content: "This is the screen where we will complete placing the bet.",
    },
    {
      target: ".six0th-step",
      content: "Here, you can view the bets placed.",
    },
  ];

  return (
    <main
      className={clsx(
        "transition-transform duration-300 ease-in-out w-full min-h-screen px-4 md:px-8",
        open && "translate-x-[50px]"
      )}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-6 text-center">
        {/* Heading */}
        <h1 className="first-step text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Simulator
        </h1>
        <p className="text-base md:text-lg text-gray-300">
          This is a simulation of how the betting system is designed on this website.
        </p>
        <p className="text-base md:text-lg text-gray-400">
          <strong className="text-yellow-400">It does not use real money.</strong>
        </p>


        {/* Simulation Card */}
        <div className="w-full">
          <BetSimulateCard />
        </div>

        {/* Button Row */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button
            variant="outline"
            className="fifth-step"
            onClick={toggleSidebar}
          >
            Your Bets
          </Button>
          <Button
            variant="outline"
            className="sixth-step"
            onClick={toggleSidebar}
          >
            Incoming Bets
          </Button>
        </div>
      </div>

      <Joyride steps={steps} />
    </main>
  );
}
