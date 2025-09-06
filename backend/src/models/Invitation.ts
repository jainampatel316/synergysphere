import { Schema, model, Document, Types } from "mongoose";

export interface IInvitation extends Document {
  projectId: Types.ObjectId;
  invitedBy: Types.ObjectId;
  email: string;
  role: "member" | "admin";
  token: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member"
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "expired"],
    default: "pending",
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound indexes
invitationSchema.index({ email: 1, projectId: 1 });
invitationSchema.index({ token: 1, status: 1 });
invitationSchema.index({ expiresAt: 1, status: 1 });

// Auto-expire invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for invitation validity
invitationSchema.virtual("isValid").get(function() {
  return this.status === "pending" && this.expiresAt > new Date();
});

// Method to check if invitation is expired
invitationSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

export default model<IInvitation>("Invitation", invitationSchema);
