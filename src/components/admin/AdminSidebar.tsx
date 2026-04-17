"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  MessageSquare,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  user?: {
    email: string;
    role: string;
  };
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminSidebar = ({
  user,
  activeTab = "overview",
  onTabChange,
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "Overview", tab: "overview", icon: LayoutDashboard },
    { name: "Projects", tab: "projects", icon: FolderOpen },
    { name: "Skills", tab: "skills", icon: Wrench },
    { name: "Messages", tab: "messages", icon: MessageSquare },
    { name: "Chatbot", tab: "chatbot", icon: Bot },
    { name: "Settings", tab: "settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return "AD";
    return user.email.substring(0, 2).toUpperCase();
  };

  const sidebarContent = (
    <>
      {/* Header — Avatar + Title */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/80 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white leading-none">
              {getInitials()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-zinc-100 leading-tight truncate">
              Admin Panel
            </p>
            <p className="text-[9px] text-zinc-600 leading-tight truncate">
              Portfolio Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.tab;

          return (
            <button
              key={item.name}
              onClick={() => {
                onTabChange?.(item.tab);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all duration-150 ${
                active
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              <span className={active ? "font-medium" : "font-normal"}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-[11px] text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-150"
        >
          <LogOut size={14} strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar (animated) */}
      <motion.div
        initial={{ x: -200 }}
        animate={{ x: isOpen ? 0 : -200 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed inset-y-0 left-0 z-40 w-[180px] bg-[#0a0a0f] border-r border-white/[0.04] flex flex-col h-screen"
      >
        {sidebarContent}
      </motion.div>

      {/* Desktop sidebar (always visible, no animation) */}
      <div className="hidden lg:flex flex-col w-[180px] h-screen bg-[#0a0a0f] border-r border-white/[0.04]">
        {sidebarContent}
      </div>
    </>
  );
};

export default AdminSidebar;
