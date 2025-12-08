"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

export default function ParkirLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <ParkirContent>{children}</ParkirContent>
      </div>
    </SidebarProvider>
  );
}

function ParkirContent({ children }) {
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
