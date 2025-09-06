import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env";

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string, email: string): string => {
  const payload = { sub: userId, email };
  const options: SignOptions = { expiresIn: env.JWT_EXPIRE };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const generateConfirmationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
