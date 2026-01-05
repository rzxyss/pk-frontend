"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParkirLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token found
      router.push("/");
    }
  }, [router]);

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
