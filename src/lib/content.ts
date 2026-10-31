import connectDB from "@/lib/db";
import ProjectModel from "@/lib/models/project";
import SkillModel from "@/lib/models/skill";
import SiteSettingsModel from "@/lib/models/siteSettings";
import { Project } from "@/types/Project";

export interface PublicSkill {
  _id: string;
  name: string;
  level: number;
}

export interface PublicSettings {
  heroSubtitle?: string;
  heroImage?: string;
  titleLine1?: string;
  titleLine2?: string;
  heroDescription?: string;
  aboutImage?: string;
  aboutParagraphs?: string[];
  resumeUrl?: string;
  stats?: { value: string; label: string }[];
}

export interface PortfolioContent {
  projects: Project[];
  skills: PublicSkill[];
  settings: PublicSettings | null;
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    await connectDB();
    const [projects, skills, settings] = await Promise.all([
      ProjectModel.find().sort({ createdAt: -1 }).lean(),
      SkillModel.find().sort({ level: -1, name: 1 }).lean(),
      SiteSettingsModel.findOne().lean(),
    ]);
    // Flatten ObjectIds and Dates so the data can cross into client components
    return JSON.parse(JSON.stringify({ projects, skills, settings }));
  } catch (error) {
    // Let a build finish without a database; pages revalidate once it is back.
    // At runtime rethrow, so a failed revalidation keeps the last good page
    // instead of caching an empty one.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.error("Building without portfolio content:", error);
      return { projects: [], skills: [], settings: null };
    }
    throw error;
  }
}
