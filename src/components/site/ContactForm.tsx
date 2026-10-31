"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", company: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("sent");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setError(data.error || "The message wasn't sent. Try again.");
      }
    } catch {
      setStatus("error");
      setError("The message wasn't sent. Check your connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Name
          </label>
          <input
            id="contact-name"
            required
            maxLength={120}
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className="field"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="field-label">
          Subject (optional)
        </label>
        <input
          id="contact-subject"
          maxLength={200}
          value={form.subject}
          onChange={update("subject")}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={5000}
          value={form.message}
          onChange={update("message")}
          className="field resize-y"
        />
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={update("company")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-saffron"
        >
          <Send size={16} />
          {status === "sending" ? "Sending message" : "Send message"}
        </button>
        <div role="status" aria-live="polite" className="text-sm font-medium">
          {status === "sent" && "Message sent. I'll reply by email soon."}
          {status === "error" && <span className="text-saffron">{error}</span>}
        </div>
      </div>
    </form>
  );
}
