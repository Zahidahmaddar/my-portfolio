"use client";

import { useState } from "react";
import {
  Bot,
  ExternalLink,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { AdminTab } from "./types";

interface AdminSidebarProps {
  email: string;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  awaitingReply: number;
}

const MENU_ITEMS: { name: string; tab: AdminTab; icon: typeof Bot }[] = [
  { name: "Overview", tab: "overview", icon: LayoutDashboard },
  { name: "Projects", tab: "projects", icon: FolderOpen },
  { name: "Skills", tab: "skills", icon: Wrench },
  { name: "Messages", tab: "messages", icon: MessageSquare },
  { name: "Chatbot", tab: "chatbot", icon: Bot },
  { name: "Settings", tab: "settings", icon: Settings },
];

export default function AdminSidebar({
  email,
  activeTab,
  onTabChange,
  awaitingReply,
}: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE", credentials: "include" });
    } finally {
      window.location.assign("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-2 bg-surface border-b border-line">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="icon-btn"
        >
          <Menu size={18} />
        </button>
        <span className="font-semibold">Portfolio admin</span>
        <ThemeToggle />
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 on-band w-60 flex flex-col bg-band text-on-band transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "max-lg:invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 pl-5 pr-2">
          <span className="font-semibold tracking-tight">Portfolio admin</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="icon-btn lg:hidden"
          >
            <X size={16} />
          </button>
          <ThemeToggle className="hidden lg:inline-flex" />
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => {
                  onTabChange(item.tab);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-on-band"
                    : "text-on-band-muted hover:bg-white/10 hover:text-on-band"
                }`}
              >
                <Icon size={16} className={active ? "text-saffron" : undefined} />
                <span className="flex-1 text-left">{item.name}</span>
                {item.tab === "messages" && awaitingReply > 0 && (
                  <span
                    aria-label={`${awaitingReply} awaiting a reply`}
                    className="min-w-5 px-1.5 rounded-full bg-saffron text-on-saffron text-xs leading-5 font-semibold text-center"
                  >
                    {awaitingReply}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-band-line space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-on-band-muted hover:bg-white/10 hover:text-on-band transition-colors"
          >
            <ExternalLink size={16} />
            <span>View site</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-on-band-muted hover:bg-white/10 hover:text-on-band transition-colors"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
          <p className="px-3 pt-2 text-xs text-on-band-muted truncate" title={email}>
            {email}
          </p>
        </div>
      </aside>
    </>
  );
}
