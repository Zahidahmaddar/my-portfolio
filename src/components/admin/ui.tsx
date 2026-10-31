"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { CheckCircle2, ImageOff, Upload, X, XCircle } from "lucide-react";
import { isUsableImage } from "@/lib/images";

/* ─── API ─── */

/** Calls an admin endpoint. Sends expired sessions to login; throws the server's error otherwise. */
export async function adminFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: "include", ...init });

  if (response.status === 401) {
    window.location.assign("/admin/login");
    throw new Error("Your session has expired. Sign in again.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || "The server didn't respond. Try again.");
  }
  return data.data as T;
}

export function jsonBody(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Try again.";

/* ─── Toasts and confirmation ─── */

interface Toast {
  id: number;
  tone: "success" | "error";
  text: string;
}

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel: string;
}

interface FeedbackContextValue {
  toast: (tone: Toast["tone"], text: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used within FeedbackProvider");
  return value;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirming, setConfirming] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (tone: Toast["tone"], text: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, tone, text }]);
      // Errors stay until dismissed so they can't be missed
      if (tone === "success") setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirming(options);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (confirming) dialogRef.current?.showModal();
  }, [confirming]);

  const settle = (value: boolean) => {
    dialogRef.current?.close();
    setConfirming(null);
    resolver.current?.(value);
    resolver.current = null;
  };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      <div
        aria-live="polite"
        className="fixed z-[70] bottom-4 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-xl px-3 py-2.5 shadow-[var(--shadow-float)] text-sm font-medium ${
              t.tone === "success"
                ? "bg-success-soft text-success"
                : "bg-danger-soft text-danger"
            }`}
          >
            {t.tone === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={16} className="mt-0.5 shrink-0" />
            )}
            <p className="flex-1">{t.text}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 opacity-70 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {confirming && (
        <dialog
          ref={dialogRef}
          onCancel={(e) => {
            e.preventDefault();
            settle(false);
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-raised text-ink p-6 shadow-[var(--shadow-pop)] backdrop:bg-[#141c26]/40"
        >
          <h2 className="text-lg font-semibold tracking-tight">{confirming.title}</h2>
          {confirming.body && <p className="mt-1.5 text-muted">{confirming.body}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" autoFocus onClick={() => settle(false)} className="btn btn-quiet">
              Cancel
            </button>
            <button type="button" onClick={() => settle(true)} className="btn btn-danger">
              {confirming.confirmLabel}
            </button>
          </div>
        </dialog>
      )}
    </FeedbackContext.Provider>
  );
}

/* ─── Layout pieces ─── */

export function Panel({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-raised">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line">
          {title && <h2 className="font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-muted">{hint}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/* ─── File upload ─── */

export function useUpload() {
  const { toast } = useFeedback();
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const data = await adminFetch<{ url: string }>("/api/upload", {
        method: "POST",
        body: formData,
      });
      return data.url;
    } catch (error) {
      toast("error", `Upload failed. ${errorMessage(error)}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}

interface UploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  placeholder?: string;
  preview?: boolean;
  required?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function UploadField({
  label,
  value,
  onChange,
  accept,
  placeholder,
  preview = true,
  required,
  onUploadingChange,
}: UploadFieldProps) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload();
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [value]);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const usable = isUsableImage(value);

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Paste a link or upload a file"}
          className="field"
        />
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          aria-label={`Upload ${label.toLowerCase()}`}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            // Clear it so choosing the same file again still fires a change
            e.target.value = "";
            if (!file) return;
            const url = await upload(file);
            if (url) onChange(url);
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn btn-quiet shrink-0"
        >
          <Upload size={16} />
          {uploading ? "Uploading" : "Upload"}
        </button>
      </div>
      {preview && value && (
        <div className="mt-2 flex items-center gap-2">
          {usable && !broken ? (
            // Plain img: it has to tolerate half-typed URLs from any host
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              onError={() => setBroken(true)}
              className="h-14 w-14 rounded-lg border border-line object-cover bg-sunken"
            />
          ) : (
            <p className="flex items-center gap-1.5 text-sm text-danger font-medium">
              <ImageOff size={15} />
              This image can&apos;t be loaded. Check the link.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
