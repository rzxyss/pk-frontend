"use client";

import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <header
      className={`
        h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8
        fixed top-0 right-0 z-20 transition-all duration-300
        ${isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"}
      `}
    >
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
