import { Schema, model, Document, Types } from "mongoose";

export interface IAttachment extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  projectId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  taskId?: Types.ObjectId;
  description?: string;
  isPublic: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  path: {
    type: String,
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    index: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
attachmentSchema.index({ projectId: 1, createdAt: -1 });
attachmentSchema.index({ uploadedBy: 1 });
attachmentSchema.index({ taskId: 1 });

// Virtual for file size in human readable format
attachmentSchema.virtual("sizeFormatted").get(function() {
  const bytes = this.size;
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
});

export default model<IAttachment>("Attachment", attachmentSchema);
