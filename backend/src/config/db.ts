import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
    
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
    
    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("SIGINT received. Closing MongoDB connection...");
      await mongoose.connection.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
