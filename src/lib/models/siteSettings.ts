import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  // Hero Section
  heroSubtitle: string;
  heroImage: string;
  titleLine1: string;
  titleLine2: string;
  heroDescription: string;
  // About Section
  aboutImage: string;
  aboutParagraphs: string[];
  // Resume
  resumeUrl: string;
  // Stats
  stats: { value: string; label: string }[];
  // Chatbot
  aiModel: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  heroSubtitle: {
    type: String,
    default: 'Full Stack Developer',
  },
  heroImage: {
    type: String,
    default: '',
  },
  titleLine1: {
    type: String,
    default: 'Zahid',
  },
  titleLine2: {
    type: String,
    default: 'Farooq',
  },
  heroDescription: {
    type: String,
    default: '',
  },
  aboutImage: {
    type: String,
    default: '',
  },
  aboutParagraphs: {
    type: [String],
    default: [],
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  stats: {
    type: [{ value: String, label: String }],
    default: [],
  },
  aiModel: {
    type: String,
    default: 'meta/llama-3.1-8b-instruct',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
