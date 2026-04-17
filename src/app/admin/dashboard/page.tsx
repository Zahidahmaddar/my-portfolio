"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  Mail,
  MessageSquare,
  FolderOpen,
  Wrench,
  RefreshCw,
  Upload,
  Save,
  Sparkles,
  ChevronRight,
  BookOpen,
  Link as LinkIcon,
  X,
  Send,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProjectForm from "@/components/admin/AdminProjectForm";
import { Project } from "@/types/Project";

interface Submission {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  reply?: string;
  replied?: boolean;
  createdAt: string;
}

interface User {
  email: string;
  role: string;
}

interface Skill {
  _id: string;
  name: string;
  level: number;
}

interface SiteSettings {
  heroSubtitle: string;
  heroImage: string;
  titleLine1: string;
  titleLine2: string;
  heroDescription: string;
  aboutImage: string;
  aboutParagraphs: string[];
  resumeUrl: string;
  stats: { value: string; label: string }[];
  aiModel: string;
}

interface KnowledgeEntry {
  _id: string;
  title: string;
  content: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    heroSubtitle: "",
    heroImage: "",
    titleLine1: "",
    titleLine2: "",
    heroDescription: "",
    aboutImage: "",
    aboutParagraphs: [],
    resumeUrl: "",
    stats: [],
    aiModel: "meta/llama-3.1-8b-instruct",
  });
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  // Skill form state
  const [skillForm, setSkillForm] = useState({ name: "", level: 80 });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);

  // Chatbot state
  const [aiModel, setAiModel] = useState("meta/llama-3.1-8b-instruct");
  const [knowledgeForm, setKnowledgeForm] = useState({
    title: "",
    content: "",
  });
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [isKnowledgeFormOpen, setIsKnowledgeFormOpen] = useState(false);

  // Message reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Settings state
  const [savingSettings, setSavingSettings] = useState(false);

  // Upload refs
  const heroImageRef = useRef<HTMLInputElement>(null);
  const aboutImageRef = useRef<HTMLInputElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  // Tab handling moved to SearchParamsWrapper component

  // Load projects and submissions
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, subRes, skillRes, settingsRes, knowledgeRes] =
        await Promise.all([
          fetch("/api/projects", { credentials: "include" }),
          fetch("/api/contact", { credentials: "include" }),
          fetch("/api/skills", { credentials: "include" }),
          fetch("/api/site-settings", { credentials: "include" }),
          fetch("/api/chatbot-knowledge", { credentials: "include" }),
        ]);

      const [projData, subData, skillData, settingsData, knowledgeData] =
        await Promise.all([
          projRes.json(),
          subRes.json(),
          skillRes.json(),
          settingsRes.json(),
          knowledgeRes.json(),
        ]);

      if (projData.success) setProjects(projData.data);
      if (subData.success) setSubmissions(subData.data);
      if (skillData.success) setSkills(skillData.data);
      if (settingsData.success) {
        setSiteSettings(settingsData.data);
        if (settingsData.data.aiModel) setAiModel(settingsData.data.aiModel);
      }
      if (knowledgeData.success) setKnowledgeEntries(knowledgeData.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Project handlers ───
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success)
        setProjects(projects.filter((p) => p._id !== projectId));
      else alert(data.error || "Failed to delete project");
    } catch {
      alert("Failed to delete project");
    }
  };

  const handleProjectSave = (savedProject: Project) => {
    if (editingProject) {
      setProjects(
        projects.map((p) => (p._id === savedProject._id ? savedProject : p)),
      );
    } else {
      setProjects([savedProject, ...projects]);
    }
    setEditingProject(undefined);
  };

  // ─── Skill handlers ───
  const handleSaveSkill = async () => {
    if (!skillForm.name) return;
    try {
      if (editingSkill) {
        const res = await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingSkill._id, ...skillForm }),
        });
        const data = await res.json();
        if (data.success) {
          setSkills(
            skills.map((s) => (s._id === editingSkill._id ? data.data : s)),
          );
          setEditingSkill(null);
        }
      } else {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(skillForm),
        });
        const data = await res.json();
        if (data.success) setSkills([data.data, ...skills]);
      }
      setSkillForm({ name: "", level: 80 });
      setIsSkillFormOpen(false);
    } catch {
      alert("Failed to save skill");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setSkills(skills.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete skill");
    }
  };

  // ─── Message handlers ───
  const handleReplyMessage = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, reply: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(submissions.map((s) => (s._id === id ? data.data : s)));
        setReplyingTo(null);
        setReplyText("");
      }
    } catch {
      alert("Failed to send reply");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSubmissions(submissions.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete message");
    }
  };

  // ─── Settings handlers ───
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (data.success) setSiteSettings(data.data);
      else alert("Failed to save settings");
    } catch {
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) onSuccess(data.data.url);
      else alert("Upload failed");
    } catch {
      alert("Upload failed");
    }
  };

  // ─── AI Model handler ───
  const handleSaveAiModel = async () => {
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...siteSettings, aiModel }),
      });
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.data);
        alert("AI model saved!");
      } else alert("Failed to save model");
    } catch {
      alert("Failed to save model");
    }
  };

  // ─── Knowledge handlers ───
  const handleSaveKnowledge = async () => {
    if (!knowledgeForm.title || !knowledgeForm.content) return;
    try {
      if (editingEntry) {
        const res = await fetch("/api/chatbot-knowledge", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editingEntry._id, ...knowledgeForm }),
        });
        const data = await res.json();
        if (data.success) {
          setKnowledgeEntries(
            knowledgeEntries.map((e) =>
              e._id === editingEntry._id ? data.data : e,
            ),
          );
          setEditingEntry(null);
        }
      } else {
        const res = await fetch("/api/chatbot-knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(knowledgeForm),
        });
        const data = await res.json();
        if (data.success) setKnowledgeEntries([data.data, ...knowledgeEntries]);
      }
      setKnowledgeForm({ title: "", content: "" });
    } catch {
      alert("Failed to save entry");
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`/api/chatbot-knowledge?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success)
        setKnowledgeEntries(knowledgeEntries.filter((e) => e._id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const inputCls =
    "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all";
  const labelCls =
    "block text-[10px] font-normal text-zinc-500 uppercase tracking-wider mb-2";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-50 lg:w-[130px]">
        <AdminSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Mobile sidebar - only visible on mobile */}
      <div className="lg:hidden">
        <AdminSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-[180px]">
        <div className="mx-auto px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-zinc-200">
                {activeTab === "overview"
                  ? "Dashboard"
                  : activeTab === "chatbot"
                    ? "Chatbot Knowledge"
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-sm text-zinc-500">
                {activeTab === "overview" && "Overview of your portfolio"}
                {activeTab === "projects" && `${projects.length} projects`}
                {activeTab === "messages" &&
                  `${submissions.length} message · ${submissions.filter((s) => !s.replied).length} unread`}
                {activeTab === "skills" && `${skills.length} skills`}
                {activeTab === "chatbot" &&
                  "Manage what your AI assistant knows about you"}
                {activeTab === "settings" && "Site settings"}
              </p>
            </div>
            {activeTab === "overview" && (
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            )}
            {activeTab === "projects" && (
              <button
                onClick={() => {
                  setEditingProject(undefined);
                  setIsProjectFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                <Plus size={14} /> Add Project
              </button>
            )}
            {activeTab === "skills" && (
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setSkillForm({ name: "", level: 80 });
                  setIsSkillFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                <Plus size={14} /> Add Skill
              </button>
            )}
            {activeTab === "messages" && (
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            )}
            {activeTab === "chatbot" && (
              <button
                onClick={() => {
                  setEditingEntry(null);
                  setKnowledgeForm({ title: "", content: "" });
                  setIsKnowledgeFormOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus size={14} /> Add Entry
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {/* ═══ Overview Tab ═══ */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "PROJECTS",
                        value: projects.length,
                        icon: FolderOpen,
                      },
                      { label: "SKILLS", value: skills.length, icon: Wrench },
                      {
                        label: "MESSAGES",
                        value: submissions.length,
                        icon: MessageSquare,
                      },
                      {
                        label: "UNREAD",
                        value: submissions.filter(
                          (s) =>
                            new Date(s.createdAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        ).length,
                        icon: Mail,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                      >
                        <div className="p-2 w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                          <stat.icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-3xl font-black text-zinc-100">
                          {stat.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Recent Messages */}
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                        <MessageSquare size={14} className="text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-200">
                          Recent Messages
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {submissions.slice(0, 5).map((s) => (
                          <div
                            key={s._id}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-indigo-400">
                                {s.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-200 truncate">
                                {s.name}
                              </p>
                              <p className="text-xs text-zinc-600 truncate">
                                {s.message?.slice(0, 40) ||
                                  formatDate(s.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {submissions.length === 0 && (
                          <p className="text-center py-6 text-zinc-600 text-sm">
                            No messages yet
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                        <Sparkles size={14} className="text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-200">
                          Quick Actions
                        </h3>
                      </div>
                      <div className="p-2">
                        {[
                          {
                            label: "Add new project",
                            icon: FolderOpen,
                            action: () => {
                              setActiveTab("projects");
                              setEditingProject(undefined);
                              setIsProjectFormOpen(true);
                            },
                          },
                          {
                            label: "Add new skill",
                            icon: Wrench,
                            action: () => setActiveTab("skills"),
                          },
                          {
                            label: "Manage chatbot knowledge",
                            icon: Sparkles,
                            action: () => setActiveTab("chatbot"),
                          },
                          {
                            label: "Update site settings",
                            icon: LinkIcon,
                            action: () => setActiveTab("settings"),
                          },
                        ].map((qa) => (
                          <button
                            key={qa.label}
                            onClick={qa.action}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/[0.03] text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <qa.icon size={14} className="text-zinc-600" />
                              <span>{qa.label}</span>
                            </div>
                            <ChevronRight size={14} className="text-zinc-700" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ Projects Tab ═══ */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  {/* Inline Project Form */}
                  <AdminProjectForm
                    project={editingProject}
                    isOpen={isProjectFormOpen}
                    onClose={() => {
                      setIsProjectFormOpen(false);
                      setEditingProject(undefined);
                    }}
                    onSave={handleProjectSave}
                  />

                  {/* Project List */}
                  <div className="space-y-3">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project._id || `project-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/20 transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/[0.06]">
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-semibold text-zinc-200 truncate">
                              {project.title}
                            </h3>
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-600 hover:text-indigo-400 transition-colors shrink-0"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-1 mb-1.5">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[10px] font-medium text-indigo-300/80 bg-indigo-500/[0.08] border border-indigo-500/10 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setIsProjectFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() =>
                              project._id && handleDeleteProject(project._id)
                            }
                            className="p-1.5 rounded-lg bg-white/[0.04] text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {projects.length === 0 && !isProjectFormOpen && (
                    <div className="text-center py-16">
                      <FolderOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">No projects yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ Skills Tab ═══ */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {/* Inline Skill Form */}
                  {isSkillFormOpen && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-indigo-400" />
                          <h3 className="text-sm font-semibold text-zinc-200">
                            {editingSkill ? "Edit Skill" : "New Skill"}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setIsSkillFormOpen(false);
                            setEditingSkill(null);
                            setSkillForm({ name: "", level: 80 });
                          }}
                          className="p-1.5 hover:bg-white/[0.04] rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                          <div>
                            <label className={labelCls}>Name</label>
                            <input
                              value={skillForm.name}
                              onChange={(e) =>
                                setSkillForm({
                                  ...skillForm,
                                  name: e.target.value,
                                })
                              }
                              className={inputCls}
                              placeholder="React"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>
                              Level ~ {skillForm.level}%
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={skillForm.level}
                              onChange={(e) =>
                                setSkillForm({
                                  ...skillForm,
                                  level: Number(e.target.value),
                                })
                              }
                              className="w-full accent-indigo-500 h-2 mt-1 cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => {
                              setIsSkillFormOpen(false);
                              setEditingSkill(null);
                              setSkillForm({ name: "", level: 80 });
                            }}
                            className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveSkill}
                            className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm flex items-center gap-2"
                          >
                            <Save size={14} /> Save Skill
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skill Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] group relative cursor-pointer hover:border-indigo-500/20 transition-all"
                        onClick={() => {
                          setEditingSkill(skill);
                          setSkillForm({
                            name: skill.name,
                            level: skill.level,
                          });
                          setIsSkillFormOpen(true);
                        }}
                      >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSkill(skill._id);
                            }}
                            className="p-1 rounded bg-white/[0.04] text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <h3 className="text-sm font-medium text-zinc-200 mb-3">
                          {skill.name}
                        </h3>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <p className="text-xs text-indigo-400/70">
                          {skill.level}%
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {skills.length === 0 && !isSkillFormOpen && (
                    <div className="text-center py-16">
                      <Wrench className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">
                        No skills added yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ Messages Tab ═══ */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <motion.div
                      key={submission._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
                    >
                      <div className="p-5">
                        {/* Header row: avatar, name, badge, email, date, delete */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-indigo-400">
                              {submission.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-zinc-200">
                                {submission.name}
                              </span>
                              {submission.replied && (
                                <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full">
                                  Replied
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500">
                              {submission.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-zinc-600">
                              {formatDate(submission.createdAt)}
                            </span>
                            <button
                              onClick={() =>
                                handleDeleteMessage(submission._id)
                              }
                              className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Message content */}
                        <div className="mt-3 ml-[52px]">
                          {submission.subject && (
                            <p className="text-sm font-medium text-zinc-300 mb-1">
                              {submission.subject}
                            </p>
                          )}
                          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {submission.message}
                          </p>
                        </div>

                        {/* Reply display */}
                        {submission.reply && (
                          <div className="mt-4 ml-[52px] p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/10">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Send size={10} className="text-emerald-400" />
                              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                Your reply
                              </span>
                            </div>
                            <p className="text-sm text-zinc-400">
                              {submission.reply}
                            </p>
                          </div>
                        )}

                        {/* Reply input */}
                        {!submission.replied &&
                          replyingTo === submission._id && (
                            <div className="mt-4 ml-[52px] flex gap-2">
                              <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleReplyMessage(submission._id);
                                }}
                                className={inputCls}
                                placeholder="Type your reply..."
                                autoFocus
                              />
                              <button
                                onClick={() =>
                                  handleReplyMessage(submission._id)
                                }
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm flex items-center gap-1.5 shrink-0"
                              >
                                <Send size={12} /> Send
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="px-3 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                        {/* Reply button */}
                        {!submission.replied &&
                          replyingTo !== submission._id && (
                            <div className="mt-3 ml-[52px]">
                              <button
                                onClick={() => {
                                  setReplyingTo(submission._id);
                                  setReplyText("");
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                              >
                                Reply
                              </button>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  ))}
                  {submissions.length === 0 && (
                    <div className="text-center py-16">
                      <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">No messages yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ Chatbot Tab ═══ */}
              {activeTab === "chatbot" && (
                <div className="space-y-6">
                  {/* AI Model Card */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] border-dashed">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-green-400" />
                      <h3 className="text-sm font-semibold text-zinc-200">
                        AI Model
                      </h3>
                    </div>
                    <label className={labelCls}>NVIDIA API Model</label>
                    <div className="flex gap-3">
                      <input
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className={`${inputCls} font-mono text-xs`}
                        placeholder="meta/llama-3.1-8b-instruct"
                      />
                      <button
                        onClick={handleSaveAiModel}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2 shrink-0"
                      >
                        <Save size={14} /> Save
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2">
                      Browse models at{" "}
                      <a
                        href="https://build.nvidia.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        build.nvidia.com
                      </a>
                    </p>
                  </div>

                  {/* New Entry Form */}
                  {(isKnowledgeFormOpen || editingEntry) && (
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] border-dashed space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-green-400" />
                          <h3 className="text-sm font-semibold text-zinc-200">
                            {editingEntry ? "Edit Entry" : "New Entry"}
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            setIsKnowledgeFormOpen(false);
                            setEditingEntry(null);
                            setKnowledgeForm({ title: "", content: "" });
                          }}
                          className="p-1 rounded-full bg-white/[0.04] text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div>
                        <label className={labelCls}>Category</label>
                        <input
                          value={knowledgeForm.title}
                          onChange={(e) =>
                            setKnowledgeForm({
                              ...knowledgeForm,
                              title: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="e.g. About, Projects, Skills, Contact, Experience"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Content</label>
                        <textarea
                          value={knowledgeForm.content}
                          onChange={(e) =>
                            setKnowledgeForm({
                              ...knowledgeForm,
                              content: e.target.value,
                            })
                          }
                          className={`${inputCls} resize-none`}
                          rows={5}
                          placeholder="Enter information the chatbot should know..."
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setIsKnowledgeFormOpen(false);
                            setEditingEntry(null);
                            setKnowledgeForm({ title: "", content: "" });
                          }}
                          className="px-4 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleSaveKnowledge();
                            setIsKnowledgeFormOpen(false);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <Save size={14} /> Save Entry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Knowledge Entries */}
                  {knowledgeEntries.length > 0 ? (
                    <div className="space-y-3">
                      {knowledgeEntries.map((entry) => (
                        <motion.div
                          key={entry._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen size={14} className="text-green-400" />
                              <h3 className="text-sm font-semibold text-zinc-200">
                                {entry.title}
                              </h3>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingEntry(entry);
                                  setKnowledgeForm({
                                    title: entry.title,
                                    content: entry.content,
                                  });
                                  setIsKnowledgeFormOpen(true);
                                }}
                                className="p-1.5 rounded bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteKnowledge(entry._id)}
                                className="p-1.5 rounded bg-white/[0.04] text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 whitespace-pre-wrap leading-relaxed">
                            {entry.content}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-400 text-sm font-medium">
                        No knowledge entries yet
                      </p>
                      <p className="text-zinc-600 text-xs mt-1">
                        Add entries so the chatbot knows about you
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ Settings Tab ═══ */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-500">
                      Configure your portfolio content
                    </p>
                    <button
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors text-sm"
                    >
                      <Save size={16} />
                      <span>
                        {savingSettings ? "Saving..." : "Save Changes"}
                      </span>
                    </button>
                  </div>

                  {/* Hero Section */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-400" />
                      <h3 className="text-sm font-semibold text-zinc-200">
                        Hero Section
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Subtitle</label>
                        <input
                          value={siteSettings.heroSubtitle}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              heroSubtitle: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="Full Stack Developer"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Hero Image</label>
                        <div className="flex gap-2">
                          <input
                            value={siteSettings.heroImage}
                            onChange={(e) =>
                              setSiteSettings({
                                ...siteSettings,
                                heroImage: e.target.value,
                              })
                            }
                            className={inputCls}
                            placeholder="/hero.webp"
                          />
                          <input
                            ref={heroImageRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                handleFileUpload(f, (url) =>
                                  setSiteSettings({
                                    ...siteSettings,
                                    heroImage: url,
                                  }),
                                );
                            }}
                          />
                          <button
                            onClick={() => heroImageRef.current?.click()}
                            className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs flex items-center gap-1.5 shrink-0"
                          >
                            <Upload size={12} /> Upload
                          </button>
                        </div>
                        {siteSettings.heroImage && (
                          <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden border border-white/[0.06]">
                            <Image
                              src={siteSettings.heroImage}
                              alt=""
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Title Line 1</label>
                        <input
                          value={siteSettings.titleLine1}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              titleLine1: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="Zahid"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Title Line 2</label>
                        <input
                          value={siteSettings.titleLine2}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              titleLine2: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="Farooq"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea
                        value={siteSettings.heroDescription}
                        onChange={(e) =>
                          setSiteSettings({
                            ...siteSettings,
                            heroDescription: e.target.value,
                          })
                        }
                        className={`${inputCls} resize-none`}
                        rows={3}
                        placeholder="Software Engineer specializing in..."
                      />
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-green-400" />
                      <h3 className="text-sm font-semibold text-zinc-200">
                        About Section
                      </h3>
                    </div>
                    <div>
                      <label className={labelCls}>About Image</label>
                      <div className="flex gap-2">
                        <input
                          value={siteSettings.aboutImage}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              aboutImage: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="/about.webp"
                        />
                        <input
                          ref={aboutImageRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleFileUpload(f, (url) =>
                                setSiteSettings({
                                  ...siteSettings,
                                  aboutImage: url,
                                }),
                              );
                          }}
                        />
                        <button
                          onClick={() => aboutImageRef.current?.click()}
                          className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs flex items-center gap-1.5 shrink-0"
                        >
                          <Upload size={12} /> Upload
                        </button>
                      </div>
                      {siteSettings.aboutImage && (
                        <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-white/[0.06]">
                          <Image
                            src={siteSettings.aboutImage}
                            alt=""
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>About Paragraphs</label>
                      {siteSettings.aboutParagraphs.map((p, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <textarea
                            value={p}
                            onChange={(e) => {
                              const updated = [...siteSettings.aboutParagraphs];
                              updated[i] = e.target.value;
                              setSiteSettings({
                                ...siteSettings,
                                aboutParagraphs: updated,
                              });
                            }}
                            className={`${inputCls} resize-none`}
                            rows={2}
                          />
                          <button
                            onClick={() =>
                              setSiteSettings({
                                ...siteSettings,
                                aboutParagraphs:
                                  siteSettings.aboutParagraphs.filter(
                                    (_, idx) => idx !== i,
                                  ),
                              })
                            }
                            className="p-2 text-red-400 hover:text-red-300 shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setSiteSettings({
                            ...siteSettings,
                            aboutParagraphs: [
                              ...siteSettings.aboutParagraphs,
                              "",
                            ],
                          })
                        }
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        + Add paragraph
                      </button>
                    </div>
                  </div>

                  {/* Resume */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2">
                      <Upload size={16} className="text-orange-400" />
                      <h3 className="text-sm font-semibold text-zinc-200">
                        Resume
                      </h3>
                    </div>
                    <div>
                      <label className={labelCls}>Resume URL</label>
                      <div className="flex gap-2">
                        <input
                          value={siteSettings.resumeUrl}
                          onChange={(e) =>
                            setSiteSettings({
                              ...siteSettings,
                              resumeUrl: e.target.value,
                            })
                          }
                          className={inputCls}
                          placeholder="Paste URL or upload a PDF"
                        />
                        <input
                          ref={resumeFileRef}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleFileUpload(f, (url) =>
                                setSiteSettings({
                                  ...siteSettings,
                                  resumeUrl: url,
                                }),
                              );
                          }}
                        />
                        <button
                          onClick={() => resumeFileRef.current?.click()}
                          className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs flex items-center gap-1.5 shrink-0"
                        >
                          <Upload size={12} /> Upload
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-yellow-400" />
                      <h3 className="text-sm font-semibold text-zinc-200">
                        Stats
                      </h3>
                    </div>
                    {siteSettings.stats.map((stat, i) => (
                      <div key={i} className="grid grid-cols-5 gap-3 items-end">
                        <div className="col-span-2">
                          <label className={labelCls}>Value</label>
                          <input
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...siteSettings.stats];
                              updated[i] = {
                                ...updated[i],
                                value: e.target.value,
                              };
                              setSiteSettings({
                                ...siteSettings,
                                stats: updated,
                              });
                            }}
                            className={inputCls}
                            placeholder="3+"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={labelCls}>Label</label>
                          <input
                            value={stat.label}
                            onChange={(e) => {
                              const updated = [...siteSettings.stats];
                              updated[i] = {
                                ...updated[i],
                                label: e.target.value,
                              };
                              setSiteSettings({
                                ...siteSettings,
                                stats: updated,
                              });
                            }}
                            className={inputCls}
                            placeholder="Years Experience"
                          />
                        </div>
                        <button
                          onClick={() =>
                            setSiteSettings({
                              ...siteSettings,
                              stats: siteSettings.stats.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                          className="p-3 text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setSiteSettings({
                          ...siteSettings,
                          stats: [
                            ...siteSettings.stats,
                            { value: "", label: "" },
                          ],
                        })
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      + Add stat
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
