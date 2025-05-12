"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBetStats } from "@/store/SimulationState";
import { Info } from "lucide-react";

export default function BetSimulateCard() {
  const [cards, setCards] = useState<BetCardStruct[]>([]);
  const bettingratioA = useBetStats.getState().bettingRatioA;
  const balanceA = useBetStats.getState().balanceA;
  const isMature = useBetStats.getState().isMature;
  const bettingratioB = useBetStats.getState().bettingRatioB;
  const balanceB = useBetStats.getState().balanceB;
  const setBalanceA = useBetStats((state) => state.setBalanceA);
  const setBalanceB = useBetStats((state) => state.setBalanceB);
  const setBettingRatioA = useBetStats((state) => state.setBettingRatioA);
  const setBettingRatioB = useBetStats((state) => state.setBettingRatioB);
  const setPlacedBets = useBetStats((state) => state.setPlacedBets);

  function PlaceBets() {
    const betOn = Math.round(Math.random()) == 1 ? "A" : "B";
    console.log(betOn);
    const betAmount = Math.random().toFixed(6) +
      Math.pow(10, Math.round(Math.random()));

    const newBet: BetCardStruct = {
      name: "AnonUser", // You can make this dynamic
      amount: Number(betAmount),
      event: "IND v PAK",
      party: betOn === "A" ? "India" : "Pakistan",
    };

    setCards((prev) => [newBet, ...prev]); // Prepend to show latest first
    console.log(newBet);
    if (betOn == "A") {
      // console.log(balanceA, " is balanceA");
      setBalanceA(
        Number((Number(useBetStats.getState().balanceA) + Number(betAmount)).toFixed(
          6,
        )),
      );

      setPlacedBets(newBet);

      if (
        useBetStats.getState().balanceB !== 0 &&
        useBetStats.getState().balanceA !== 0
      ) {
        setBettingRatioA(
          Math.max(Number(Number(
            (useBetStats.getState().balanceA) /
              useBetStats.getState().balanceB,
          ).toFixed(2)),1)
        );
      }
    } else {
      console.log(balanceB, " is balanceB");
      setBalanceB(
        Number((Number(useBetStats.getState().balanceB) + Number(betAmount)).toFixed(
          6,
        )),
      );

      if (
        useBetStats.getState().balanceB !== 0 &&
        useBetStats.getState().balanceA !== 0
      ) {
        setBettingRatioB(
          Math.max(Number((useBetStats.getState().balanceB /useBetStats.getState().balanceA).toFixed(2)),1)
        );
      }
    }

    return (
      <div className="w-full">
        <BetSimulateSidebar />
      </div>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      PlaceBets();
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between space-x-2">
            <div></div>
            <div className="second-step">IND v PAK</div>
            <Info />
          </div>
        </CardTitle>
        {/* <CardDescription>This is a</CardDescription> */}
      </CardHeader>
      <CardContent className="text-center ">
        <div className="mb-4">Winner(inc. Super Over)</div>

        <div className="flex flex-row space-x-4 fourth-step">
          <div className="flex flex-col space-y-2">
            <Button variant={"outline"} className="w-48 text-left ">
              India <br />
              {bettingratioA}
            </Button>
          </div>
          <Button variant={"outline"} className="w-48 text-left">
            Pakistan <br />
            {bettingratioB}
          </Button>
          {/*<PlaceBet />*/}
          <div className="flex flex-col space-x-2">
            {balanceA} &nbsp;
            {balanceB}
          </div>
        </div>
      </CardContent>
      {
        /* <CardFooter>
    <p>Card Footer</p>
  </CardFooter> */
      }
    </Card>
  );
}

export function PlaceBet() {
  const [betLamports, setBetLamports] = useState<number | null>(null);
  useEffect(() => {
    setBetLamports(Number(Math.random().toFixed(6)));
    console.log(betLamports);
  }, []);

  if (betLamports === null) return null;
  return <div className="third-step">{betLamports}</div>;
}

import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import BetSimulateSidebar, { BetCardStruct } from "./BetSimulateSidebar";

interface TutorialProps {
  steps: Step[];
}

export const TutorialA: React.FC<TutorialProps> = ({ steps }) => {
  const [run, setRun] = useState(true);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          arrowColor: "#e3ffeb",
          backgroundColor: "#e3ffeb",
          primaryColor: "#000",
          textColor: "#004a14",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};
