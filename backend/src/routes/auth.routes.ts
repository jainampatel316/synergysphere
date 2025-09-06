import { Router } from "express";
import { 
  register, 
  login, 
  confirmEmail, 
  getCurrentUser,
  requestPasswordReset,
  resetPassword
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../utils/validation";
import Joi from "joi";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many authentication attempts, please try again later" }
});

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const confirmEmailSchema = Joi.object({
  token: Joi.string().required()
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// Routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/confirm-email", validate(confirmEmailSchema), confirmEmail);
router.post("/request-password-reset", authLimiter, validate(passwordResetRequestSchema), requestPasswordReset);
router.post("/reset-password", validate(passwordResetSchema), resetPassword);

// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;
