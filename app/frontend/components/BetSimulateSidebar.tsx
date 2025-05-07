"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "../src/components/ui/card.tsx";
import { useBetStats } from "../src/store/SimulationState.tsx";

export default function BetSimulateSidebar({
  bets,
}: {
  bets: BetCardStruct[];
}) {
  const placedBets = useBetStats((state) => state.placedBets);

  return (
    <Sidebar>
      <SidebarHeader className="bg-slate-800" />
      <SidebarContent className="bg-blue-700">
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
      <Card>
        <CardContent className="grid-cols-2 gap-2 space-x-2">
          <div>{props.event}</div>
          <div>{props.amount}</div>
          <div>{props.name}</div>
          <div>{props.party}</div>
        </CardContent>
      </Card>
    </>
  );
}
