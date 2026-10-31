"use client";

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { adminFetch, EmptyState, errorMessage, jsonBody, useFeedback } from "../ui";
import { Submission } from "../types";
import { formatDate } from "./OverviewTab";

interface MessagesTabProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  onRefresh: () => void;
}

export default function MessagesTab({ submissions, setSubmissions, onRefresh }: MessagesTabProps) {
  const { toast, confirm } = useFeedback();
  const [filter, setFilter] = useState<"all" | "awaiting">("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const handleReply = async (e: React.FormEvent, submission: Submission) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const updated = await adminFetch<Submission>(
        "/api/contact",
        jsonBody("PUT", { id: submission._id, reply: replyText }),
      );
      setSubmissions((current) => current.map((s) => (s._id === updated._id ? updated : s)));
      setReplyingTo(null);
      setReplyText("");
      toast("success", `Reply sent to ${submission.email}.`);
    } catch (error) {
      // Keep the draft in place so nothing is lost
      toast("error", errorMessage(error));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (submission: Submission) => {
    const ok = await confirm({
      title: `Delete the message from ${submission.name}?`,
      body: "This can't be undone.",
      confirmLabel: "Delete message",
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/contact?id=${submission._id}`, { method: "DELETE" });
      setSubmissions((current) => current.filter((s) => s._id !== submission._id));
      toast("success", "Message deleted.");
    } catch (error) {
      toast("error", errorMessage(error));
    }
  };

  const visible = filter === "all" ? submissions : submissions.filter((s) => !s.replied);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="segmented" role="group" aria-label="Filter messages">
          {(
            [
              ["all", "All"],
              ["awaiting", "Awaiting a reply"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onRefresh} className="btn btn-quiet btn-sm">
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={filter === "all" ? "No messages yet" : "You're all caught up"}
          hint={
            filter === "all"
              ? "Messages from your contact form will show up here."
              : "Every message has a reply."
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((submission) => (
            <li key={submission._id} className="rounded-xl border border-line bg-raised p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {submission.name}
                    {submission.replied ? (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-success-soft text-success text-xs font-medium">
                        Replied
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-saffron text-on-saffron text-xs font-medium">
                        Awaiting a reply
                      </span>
                    )}
                  </p>
                  <a href={`mailto:${submission.email}`} className="text-link break-all text-sm">
                    {submission.email}
                  </a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <time className="text-sm text-muted max-sm:hidden">
                    {formatDate(submission.createdAt)}
                  </time>
                  <button
                    type="button"
                    onClick={() => handleDelete(submission)}
                    aria-label={`Delete the message from ${submission.name}`}
                    className="icon-btn icon-btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {submission.subject && <p className="mt-3 font-medium">{submission.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap break-words max-w-[75ch]">{submission.message}</p>

              {submission.reply && (
                <div className="mt-4 pl-3 border-l-2 border-line">
                  <p className="text-sm font-medium text-muted">Your reply</p>
                  <p className="whitespace-pre-wrap break-words max-w-[75ch]">{submission.reply}</p>
                </div>
              )}

              {!submission.replied &&
                (replyingTo === submission._id ? (
                  <form onSubmit={(e) => handleReply(e, submission)} className="mt-4">
                    <label htmlFor={`reply-${submission._id}`} className="field-label">
                      Your reply to {submission.email}
                    </label>
                    <textarea
                      id={`reply-${submission._id}`}
                      autoFocus
                      required
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="field resize-y"
                    />
                    <div className="mt-3 flex gap-2">
                      <button type="submit" disabled={sending} className="btn btn-primary btn-sm">
                        {sending ? "Sending reply" : "Send reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="btn btn-quiet btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(submission._id);
                      setReplyText("");
                    }}
                    className="btn btn-quiet btn-sm mt-4"
                  >
                    Reply by email
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
