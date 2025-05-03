"use client";
import BetSimulateCard from "../../../components/BetSimulate";
import { Button } from "@/components/ui/button";
import { TutorialA } from "../../../components/BetSimulate";

import dynamic from "next/dynamic";
import { useSidebar } from "../../components/ui/sidebar.tsx";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function SimulateBet() {
  const { toggleSidebar } = useSidebar();
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
    <div className="container2 flex flex-col w-full mx-auto items-center">
      <h1 className="first-step">Simulator</h1>
      <p>This is a simulation of how the betting system is designed</p>
      <p>in this website.</p>
      <h3>
        <strong>It does not use real money.</strong>
      </h3>

      <BetSimulateCard />
      <div className="flex flex-row space-x-2 pt-8">
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
      <Joyride steps={steps} />
    </div>
  );
}
