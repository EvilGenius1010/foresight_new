import { SidebarProvider } from "@/components/ui/sidebar";
import BetSimulateSidebar from "../../../components/BetSimulateSidebar";
import React from "react";

export default function BetSimulationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Here's the sidebar */}
        <BetSimulateSidebar  />

        {/* Main content */}
        <main className="flex-1 flex justify-center items-center">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
