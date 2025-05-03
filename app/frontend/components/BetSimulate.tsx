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
  const bettingratioA = useBetStats((state) => state.bettingRatioA);
  const balanceA = useBetStats((state) => state.balanceA);
  const isMature = useBetStats((state) => state.isMature);
  const bettingratioB = useBetStats((state) => state.bettingRatioB);
  const balanceB = useBetStats((state) => state.balanceB);
  const setBalanceA = useBetStats((state) => state.setBalanceA);
  const setBalanceB = useBetStats((state) => state.setBalanceB);

  useEffect(() => {
    const interval = setInterval(() => {
      PlaceBets();
    }, 400);
    return () => clearInterval(interval);
  }, []);

  function PlaceBets() {
    const betOn = Math.round(Math.random()) == 1 ? "A" : "B";
    const betAmount = Math.random().toFixed(6) +
      Math.pow(10, Math.round(Math.random()));
    if (betOn === "A") {
      setBalanceA(
        (Number(useBetStats.getState().balanceA) + Number(betAmount)).toFixed(
          6,
        ),
      );
    } else {
      setBalanceB(
        (Number(useBetStats.getState().balanceB) + Number(betAmount)).toFixed(
          6,
        ),
      );
    }
  }

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
            {/*{balanceA}*/}
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
