import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import BetSimulateSidebar from "../../../components/BetSimulateSidebar.tsx";
import React from "react";
export default function BetSimulationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <BetSimulateSidebar />
        <main className="flex-1 flex justify-center items-center">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
