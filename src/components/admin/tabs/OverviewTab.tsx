"use client";

import { FolderOpen, Inbox, LucideIcon, MessageSquare, Plus, Wrench } from "lucide-react";
import Contours from "@/components/common/Contours";
import { Panel } from "../ui";
import { AdminTab, Submission } from "../types";

interface OverviewTabProps {
  projectCount: number;
  skillCount: number;
  submissions: Submission[];
  awaitingReply: number;
  onOpen: (tab: AdminTab) => void;
  onAddProject: () => void;
  onAddSkill: () => void;
}

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OverviewTab({
  projectCount,
  skillCount,
  submissions,
  awaitingReply,
  onOpen,
  onAddProject,
  onAddSkill,
}: OverviewTabProps) {
  const stats: { label: string; value: number; tab: AdminTab; icon: LucideIcon }[] = [
    { label: "Projects", value: projectCount, tab: "projects", icon: FolderOpen },
    { label: "Skills", value: skillCount, tab: "skills", icon: Wrench },
    { label: "Messages", value: submissions.length, tab: "messages", icon: MessageSquare },
    { label: "Awaiting a reply", value: awaitingReply, tab: "messages", icon: Inbox },
  ];

  return (
    <div className="space-y-5">
      <div className="on-band relative overflow-hidden rounded-2xl bg-band text-on-band p-6 sm:p-8">
        <Contours className="opacity-[0.12]" />
        <div className="relative">
          <p className="text-2xl font-semibold tracking-tight">Welcome back</p>
          <p className="mt-1 text-on-band-muted">
            {awaitingReply > 0
              ? `${awaitingReply} ${awaitingReply === 1 ? "message is" : "messages are"} waiting for your reply.`
              : "You're all caught up on messages."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={onAddProject} className="btn btn-saffron">
              <Plus size={16} />
              Add a project
            </button>
            <button type="button" onClick={onAddSkill} className="btn btn-ghost">
              <Plus size={16} />
              Add a skill
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => onOpen(stat.tab)}
            className="text-left rounded-xl border border-line bg-raised px-4 py-3.5 hover:border-muted transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sunken text-action">
              <stat.icon size={16} aria-hidden />
            </span>
            <span className="block mt-3 text-2xl font-semibold tracking-tight">{stat.value}</span>
            <span className="block text-sm text-muted">{stat.label}</span>
          </button>
        ))}
      </div>

      <Panel
        title="Recent messages"
        action={
          submissions.length > 0 ? (
            <button type="button" onClick={() => onOpen("messages")} className="text-link text-sm">
              See all
            </button>
          ) : undefined
        }
      >
        {submissions.length === 0 ? (
          <p className="text-muted">Messages from your contact form will show up here.</p>
        ) : (
          <ul className="divide-y divide-line -my-3">
            {submissions.slice(0, 5).map((s) => (
              <li key={s._id} className="py-3 flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-sunken text-sm font-semibold shrink-0"
                >
                  {s.name.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {s.name}
                    {!s.replied && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-saffron align-middle">
                        <span className="sr-only">Awaiting a reply</span>
                      </span>
                    )}
                  </p>
                  <p className="text-muted truncate">{s.subject || s.message}</p>
                </div>
                <time className="text-sm text-muted shrink-0 max-sm:hidden">
                  {formatDate(s.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
