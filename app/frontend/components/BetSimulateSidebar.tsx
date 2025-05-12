"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "../src/components/ui/card";
import { useBetStats } from "../src/store/SimulationState";


export default function BetSimulateSidebar() {
  const placedBets = useBetStats((state) => state.placedBets);


  return (

    <Sidebar className="mx-48">
      <SidebarHeader  />
      <SidebarContent >
        <SidebarGroup />
        <SidebarGroup />
        {placedBets.map((bet, index) => (
          <NewBetCard
            key={index}
            props={placedBets[placedBets.length - 1 - index]}
          />
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export type BetCardStruct = {
  name: string;
  amount: number;
  event: string;
  party: string;
};

export function NewBetCard({ props }: Readonly<{ props: BetCardStruct }>) {
  return (
    <>
      <Card className="p-6 text-white rounded-2xl bg-white/10 backdrop-blur-[12px] border border-white/10 shadow-md" style={{WebkitBackdropFilter: "blur(10px)"}}>
        <CardContent >
          <div>{props.event}</div>
          <div>{props.amount}</div>
          <div>{props.name}</div>
          <div>{props.party}</div>
        </CardContent>
      </Card>
    </>
  );
}
