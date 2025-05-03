import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export default function BetSimulateSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="bg-slate-800" />
      <SidebarContent className="bg-blue-700">
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      daskans
      <SidebarFooter />
    </Sidebar>
  );
}
