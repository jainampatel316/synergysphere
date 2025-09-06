import { config } from "dotenv";

// Load environment variables
config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  SOCKET_ORIGIN: string;
  
  // Email configuration
  EMAIL_PROVIDER: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  EMAIL_FROM?: string;
  EMAIL_FROM_NAME?: string;
  
  // SendGrid (legacy)
  SENDGRID_API_KEY?: string;
}

const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000"),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/synergysphere",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  SOCKET_ORIGIN: process.env.SOCKET_ORIGIN || "http://localhost:8080",
  
  // Email configuration
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || "smtp",
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  
  // SendGrid (legacy)
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

// Validation
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

export default env;
