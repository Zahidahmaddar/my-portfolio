"use client";

import { useEffect, useRef, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { adminFetch, EmptyState, errorMessage, jsonBody, Panel, useFeedback } from "../ui";
import { KnowledgeEntry, SiteSettings } from "../types";

const SUGGESTED_MODELS = [
  "openai/gpt-oss-20b",
  "z-ai/glm-5.3-flash",
  "deepseek-ai/deepseek-v4.1-flash",
];

interface ChatStatus {
  ok: boolean;
  configured: string | null;
  served: string | null;
  reason?: string;
}

interface ChatbotTabProps {
  aiModel: string;
  onModelSaved: (settings: SiteSettings) => void;
  entries: KnowledgeEntry[];
  setEntries: React.Dispatch<React.SetStateAction<KnowledgeEntry[]>>;
}

function ModelPanel({ aiModel, onModelSaved }: Pick<ChatbotTabProps, "aiModel" | "onModelSaved">) {
  const { toast } = useFeedback();
  const [model, setModel] = useState(aiModel);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<ChatStatus | null>(null);

  const saveModel = async (next: string) => {
    setSaving(true);
    try {
      const settings = await adminFetch<SiteSettings>(
        "/api/site-settings",
        jsonBody("PUT", { aiModel: next }),
      );
      onModelSaved(settings);
      setModel(next);
      setStatus(null);
      toast("success", "Model saved.");
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const check = async () => {
    setChecking(true);
    setStatus(null);
    try {
      setStatus(await adminFetch<ChatStatus>("/api/chatbot/status"));
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setChecking(false);
    }
  };

  return (
    <Panel title="AI model">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveModel(model.trim());
        }}
      >
        <label htmlFor="ai-model" className="field-label">
          NVIDIA model name
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="ai-model"
            required
            list="ai-model-suggestions"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="field"
          />
          <datalist id="ai-model-suggestions">
            {SUGGESTED_MODELS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <button type="submit" disabled={saving || !model.trim()} className="btn btn-primary shrink-0">
            {saving ? "Saving" : "Save model"}
          </button>
          <button type="button" onClick={check} disabled={checking} className="btn btn-quiet shrink-0">
            {checking ? "Checking" : "Check chatbot"}
          </button>
        </div>
        <p className="field-hint">
          If this model stops working, the chatbot switches to a backup by itself. Browse models at{" "}
          <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="text-link">
            build.nvidia.com
          </a>
          .
        </p>
      </form>

      {status && (
        <div
          role="status"
          className={`mt-4 rounded-lg px-3 py-2.5 text-sm font-medium ${
            !status.ok
              ? "bg-danger-soft text-danger"
              : status.served === status.configured
                ? "bg-success-soft text-success"
                : "bg-sunken text-ink"
          }`}
        >
          {!status.ok && status.reason}
          {status.ok && status.served === status.configured && (
            <>The chatbot is working and answering with {status.served}.</>
          )}
          {status.ok && status.served !== status.configured && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                {status.configured} isn&apos;t responding, so a backup is answering: {status.served}.
              </p>
              <button
                type="button"
                onClick={() => saveModel(status.served as string)}
                className="btn btn-primary btn-sm"
              >
                Use {status.served}
              </button>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function EntryForm({
  entry,
  onSaved,
  onCancel,
}: {
  entry?: KnowledgeEntry;
  onSaved: (entry: KnowledgeEntry, isNew: boolean) => void;
  onCancel: () => void;
}) {
  const { toast } = useFeedback();
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await adminFetch<KnowledgeEntry>(
        "/api/chatbot-knowledge",
        jsonBody(entry ? "PUT" : "POST", { id: entry?._id, title, content }),
      );
      onSaved(saved, !entry);
      toast("success", entry ? "Note updated." : "Note added.");
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title={entry ? "Edit note" : "Add a note"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="knowledge-title" className="field-label">
            Topic
          </label>
          <input
            id="knowledge-title"
            ref={titleRef}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Experience"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="knowledge-content" className="field-label">
            What the chatbot should know
          </label>
          <textarea
            id="knowledge-content"
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="field resize-y"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn btn-quiet">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving" : entry ? "Save changes" : "Add note"}
          </button>
        </div>
      </form>
    </Panel>
  );
}

export default function ChatbotTab({ aiModel, onModelSaved, entries, setEntries }: ChatbotTabProps) {
  const { toast, confirm } = useFeedback();
  const [editor, setEditor] = useState<{ open: boolean; entry?: KnowledgeEntry }>({ open: false });

  const handleDelete = async (entry: KnowledgeEntry) => {
    const ok = await confirm({
      title: `Delete the note "${entry.title}"?`,
      body: "The chatbot will stop using this information.",
      confirmLabel: "Delete note",
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/chatbot-knowledge?id=${entry._id}`, { method: "DELETE" });
      setEntries((current) => current.filter((e) => e._id !== entry._id));
      toast("success", "Note deleted.");
    } catch (error) {
      toast("error", errorMessage(error));
    }
  };

  const addButton = (
    <button type="button" onClick={() => setEditor({ open: true })} className="btn btn-primary">
      <Plus size={16} />
      Add a note
    </button>
  );

  return (
    <div className="space-y-5">
      <ModelPanel key={aiModel} aiModel={aiModel} onModelSaved={onModelSaved} />

      <div>
        <h2 className="font-semibold">Notes for the chatbot</h2>
        <p className="mt-1 text-muted max-w-[65ch]">
          It already knows your projects, skills, About text and contact details. Add anything else
          visitors might ask about, such as work history or the kind of roles you want.
        </p>
      </div>

      {editor.open ? (
        <EntryForm
          key={editor.entry?._id ?? "new"}
          entry={editor.entry}
          onCancel={() => setEditor({ open: false })}
          onSaved={(saved, isNew) => {
            setEntries((current) =>
              isNew ? [saved, ...current] : current.map((e) => (e._id === saved._id ? saved : e)),
            );
            setEditor({ open: false });
          }}
        />
      ) : (
        entries.length > 0 && <div>{addButton}</div>
      )}

      {entries.length === 0 && !editor.open ? (
        <EmptyState
          title="No notes yet"
          hint="The chatbot will answer from your portfolio content alone."
          action={addButton}
        />
      ) : (
        <ul className="rounded-xl border border-line bg-raised divide-y divide-line">
          {entries.map((entry) => (
            <li key={entry._id} className="flex items-start gap-4 pl-4 pr-3 py-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{entry.title}</h3>
                <p className="mt-0.5 text-sm text-muted whitespace-pre-wrap break-words">{entry.content}</p>
              </div>
              <div className="flex shrink-0">
                <button
                  type="button"
                  onClick={() => setEditor({ open: true, entry })}
                  aria-label={`Edit note ${entry.title}`}
                  className="icon-btn"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry)}
                  aria-label={`Delete note ${entry.title}`}
                  className="icon-btn icon-btn-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
