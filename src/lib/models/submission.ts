import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  name: string;
  email: string;
  message: string;
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
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
