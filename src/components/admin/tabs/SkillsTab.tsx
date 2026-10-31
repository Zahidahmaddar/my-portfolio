"use client";

import { useEffect, useRef, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { adminFetch, EmptyState, errorMessage, jsonBody, Panel, useFeedback } from "../ui";
import { Skill } from "../types";

export interface SkillEditorState {
  open: boolean;
  skill?: Skill;
}

interface SkillsTabProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  editor: SkillEditorState;
  setEditor: (state: SkillEditorState) => void;
}

function SkillForm({
  skill,
  onSaved,
  onCancel,
}: {
  skill?: Skill;
  onSaved: (skill: Skill, isNew: boolean) => void;
  onCancel: () => void;
}) {
  const { toast } = useFeedback();
  const [name, setName] = useState(skill?.name ?? "");
  const [level, setLevel] = useState(skill?.level ?? 80);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await adminFetch<Skill>(
        "/api/skills",
        jsonBody(skill ? "PUT" : "POST", { id: skill?._id, name, level }),
      );
      onSaved(saved, !skill);
      toast("success", skill ? "Skill updated." : "Skill added.");
    } catch (error) {
      toast("error", errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title={skill ? `Edit ${skill.name}` : "Add a skill"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5 md:items-start">
          <div>
            <label htmlFor="skill-name" className="field-label">
              Name
            </label>
            <input
              id="skill-name"
              ref={nameRef}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="React"
              className="field"
            />
          </div>
          <div>
            <label htmlFor="skill-level" className="field-label">
              Experience: {level}%
            </label>
            <input
              id="skill-level"
              type="range"
              min={70}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full h-11 accent-[var(--action)] cursor-pointer"
            />
            <p className="field-hint">Sets the order on your site, highest first.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn btn-quiet">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving" : skill ? "Save changes" : "Add skill"}
          </button>
        </div>
      </form>
    </Panel>
  );
}

export default function SkillsTab({ skills, setSkills, editor, setEditor }: SkillsTabProps) {
  const { toast, confirm } = useFeedback();

  const handleDelete = async (skill: Skill) => {
    const ok = await confirm({
      title: `Delete ${skill.name}?`,
      body: "It will be removed from your site.",
      confirmLabel: "Delete skill",
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/skills?id=${skill._id}`, { method: "DELETE" });
      setSkills((current) => current.filter((s) => s._id !== skill._id));
      toast("success", "Skill deleted.");
    } catch (error) {
      toast("error", errorMessage(error));
    }
  };

  const addButton = (
    <button type="button" onClick={() => setEditor({ open: true })} className="btn btn-primary">
      <Plus size={16} />
      Add a skill
    </button>
  );

  return (
    <div className="space-y-5">
      {editor.open ? (
        <SkillForm
          key={editor.skill?._id ?? "new"}
          skill={editor.skill}
          onCancel={() => setEditor({ open: false })}
          onSaved={(saved, isNew) => {
            setSkills((current) =>
              isNew ? [saved, ...current] : current.map((s) => (s._id === saved._id ? saved : s)),
            );
            setEditor({ open: false });
          }}
        />
      ) : (
        skills.length > 0 && <div>{addButton}</div>
      )}

      {skills.length === 0 && !editor.open ? (
        <EmptyState
          title="No skills yet"
          hint="Add the tools you work with so visitors can see them."
          action={addButton}
        />
      ) : (
        <ul className="rounded-xl border border-line bg-raised divide-y divide-line">
          {skills.map((skill) => (
            <li key={skill._id} className="flex items-center gap-4 pl-4 pr-3 py-2">
              <h3 className="font-medium w-32 sm:w-44 truncate">{skill.name}</h3>
              <div
                role="img"
                aria-label={`${skill.level}%`}
                className="flex-1 h-1.5 rounded-full bg-sunken overflow-hidden"
              >
                <div className="h-full bg-action" style={{ width: `${skill.level}%` }} />
              </div>
              <span className="w-8 text-right text-sm text-muted tabular-nums" aria-hidden>
                {skill.level}
              </span>
              <div className="flex shrink-0">
                <button
                  type="button"
                  onClick={() => setEditor({ open: true, skill })}
                  aria-label={`Edit ${skill.name}`}
                  className="icon-btn"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(skill)}
                  aria-label={`Delete ${skill.name}`}
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
