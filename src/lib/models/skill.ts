import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number;
  createdAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
