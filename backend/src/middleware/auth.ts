import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(payload.sub).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      isEmailConfirmed: user.isEmailConfirmed
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireEmailConfirmation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isEmailConfirmed) {
    return res.status(403).json({ 
      error: "Email confirmation required",
      message: "Please confirm your email address before accessing this resource"
    });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // This would need to be implemented based on your admin system
  // For now, just pass through
  next();
};

export default { authenticate, requireEmailConfirmation, requireAdmin };
