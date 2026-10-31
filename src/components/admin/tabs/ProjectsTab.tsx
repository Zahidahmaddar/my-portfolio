"use client";

import { useState } from "react";
import { Edit, ExternalLink, ImageOff, Plus, Trash2 } from "lucide-react";
import { Project } from "@/types/Project";
import { isUsableImage, safeLink } from "@/lib/images";
import AdminProjectForm from "../AdminProjectForm";
import { adminFetch, EmptyState, errorMessage, useFeedback } from "../ui";

export interface ProjectEditorState {
  open: boolean;
  project?: Project;
}

interface ProjectsTabProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  editor: ProjectEditorState;
  setEditor: (state: ProjectEditorState) => void;
}

function Thumbnail({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);

  if (!isUsableImage(src) || broken) {
    return (
      <div className="w-12 h-12 rounded-lg border border-line bg-sunken flex items-center justify-center text-muted shrink-0">
        <ImageOff size={18} aria-label="Image can't be loaded" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      onError={() => setBroken(true)}
      className="w-12 h-12 rounded-lg border border-line object-contain bg-[var(--frame)] shrink-0"
    />
  );
}

export default function ProjectsTab({ projects, setProjects, editor, setEditor }: ProjectsTabProps) {
  const { toast, confirm } = useFeedback();

  const handleDelete = async (project: Project) => {
    const ok = await confirm({
      title: `Delete ${project.title}?`,
      body: "It will be removed from your site. This can't be undone.",
      confirmLabel: "Delete project",
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/projects?id=${project._id}`, { method: "DELETE" });
      setProjects((current) => current.filter((p) => p._id !== project._id));
      toast("success", "Project deleted.");
    } catch (error) {
      toast("error", errorMessage(error));
    }
  };

  const addButton = (
    <button type="button" onClick={() => setEditor({ open: true })} className="btn btn-primary">
      <Plus size={16} />
      Add a project
    </button>
  );

  return (
    <div className="space-y-5">
      {editor.open ? (
        <AdminProjectForm
          key={editor.project?._id ?? "new"}
          project={editor.project}
          onClose={() => setEditor({ open: false })}
          onSave={(saved, isNew) =>
            setProjects((current) =>
              isNew ? [saved, ...current] : current.map((p) => (p._id === saved._id ? saved : p)),
            )
          }
        />
      ) : (
        projects.length > 0 && <div>{addButton}</div>
      )}

      {projects.length === 0 && !editor.open ? (
        <EmptyState
          title="No projects yet"
          hint="Projects you add appear on your site right away."
          action={addButton}
        />
      ) : (
        <ul className="rounded-xl border border-line bg-raised divide-y divide-line">
          {projects.map((project) => {
            const link = safeLink(project.liveUrl) ?? safeLink(project.repoUrl);
            return (
              <li key={project._id} className="flex items-center gap-3.5 px-4 py-3">
                <Thumbnail src={project.image} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  <p className="text-sm text-muted truncate">{project.tech.join(", ") || project.description}</p>
                </div>
                <div className="flex shrink-0">
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title}`}
                      className="icon-btn max-sm:hidden"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditor({ open: true, project })}
                    aria-label={`Edit ${project.title}`}
                    className="icon-btn"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    aria-label={`Delete ${project.title}`}
                    className="icon-btn icon-btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
