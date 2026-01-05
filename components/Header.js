"use client";

import { Search, Bell, ChevronDown, Menu, User, LogOut } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");

    // Redirect to login page
    router.push("/");
  };

  return (
    <header
      className={`
        h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8
        fixed top-0 right-0 z-20 transition-all duration-300
        ${isCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"}
      `}
    >
      {/* Left side - Mobile menu button */}
      <div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side - User dropdown */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {userName}
          </span>
          <ChevronDown
            size={16}
            className={`hidden md:block transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">
                {localStorage.getItem("userUsername")}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
