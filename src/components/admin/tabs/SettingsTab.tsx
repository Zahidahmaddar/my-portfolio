"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { adminFetch, errorMessage, jsonBody, Panel, UploadField, useFeedback } from "../ui";
import { SiteSettings } from "../types";

interface SettingsTabProps {
  settings: SiteSettings;
  onSaved: (settings: SiteSettings) => void;
}

export default function SettingsTab({ settings, onSaved }: SettingsTabProps) {
  const { toast } = useFeedback();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  // Pick up saves made elsewhere, like a model change on the Chatbot tab
  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const isDirty = JSON.stringify(form) !== JSON.stringify(settings);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // The model has its own save on the Chatbot tab
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { aiModel, ...content } = form;
      const saved = await adminFetch<SiteSettings>("/api/site-settings", jsonBody("PUT", content));
      onSaved(saved);
      toast("success", "Settings saved. Your site is up to date.");
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 pb-20">
      <Panel title="Top of the page">
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="title-1" className="field-label">
                First line of your name
              </label>
              <input
                id="title-1"
                value={form.titleLine1}
                onChange={(e) => set("titleLine1", e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="title-2" className="field-label">
                Second line of your name
              </label>
              <input
                id="title-2"
                value={form.titleLine2}
                onChange={(e) => set("titleLine2", e.target.value)}
                className="field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="hero-subtitle" className="field-label">
              Job title
            </label>
            <input
              id="hero-subtitle"
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="hero-description" className="field-label">
              Introduction
            </label>
            <textarea
              id="hero-description"
              rows={3}
              value={form.heroDescription}
              onChange={(e) => set("heroDescription", e.target.value)}
              className="field resize-y"
            />
          </div>
          <UploadField
            label="Main photo"
            accept="image/*"
            value={form.heroImage}
            onChange={(url) => set("heroImage", url)}
          />
        </div>
      </Panel>

      <Panel title="About">
        <div className="space-y-5">
          <UploadField
            label="About photo"
            accept="image/*"
            value={form.aboutImage}
            onChange={(url) => set("aboutImage", url)}
          />
          <fieldset>
            <legend className="field-label">Paragraphs</legend>
            {form.aboutParagraphs.length === 0 && (
              <p className="text-muted mb-3">
                Your site is showing the default About text. Add a paragraph to replace it.
              </p>
            )}
            <div className="space-y-2">
              {form.aboutParagraphs.map((paragraph, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <textarea
                    aria-label={`Paragraph ${i + 1}`}
                    rows={3}
                    value={paragraph}
                    onChange={(e) => {
                      const next = [...form.aboutParagraphs];
                      next[i] = e.target.value;
                      set("aboutParagraphs", next);
                    }}
                    className="field resize-y"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set("aboutParagraphs", form.aboutParagraphs.filter((_, idx) => idx !== i))
                    }
                    aria-label={`Remove paragraph ${i + 1}`}
                    className="icon-btn icon-btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set("aboutParagraphs", [...form.aboutParagraphs, ""])}
              className="btn btn-quiet btn-sm mt-3"
            >
              <Plus size={15} />
              Add a paragraph
            </button>
          </fieldset>
          <fieldset>
            <legend className="field-label">Numbers</legend>
            {form.stats.length === 0 && (
              <p className="text-muted mb-3">
                Your site is counting your projects and skills automatically. Add a number to use
                your own, like years of experience.
              </p>
            )}
            <div className="space-y-2">
              {form.stats.map((stat, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    aria-label={`Number ${i + 1} value`}
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], value: e.target.value };
                      set("stats", next);
                    }}
                    placeholder="20+"
                    className="field !w-24 shrink-0"
                  />
                  <input
                    aria-label={`Number ${i + 1} label`}
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], label: e.target.value };
                      set("stats", next);
                    }}
                    placeholder="Apps shipped"
                    className="field"
                  />
                  <button
                    type="button"
                    onClick={() => set("stats", form.stats.filter((_, idx) => idx !== i))}
                    aria-label={`Remove number ${i + 1}`}
                    className="icon-btn icon-btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set("stats", [...form.stats, { value: "", label: "" }])}
              className="btn btn-quiet btn-sm mt-3"
            >
              <Plus size={15} />
              Add a number
            </button>
          </fieldset>
        </div>
      </Panel>

      <Panel title="Resume">
        <UploadField
          label="Resume file"
          accept="application/pdf"
          preview={false}
          value={form.resumeUrl}
          onChange={(url) => set("resumeUrl", url)}
        />
      </Panel>

      <div className="fixed bottom-0 right-0 left-0 lg:left-60 z-20 flex items-center justify-end gap-3 px-5 py-3 bg-surface/85 backdrop-blur-md border-t border-line">
        {isDirty && <span className="text-sm text-muted">You have unsaved changes</span>}
        <button type="submit" disabled={saving || !isDirty} className="btn btn-primary">
          {saving ? "Saving" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
