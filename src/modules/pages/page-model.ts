import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  content?: string;
  createdAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>('Page', pageSchema);
