import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  projectId: Types.ObjectId;
  assigneeId?: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments: string[];
  comments: Array<{
    userId: Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  dependencies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "review", "done"],
    default: "todo",
    index: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
    index: true
  },
  dueDate: {
    type: Date,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  attachments: [{
    type: String
  }],
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: "Task"
  }]
}, {
  timestamps: true
});

// Indexes
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ priority: 1 });

// Virtual for overdue status
taskSchema.virtual("isOverdue").get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== "done";
});

export default model<ITask>("Task", taskSchema);
