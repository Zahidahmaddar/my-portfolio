import mongoose, { Document, Schema } from 'mongoose';

export interface IChatbotKnowledge extends Document {
  title: string;
  content: string;
  createdAt: Date;
}

const ChatbotKnowledgeSchema = new Schema<IChatbotKnowledge>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ChatbotKnowledge || mongoose.model<IChatbotKnowledge>('ChatbotKnowledge', ChatbotKnowledgeSchema);
