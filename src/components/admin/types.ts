export interface Submission {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  reply?: string;
  replied?: boolean;
  createdAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  level: number;
}

export interface SiteSettings {
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

export interface KnowledgeEntry {
  _id: string;
  title: string;
  content: string;
}

export const EMPTY_SETTINGS: SiteSettings = {
  heroSubtitle: "",
  heroImage: "",
  titleLine1: "",
  titleLine2: "",
  heroDescription: "",
  aboutImage: "",
  aboutParagraphs: [],
  resumeUrl: "",
  stats: [],
  aiModel: "",
};

export type AdminTab =
  | "overview"
  | "projects"
  | "skills"
  | "messages"
  | "chatbot"
  | "settings";
