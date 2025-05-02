"use client"

import { Button } from "@/components/ui/button"
import { useEffect,useState } from "react"

import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useBetStats } from "@/store/SimulationState"
import { Info } from "lucide-react"



export default function BetSimulateCard(){

  const bettingratioA = useBetStats((state) => state.bettingRatioA)
  const balanceA = useBetStats((state) => state.balanceA)
  const isMature = useBetStats((state) => state.isMature)
  const bettingratioB = useBetStats((state) => state.bettingRatioB)
  const balanceB = useBetStats((state) => state.balanceB)


    return(
    <Card >
  <CardHeader>
  <CardTitle >
    <div className="flex flex-row justify-between space-x-2">
      <div></div>
    <>IND v PAK</>
    <Info/>
    </div>
    </CardTitle>
    {/* <CardDescription>This is a</CardDescription> */}
  </CardHeader>
  <CardContent className="text-center ">
  
  <div className="mb-4">Winner(inc. Super Over)</div>

    <div className="flex flex-row space-x-4">
      <div className="flex flex-col space-y-2">
      <Button variant={"outline"} className="w-48 text-left ">India <br/> 
      {bettingratioA}
      </Button>
      
      </div>
      <Button variant={"outline"} className="w-48 text-left">Pakistan <br/> 
      {bettingratioB}
      </Button>
      <PlaceBet/>
    </div>
  </CardContent>
  {/* <CardFooter>
    <p>Card Footer</p>
  </CardFooter> */}
</Card>
    )


}

export function PlaceBet() {
  const [betLamports, setBetLamports] = useState<number|null>(null);
  useEffect(() => {
    setBetLamports(Math.random());
    console.log("daksldasl")
    console.log(betLamports);
  }, []);

  if (betLamports === null) return null;
  return <>{betLamports}</>;
}

import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface TutorialProps {
  steps: Step[];
}

export const TutorialA: React.FC<TutorialProps> = ({ steps }) => {
  const [run, setRun] = useState(true);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
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
          arrowColor: '#e3ffeb',
          backgroundColor: '#e3ffeb',
          primaryColor: '#000',
          textColor: '#004a14',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};


