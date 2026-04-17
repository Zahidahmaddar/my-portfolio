import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  reply?: string;
  replied: boolean;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: '',
  },
  replied: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
