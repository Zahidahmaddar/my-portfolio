"use client";

import { useEffect, useRef, useState } from "react";
import { Project } from "@/types/Project";
import { adminFetch, errorMessage, jsonBody, Panel, UploadField, useFeedback } from "./ui";

interface AdminProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSave: (project: Project, isNew: boolean) => void;
}

// Mounted fresh each time it opens, so state always starts from `project`
const AdminProjectForm = ({ project, onClose, onSave }: AdminProjectFormProps) => {
  const { toast } = useFeedback();
  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    image: project?.image ?? "",
    liveUrl: project?.liveUrl ?? "",
    repoUrl: project?.repoUrl ?? "",
    tech: project?.tech.join(", ") ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isEditing = !!project?._id;

  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
    panelRef.current?.querySelector("input")?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const body = {
      ...form,
      tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      ...(isEditing ? { id: project._id } : {}),
    };

    try {
      const saved = await adminFetch<Project>(
        "/api/projects",
        jsonBody(isEditing ? "PUT" : "POST", body),
      );
      onSave(saved, !isEditing);
      toast("success", isEditing ? "Project updated." : "Project added.");
      onClose();
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={panelRef} className="scroll-mt-20">
      <Panel title={isEditing ? `Edit ${project.title}` : "Add a project"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="project-title" className="field-label">
              Title
            </label>
            <input
              id="project-title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="project-description" className="field-label">
              Description
            </label>
            <textarea
              id="project-description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="field resize-y"
            />
          </div>

          <UploadField
            label="Image"
            required
            accept="image/*"
            value={form.image}
            onChange={(image) => setForm((f) => ({ ...f, image }))}
            onUploadingChange={setIsUploading}
          />

          <div>
            <label htmlFor="project-tech" className="field-label">
              Technologies
            </label>
            <input
              id="project-tech"
              value={form.tech}
              onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
              placeholder="React, Node.js, MongoDB"
              className="field"
            />
            <p className="field-hint">Separate them with commas.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="project-live" className="field-label">
                Live site (optional)
              </label>
              <input
                id="project-live"
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                placeholder="https://"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="project-repo" className="field-label">
                Source code (optional)
              </label>
              <input
                id="project-repo"
                type="url"
                value={form.repoUrl}
                onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                placeholder="https://"
                className="field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn btn-quiet">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="btn btn-primary"
            >
              {isSaving ? "Saving" : isEditing ? "Save changes" : "Add project"}
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
};

export default AdminProjectForm;
