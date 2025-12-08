"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

export default function TicketLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <TicketContent>{children}</TicketContent>
      </div>
    </SidebarProvider>
  );
}

function TicketContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      <Header />
      <main className="pt-16">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
