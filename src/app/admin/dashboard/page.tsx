"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ChatbotTab from "@/components/admin/tabs/ChatbotTab";
import MessagesTab from "@/components/admin/tabs/MessagesTab";
import OverviewTab from "@/components/admin/tabs/OverviewTab";
import ProjectsTab, { ProjectEditorState } from "@/components/admin/tabs/ProjectsTab";
import SettingsTab from "@/components/admin/tabs/SettingsTab";
import SkillsTab, { SkillEditorState } from "@/components/admin/tabs/SkillsTab";
import {
  AdminTab,
  EMPTY_SETTINGS,
  KnowledgeEntry,
  SiteSettings,
  Skill,
  Submission,
} from "@/components/admin/types";
import { adminFetch, errorMessage, FeedbackProvider } from "@/components/admin/ui";
import { Project } from "@/types/Project";

const TAB_TITLES: Record<AdminTab, string> = {
  overview: "Overview",
  projects: "Projects",
  skills: "Skills",
  messages: "Messages",
  chatbot: "Chatbot",
  settings: "Settings",
};

function tabFromHash(): AdminTab {
  const hash = window.location.hash.slice(1);
  return hash in TAB_TITLES ? (hash as AdminTab) : "overview";
}

function DashboardContent() {
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [projectEditor, setProjectEditor] = useState<ProjectEditorState>({ open: false });
  const [skillEditor, setSkillEditor] = useState<SkillEditorState>({ open: false });

  // The tab lives in the URL so a reload or the back button keeps your place
  useEffect(() => {
    const syncTab = () => setActiveTab(tabFromHash());
    syncTab();
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);

  const openTab = useCallback((tab: AdminTab) => {
    window.location.hash = tab;
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [auth, projectData, submissionData, skillData, settingsData, knowledgeData] =
        await Promise.all([
          fetch("/api/auth/verify", { credentials: "include" }).then((r) => r.json()),
          adminFetch<Project[]>("/api/projects"),
          adminFetch<Submission[]>("/api/contact"),
          adminFetch<Skill[]>("/api/skills"),
          adminFetch<SiteSettings>("/api/site-settings"),
          adminFetch<KnowledgeEntry[]>("/api/chatbot-knowledge"),
        ]);
      setEmail(auth.user?.email ?? "");
      setProjects(projectData);
      setSubmissions(submissionData);
      setSkills(skillData);
      setSiteSettings({ ...EMPTY_SETTINGS, ...settingsData });
      setKnowledgeEntries(knowledgeData);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applySettings = useCallback((settings: SiteSettings) => {
    setSiteSettings({ ...EMPTY_SETTINGS, ...settings });
  }, []);

  const awaitingReply = submissions.filter((s) => !s.replied).length;

  return (
    <div className="min-h-screen">
      <AdminSidebar
        email={email}
        activeTab={activeTab}
        onTabChange={openTab}
        awaitingReply={awaitingReply}
      />

      <main className="lg:pl-60">
        <div className="lg:sticky lg:top-0 z-20 bg-surface/85 backdrop-blur-md lg:border-b lg:border-line">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-5 lg:py-4">
            <h1 className="text-xl font-semibold tracking-tight">{TAB_TITLES[activeTab]}</h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 lg:py-8">
          {loading ? (
            <p role="status" className="text-muted">
              Loading your content
            </p>
          ) : loadError ? (
            <div role="alert" className="rounded-xl bg-danger-soft text-danger p-5">
              <p className="font-semibold">Your content didn&apos;t load.</p>
              <p className="mt-1">{loadError}</p>
              <button type="button" onClick={loadData} className="btn btn-quiet mt-4">
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  projectCount={projects.length}
                  skillCount={skills.length}
                  submissions={submissions}
                  awaitingReply={awaitingReply}
                  onOpen={openTab}
                  onAddProject={() => {
                    setProjectEditor({ open: true });
                    openTab("projects");
                  }}
                  onAddSkill={() => {
                    setSkillEditor({ open: true });
                    openTab("skills");
                  }}
                />
              )}
              {activeTab === "projects" && (
                <ProjectsTab
                  projects={projects}
                  setProjects={setProjects}
                  editor={projectEditor}
                  setEditor={setProjectEditor}
                />
              )}
              {activeTab === "skills" && (
                <SkillsTab
                  skills={skills}
                  setSkills={setSkills}
                  editor={skillEditor}
                  setEditor={setSkillEditor}
                />
              )}
              {activeTab === "messages" && (
                <MessagesTab
                  submissions={submissions}
                  setSubmissions={setSubmissions}
                  onRefresh={loadData}
                />
              )}
              {activeTab === "chatbot" && (
                <ChatbotTab
                  aiModel={siteSettings.aiModel}
                  onModelSaved={applySettings}
                  entries={knowledgeEntries}
                  setEntries={setKnowledgeEntries}
                />
              )}
              {activeTab === "settings" && (
                <SettingsTab settings={siteSettings} onSaved={applySettings} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <FeedbackProvider>
      <DashboardContent />
    </FeedbackProvider>
  );
}
