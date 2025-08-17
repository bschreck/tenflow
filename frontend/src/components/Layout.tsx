import { User, LogOut, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

export default function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
  };

  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/hero-placeholder.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* Global Overlay Gradient */}
      <div className="fixed inset-0 z-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      {/* App Content */}
      <div className="relative z-10 min-h-screen">
      {/* Top Navigation Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 lg:px-8",
        isDashboard ? "bg-transparent" : "bg-black/80 backdrop-blur-md border-b border-white/20"
      )}>
        {/* Logo - Left Side */}
        <Link to="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">
            Tenflow
          </span>
        </Link>

        {/* Profile Section - Right Side */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/10 text-white"
            >
              {/* Profile Photo Placeholder */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
                <span className="text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Name - Hidden on small screens */}
              <span className="hidden md:block text-sm font-medium">
                {user?.full_name || user?.email?.split('@')[0]}
              </span>
              
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProfileDropdownOpen(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-20">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="pt-16">
        <main className={cn(
          location.pathname === "/" 
            ? "" 
            : "p-4 lg:p-8 bg-black/20 backdrop-blur-sm min-h-screen text-white"
        )}>
          <Outlet />
        </main>
      </div>
      </div>
    </div>
  );
}
