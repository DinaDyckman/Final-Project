
import mongoose, { Document, Schema } from 'mongoose';

export interface IaiMode extends Document {
  userId: mongoose.Types.ObjectId; 
  userQuery: string;               
  aiResponse: string;             
  suggestedColor?: string;         
  createdAt: Date;
  updatedAt: Date; 
}

const aiModeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  userQuery: { type: String, required: true },
  aiResponse: { type: String, required: true },
  suggestedColor: { type: String },
}, { 
  timestamps: true 
});

export default mongoose.model<IaiMode>('aiMode', aiModeSchema);