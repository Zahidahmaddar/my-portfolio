"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Sparkles, Upload } from "lucide-react";
import { Project } from "@/types/Project";

interface AdminProjectFormProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const AdminProjectForm = ({
  project,
  isOpen,
  onClose,
  onSave,
}: AdminProjectFormProps) => {
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    tech: [],
    image: "",
    repoUrl: "",
    liveUrl: "",
  });
  const [techInput, setTechInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
      setTechInput(project.tech.join(", "));
    } else {
      setFormData({
        title: "",
        description: "",
        tech: [],
        image: "",
        repoUrl: "",
        liveUrl: "",
      });
      setTechInput("");
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Parse tech from comma-separated input
    const parsedTech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const submitData = { ...formData, tech: parsedTech };

    try {
      const method = project?._id ? "PUT" : "POST";
      const body = project?._id
        ? { ...submitData, id: project._id }
        : submitData;

      const response = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        onSave(data.data);
        onClose();
      } else {
        alert(data.error || "Failed to save project");
      }
    } catch {
      alert("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (data.success) setFormData({ ...formData, image: data.data.url });
      else alert("Upload failed");
    } catch {
      alert("Upload failed");
    }
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelCls =
    "block text-[10px] font-normal text-zinc-500 uppercase tracking-wider mb-2";

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-200">
            {project?._id ? "Edit Project" : "New Project"}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/[0.04] rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={inputCls}
              placeholder="Project name"
            />
          </div>
          <div>
            <label className={labelCls}>URL</label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({ ...formData, liveUrl: e.target.value })
              }
              className={inputCls}
              placeholder="https://your-project.com"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`${inputCls} resize-none`}
            placeholder="Describe your project"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className={inputCls}
                placeholder="URL or upload"
              />
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />
              <button
                type="button"
                onClick={() => imageFileRef.current?.click()}
                className="px-3 py-2 bg-indigo-500/80 text-white rounded-lg hover:bg-indigo-600 transition-colors text-xs flex items-center gap-1.5 shrink-0"
              >
                <Upload size={12} /> Upload
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>Tech (comma separated)</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className={inputCls}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center space-x-2 text-sm"
          >
            <Save size={14} />
            <span>{isLoading ? "Saving..." : "Save Project"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
