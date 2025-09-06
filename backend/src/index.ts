import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import passport from "passport";
import env from "./config/env";
import connectDB from "./config/db";
import { verifyToken } from "./utils/jwt";
import "./types"; // Import types to ensure global declarations are loaded
// import "./config/passport"; // Initialize passport strategies

// Extend Socket interface for custom properties
interface AuthenticatedSocket extends Socket {
  userId: string;
  userEmail: string;
}

// Import routes
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import emailTestRoutes from "./routes/email-test.routes";
import attachmentRoutes from "./routes/attachment.routes";
import invitationRoutes from "./routes/invitation.routes";
import analyticsRoutes from "./routes/analytics.routes";

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = new SocketIOServer(server, {
  cors: {
    origin: env.SOCKET_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.SOCKET_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
// app.use(passport.initialize());

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { error: "Too many requests, please try again later" }
});
app.use(globalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connected: dbStatus === 1
    },
    server: {
      port: env.PORT,
      socketOrigin: env.SOCKET_ORIGIN
    }
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/email-test", emailTestRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation error", details: err.message });
  }
  
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  
  res.status(500).json({ 
    error: "Internal server error",
    ...(env.NODE_ENV === "development" && { details: err.message })
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    
    const payload = verifyToken(token);
    (socket as any).userId = payload.sub;
    (socket as any).userEmail = payload.email;
    next();
  } catch (error) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  const authSocket = socket as any;
  console.log(`User ${authSocket.userEmail} connected to socket`);
  
  // Join user to their personal room for notifications
  socket.join(`user:${authSocket.userId}`);
  
  // Handle joining project rooms
  socket.on("join-project", (projectId: string) => {
    socket.join(`project:${projectId}`);
    console.log(`User ${authSocket.userEmail} joined project room: ${projectId}`);
  });
  
  // Handle leaving project rooms
  socket.on("leave-project", (projectId: string) => {
    socket.leave(`project:${projectId}`);
    console.log(`User ${authSocket.userEmail} left project room: ${projectId}`);
  });
  
  socket.on("disconnect", () => {
    console.log(`User ${authSocket.userEmail} disconnected`);
  });
});

// Enhanced Socket.io notification functions
export const notifyUser = (userId: string, type: string, data: any) => {
  io.to(`user:${userId}`).emit("notification", {
    type,
    data,
    timestamp: new Date().toISOString()
  });
};

export const notifyProject = (projectId: string, type: string, data: any, excludeUserId?: string) => {
  const notification = {
    type,
    data,
    timestamp: new Date().toISOString()
  };
  
  if (excludeUserId) {
    io.to(`project:${projectId}`).except(`user:${excludeUserId}`).emit("notification", notification);
  } else {
    io.to(`project:${projectId}`).emit("notification", notification);
  }
};

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start listening
    const port = env.PORT;
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📧 Email provider: ${env.EMAIL_PROVIDER}`);
      console.log(`🌐 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Socket.io origin: ${env.SOCKET_ORIGIN}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Start the server
startServer();

export default app;
