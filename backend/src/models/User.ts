import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isEmailConfirmed: boolean;
  emailConfirmationToken?: string;
  emailConfirmationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateConfirmationToken(): string;
  generateResetToken(): string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.googleId; // Password required if not Google OAuth
    },
    minlength: 6
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  emailConfirmationToken: {
    type: String,
    index: true
  },
  emailConfirmationExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String,
    index: true
  },
  resetPasswordExpires: {
    type: Date
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  avatar: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ emailConfirmationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ googleId: 1 });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate confirmation token
userSchema.methods.generateConfirmationToken = function(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(20).toString("hex");
};

// Generate reset token
userSchema.methods.generateResetToken = function(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(20).toString("hex");
};

export default model<IUser>("User", userSchema);
